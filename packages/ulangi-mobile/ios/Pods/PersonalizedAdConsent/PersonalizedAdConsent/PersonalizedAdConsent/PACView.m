//
//  Copyright 2018 Google LLC
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//

#import "PACView.h"

#import "PACError.h"

/// Dictionary keys for processed form status strings.
typedef NSString *PACFormStatusKey NS_STRING_ENUM;
/// Error object key.
static PACFormStatusKey const PACFormStatusKeyError = @"error";
/// Indicates whether the user chose the ad-free option.
static PACFormStatusKey const PACFormStatusKeyUserPrefersAdFree = @"ad_free";

/// Returns a JSON encoded string for the provided dictionary. Returns JSON encoded empty dictionary
/// if the encoding fails.
static NSString *_Nullable PACJSONStringForDictionary(NSDictionary *_Nonnull dictionary) {
  NSCAssert([NSJSONSerialization isValidJSONObject:dictionary], @"Must be valid JSON object.");
  NSData *data = [NSJSONSerialization dataWithJSONObject:dictionary options:0 error:NULL];
  if (!data.length) {
    return @"{}";
  }
  NSString *JSONString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  return JSONString;
}

/// Returns the application's short name.
static NSString *_Nonnull PACShortAppName(void) {
  NSBundle *mainBundle = [NSBundle mainBundle];
  NSDictionary *localizedInfoDictionary = [mainBundle localizedInfoDictionary];

  NSString *shortAppName = localizedInfoDictionary[@"CFBundleDisplayName"];
  if (shortAppName) {
    return shortAppName;
  }

  NSDictionary *infoDictionary = [mainBundle infoDictionary];
  shortAppName = infoDictionary[@"CFBundleDisplayName"];
  if (shortAppName) {
    return shortAppName;
  }

  shortAppName = localizedInfoDictionary[@"CFBundleName"];
  if (shortAppName) {
    return shortAppName;
  }

  shortAppName = infoDictionary[@"CFBundleName"];
  if (shortAppName) {
    return shortAppName;
  }

  return @"";
}

/// Returns the application's icon as a data URI string.
static NSString *_Nonnull PACIconDataURIString(void) {
  NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
  NSArray<NSString *> *iconFiles =
      infoDictionary[@"CFBundleIcons"][@"CFBundlePrimaryIcon"][@"CFBundleIconFiles"];
  NSString *iconName = iconFiles.lastObject;
  if (!iconName) {
    return @"";
  }

  UIImage *iconImage = [UIImage imageNamed:iconName];
  NSData *iconData = UIImagePNGRepresentation(iconImage);
  NSString *iconBase64String = [iconData base64EncodedStringWithOptions:0];

  return [@"data:image/png;base64," stringByAppendingString:iconBase64String];
}

/// Returns a JavaScript command with the provided function name and arguments.
static NSString *_Nonnull PACCreateJavaScriptCommandString(NSString *_Nonnull functionName,
                                                           NSDictionary *_Nonnull arguments) {
  NSDictionary *wrappedArgs = @{ @"args" : arguments };
  NSString *wrappedArgsJSONString = PACJSONStringForDictionary(wrappedArgs);
  NSString *command = [[NSString alloc]
      initWithFormat:@"setTimeout(function(){%@(%@);}, 1);", functionName, wrappedArgsJSONString];
  return command;
}

/// Returns YES if the status string represents an error status.
static BOOL PACIsErrorStatusString(NSString *_Nonnull statusString) {
  NSRange range =
      [statusString rangeOfString:@"error" options:NSAnchoredSearch | NSCaseInsensitiveSearch];
  return range.location != NSNotFound;
}

/// Returns the provided URL's query parameters as a dictionary.
static NSDictionary<NSString *, NSString *> *_Nonnull
PACQueryParametersFromURL(NSURL *_Nonnull URL) {
  NSString *queryString = URL.query;
  if (!queryString) {
    NSString *resourceSpecifier = URL.resourceSpecifier;
    NSRange questionPosition = [resourceSpecifier rangeOfString:@"?"];
    if (questionPosition.location != NSNotFound) {
      queryString = [URL.resourceSpecifier
          substringFromIndex:questionPosition.location + questionPosition.length];
    }
  }

  NSArray<NSString *> *keyValuePairStrings = [queryString componentsSeparatedByString:@"&"];
  NSMutableDictionary *parameterDictionary = [[NSMutableDictionary alloc] init];

  [keyValuePairStrings
      enumerateObjectsUsingBlock:^(NSString *pairString, NSUInteger idx, BOOL *stop) {
        NSArray<NSString *> *keyValuePair = [pairString componentsSeparatedByString:@"="];
        if (keyValuePair.count != 2) {
          return;
        }
        NSString *key = keyValuePair.firstObject.stringByRemovingPercentEncoding;
        NSString *value = keyValuePair.lastObject.stringByRemovingPercentEncoding;
        if (value && key) {
          parameterDictionary[key] = value;
        }
      }];

  return parameterDictionary;
}

@interface PACView () <UIWebViewDelegate>
@end

@implementation PACView {
  UIWebView *_webView;
  NSDictionary<PACFormKey, id> *_formInformation;
  PACLoadCompletion _loadCompletionHandler;
}

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    self.backgroundColor = UIColor.clearColor;
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    _webView = [[UIWebView alloc] initWithFrame:frame];
    _webView.delegate = self;
    _webView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _webView.backgroundColor = UIColor.clearColor;
    _webView.opaque = NO;
    _webView.scrollView.bounces = NO;

    [self addSubview:_webView];
  }
  return self;
}

- (void)loadWithFormInformation:(nonnull NSDictionary<PACFormKey, id> *)formInformation
              completionHandler:(nonnull PACLoadCompletion)handler {
  formInformation = [formInformation copy];
  PACLoadCompletion wrappedHandler = ^(NSError *_Nullable error) {
    if (handler) {
      handler(error);
    }
  };
  dispatch_async(dispatch_get_main_queue(), ^{
    if (self->_loadCompletionHandler) {
      // In progress.
      NSError *error = PACErrorWithDescription(@"Another load is in progress.");
      wrappedHandler(error);
      return;
    }
    self->_formInformation = formInformation;
    self->_loadCompletionHandler = wrappedHandler;
    [self loadWebView];
  });
}

/// Returns the resource bundle located within |bundle|.
- (nullable NSBundle *)resourceBundleForBundle:(nonnull NSBundle *)bundle {
  NSURL *resourceBundleURL =
      [bundle URLForResource:@"PersonalizedAdConsent" withExtension:@"bundle"];
  if (resourceBundleURL) {
    return [NSBundle bundleWithURL:resourceBundleURL];
  }
  return nil;
}

/// Loads the consent form HTML into the web view.
- (void)loadWebView {
  NSBundle *bundle = [NSBundle bundleForClass:[self class]];
  NSBundle *resourceBundle = [self resourceBundleForBundle:bundle];
  if (!resourceBundle) {
    resourceBundle = [self resourceBundleForBundle:[NSBundle mainBundle]];
  }
  if (!resourceBundle) {
    NSError *error =
        PACErrorWithDescription(@"Resource bundle not found. Ensure the resource bundle is "
                                @"packaged with your application or framework bundle.");
    [self loadCompletedWithError:error];
    return;
  }
  NSURL *URL = [resourceBundle URLForResource:@"consentform" withExtension:@"html"];
  NSURLRequest *URLRequest = [[NSURLRequest alloc] initWithURL:URL];
  [_webView loadRequest:URLRequest];
}

/// Updates the web view with consent form and app information.
- (void)updateWebViewInformation {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSMutableDictionary<PACFormKey, id> *mutableFormInformation =
        [self->_formInformation mutableCopy];
    mutableFormInformation[PACFormKeyAppName] = PACShortAppName();
    mutableFormInformation[PACFormKeyAppIcon] = PACIconDataURIString();
    mutableFormInformation[PACFormKeyPlatform] = @"ios";

    NSString *infoString = PACJSONStringForDictionary(mutableFormInformation);
    NSString *command = PACCreateJavaScriptCommandString(@"setUpConsentDialog", @{
      @"info" : infoString
    });
    [self->_webView stringByEvaluatingJavaScriptFromString:command];
  });
}

/// Handles load completion.
- (void)loadCompletedWithError:(nullable NSError *)error {
  dispatch_async(dispatch_get_main_queue(), ^{
    PAC_MUST_BE_MAIN_THREAD();
    if (self->_loadCompletionHandler) {
      self->_loadCompletionHandler(error);
    }
    self->_loadCompletionHandler = nil;
  });
}

/// Handles dismissing the view.
- (void)dismissWithStatusString:(nullable NSString *)statusString {
  NSDictionary<PACFormStatusKey, id> *formStatus = [self formStatusForStatusString:statusString];
  dispatch_async(dispatch_get_main_queue(), ^{
    PAC_MUST_BE_MAIN_THREAD();
    if (self->_dismissCompletion) {
      NSError *error = formStatus[PACFormStatusKeyError];
      NSNumber *userPrefersAdFreeNumber = formStatus[PACFormStatusKeyUserPrefersAdFree];
      self->_dismissCompletion(error, userPrefersAdFreeNumber.boolValue);
    }
    self->_dismissCompletion = nil;
  });
}

/// Handles showing the URL in a browser.
- (void)showBrowser:(nonnull NSURL *)URL {
  UIApplication *sharedApplication = UIApplication.sharedApplication;
  if ([sharedApplication respondsToSelector:@selector(openURL:options:completionHandler:)]) {
    if (@available(iOS 10.0, *)) {
      [sharedApplication openURL:URL options:@{} completionHandler:nil];
    }
  } else {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
    [UIApplication.sharedApplication openURL:URL];
#pragma clang diagnostic pop
  }
}

/// Returns a form status dictionary for the provided status string.
- (NSDictionary<PACFormStatusKey, id> *)formStatusForStatusString:
        (nullable NSString *)statusString {
  NSMutableDictionary<PACFormStatusKey, id> *formStatus = [[NSMutableDictionary alloc] init];
  // Handle errors and ad-free option.
  if (!statusString.length) {
    formStatus[PACFormStatusKeyError] = PACErrorWithDescription(@"No information.");
  }
  if (PACIsErrorStatusString(statusString)) {
    formStatus[PACFormStatusKeyError] = PACErrorWithDescription(statusString);
  }

  formStatus[PACFormStatusKeyUserPrefersAdFree] = @([statusString isEqual:@"ad_free"]);

  // Handle personalized ad consent.
  BOOL selectedNonPersonalizedAds = [statusString isEqual:@"non_personalized"];
  BOOL selectedPersonalizedAds = [statusString isEqual:@"personalized"];

  if (selectedPersonalizedAds) {
    PACConsentInformation.sharedInstance.consentStatus = PACConsentStatusPersonalized;
  } else if (selectedNonPersonalizedAds) {
    PACConsentInformation.sharedInstance.consentStatus = PACConsentStatusNonPersonalized;
  } else {
    PACConsentInformation.sharedInstance.consentStatus = PACConsentStatusUnknown;
  }

  return formStatus;
}

#pragma mark UIWebViewDelegate

- (void)webViewDidFinishLoad:(UIWebView *)webView {
  [self updateWebViewInformation];
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
  [self loadCompletedWithError:error];
}

- (BOOL)webView:(nonnull UIWebView *)webView
    shouldStartLoadWithRequest:(nonnull NSURLRequest *)request
                navigationType:(UIWebViewNavigationType)navigationType {
  NSString *URLString = request.URL.absoluteString;

  if (![URLString hasPrefix:@"consent://"]) {
    return YES;
  }

  NSDictionary<NSString *, NSString *> *parameters = PACQueryParametersFromURL(request.URL);
  NSString *action = parameters[@"action"];
  NSCAssert(action.length > 0, @"Messages must have actions.");

  if ([action isEqual:@"load_complete"]) {
    NSString *statusString = parameters[@"status"];
    NSError *loadError = nil;
    if (!statusString.length) {
      loadError = PACErrorWithDescription(@"No information.");
    }
    if (PACIsErrorStatusString(statusString)) {
      loadError = PACErrorWithDescription(statusString);
    }

    // Load was successful if the status string isn't an empty or error string.
    [self loadCompletedWithError:loadError];
  }

  if ([action isEqual:@"dismiss"]) {
    NSString *statusString = parameters[@"status"];
    [self dismissWithStatusString:statusString];
  }

  if ([action isEqual:@"browser"]) {
    NSString *URLString = parameters[@"url"];
    NSURL *URL = [NSURL URLWithString:URLString];
    if (URL) {
      [self showBrowser:URL];
    }
  }

  return NO;
}

@end
