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

#import "PACPersonalizedAdConsent.h"

#import <AdSupport/AdSupport.h>

#import "PACError.h"

// Internal API. Do not use. Use public API from PACPersonalizedAdConsent.h.
@interface PACAdProvider ()
/// Internal API. Do not use. The dictionary representation of the ad provider.
@property(nonatomic, readonly, nonnull) NSDictionary<NSString *, id> *dictionaryRepresentation;
/// Internal API. Do not use. Returns an initialized ad provider or nil if the dictionary contains
/// invalid information.
- (nullable instancetype)initWithDictionary:(nullable NSDictionary<NSString *, id> *)dictionary;
@end

NSString *const PACVersionString = @"1.0.3";
NSString *const PACUserDefaultsRootKey = @"personalized_ad_status";

static NSString *const PACInfoUpdateURLFormat =
    @"https://adservice.google.com/getconfig/pubvendors?es=2&plat=ios&v=%@&pubs=%@";

typedef NSString *PACStoreKey NS_STRING_ENUM;
static PACStoreKey const PACStoreKeyTaggedForUnderAgeOfConsent = @"tag_for_under_age_of_consent";
static PACStoreKey const PACStoreKeyConsentStatus = @"consent_state";
static PACStoreKey const PACStoreKeyPublisherIdentifiers = @"pub_ids";
static PACStoreKey const PACStoreKeyHasAnyNonPersonalizedPublisherIdentifier =
    @"has_any_npa_pub_id";
static PACStoreKey const PACStoreKeyProviders = @"providers";
static PACStoreKey const PACStoreKeyConsentedProviders = @"consented_providers";
static PACStoreKey const PACStoreKeyRawResponse = @"raw_response";
static PACStoreKey const PACStoreKeyIsRequestInEEAOrUnknown = @"is_request_in_eea_or_unknown";
static PACStoreKey const PACStoreKeyVersionString = @"version";
static PACStoreKey const PACStoreKeyPlatform = @"plat";

typedef NSString *PACConsentStatusString NS_STRING_ENUM;
static PACConsentStatusString const PACConsentStatusStringUnknown = @"unknown";
static PACConsentStatusString const PACConsentStatusStringNonPersonalized = @"non_personalized";
static PACConsentStatusString const PACConsentStatusStringPersonalized = @"personalized";
static PACConsentStatusString const PACConsentStatusStringNotEEA = @"not_eea";

#pragma mark - Support Functions

/// Returns the consent status string for the provided status.
static PACConsentStatusString _Nonnull PACConsentStatusStringForStatus(PACConsentStatus status) {
  switch (status) {
    case PACConsentStatusNonPersonalized:
      return PACConsentStatusStringNonPersonalized;
    case PACConsentStatusPersonalized:
      return PACConsentStatusStringPersonalized;
    case PACConsentStatusUnknown:
      return PACConsentStatusStringUnknown;
  }
}

/// Returns the consent status for the provided status string.
static PACConsentStatus PACConsentStatusForStatusString(NSString *_Nullable statusString) {
  NSDictionary<PACConsentStatusString, NSNumber *> *statusStringValueMapping = @{
    PACConsentStatusStringUnknown : @(PACConsentStatusUnknown),
    PACConsentStatusStringNonPersonalized : @(PACConsentStatusNonPersonalized),
    PACConsentStatusStringPersonalized : @(PACConsentStatusPersonalized)
  };
  NSNumber *statusValue = statusStringValueMapping[statusString];
  return statusValue == nil ? PACConsentStatusUnknown : statusValue.integerValue;
}

/// Returns an array of ad provider dictionary representations for the provided ad providers.
static NSArray<NSDictionary *> *_Nonnull
PACSerializeAdProviders(NSOrderedSet<PACAdProvider *> *_Nullable providers) {
  NSMutableArray<NSDictionary *> *serializedProviders = [[NSMutableArray alloc] init];
  for (PACAdProvider *provider in providers) {
    [serializedProviders addObject:provider.dictionaryRepresentation];
  }
  return serializedProviders;
}

/// Returns an ordered set of ad providers for the provided array of ad provider dictionary
/// representations.
static NSOrderedSet<PACAdProvider *> *_Nonnull
PACDeserializeAdProviders(NSArray<NSDictionary *> *_Nullable serializedProviders) {
  NSMutableOrderedSet *adProviders = [[NSMutableOrderedSet alloc] init];
  for (NSDictionary<NSString *, id> *providerInfo in serializedProviders) {
    PACAdProvider *provider = [[PACAdProvider alloc] initWithDictionary:providerInfo];
    if (provider) {
      [adProviders addObject:provider];
    }
  }
  return adProviders;
}

#pragma mark - PACAdProvider

@implementation PACAdProvider

- (nullable instancetype)initWithDictionary:(nullable NSDictionary<NSString *, id> *)dictionary {
  self = [super init];
  if (self) {
    _dictionaryRepresentation = [dictionary copy];
    _identifier = [_dictionaryRepresentation[@"company_id"] copy];
    _name = [_dictionaryRepresentation[@"company_name"] copy];
    _privacyPolicyURL = [NSURL URLWithString:_dictionaryRepresentation[@"policy_url"]];
    if (!_dictionaryRepresentation || _identifier == nil || !_name || !_privacyPolicyURL) {
      return nil;
    }
  }
  return self;
}

- (NSUInteger)hash {
  return _dictionaryRepresentation.hash;
}

- (BOOL)isEqual:(nullable id)object {
  if (![object isKindOfClass:[PACAdProvider class]]) {
    return NO;
  }
  PACAdProvider *other = object;
  return [_dictionaryRepresentation isEqual:other.dictionaryRepresentation];
}

@end

#pragma mark - PACConsentInformation

@implementation PACConsentInformation {
  NSString *_rawResponse;
  NSSet<NSString *> *_publisherIdentifiers;
  NSOrderedSet<PACAdProvider *> *_adProviders;
  NSOrderedSet<PACAdProvider *> *_consentedProviders;
  PACConsentStatus _status;
  BOOL _tagForUnderAgeOfConsent;
  BOOL _isRequestInEEAOrUnknown;
  BOOL _hasAnyNonPersonalizedPublisherIdentifier;
}

+ (PACConsentInformation *)sharedInstance {
  static PACConsentInformation *sharedInstance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[PACConsentInformation alloc] init];
    [sharedInstance readStatusFromUserDefaults];
  });
  return sharedInstance;
}

- (NSArray<PACAdProvider *> *)adProviders {
  PAC_MUST_BE_MAIN_THREAD();
  return _adProviders.array;
}

- (BOOL)isRequestLocationInEEAOrUnknown {
  PAC_MUST_BE_MAIN_THREAD();
  return _isRequestInEEAOrUnknown;
}

- (void)setConsentStatus:(PACConsentStatus)status {
  PAC_MUST_BE_MAIN_THREAD();
  _status = status;
  switch (_status) {
    case PACConsentStatusUnknown:
      _consentedProviders = nil;
      break;
    case PACConsentStatusNonPersonalized:
    case PACConsentStatusPersonalized:
      _consentedProviders = _adProviders;
      break;
  }
  [self writeStatusToUserDefaults];
}

- (PACConsentStatus)consentStatus {
  PAC_MUST_BE_MAIN_THREAD();
  return _status;
}

- (void)setTagForUnderAgeOfConsent:(BOOL)tagForUnderAgeOfConsent {
  PAC_MUST_BE_MAIN_THREAD();
  if (_tagForUnderAgeOfConsent == tagForUnderAgeOfConsent) {
    return;
  }
  _tagForUnderAgeOfConsent = tagForUnderAgeOfConsent;
  [self writeStatusToUserDefaults];
}

- (BOOL)isTaggedForUnderAgeOfConsent {
  PAC_MUST_BE_MAIN_THREAD();
  return _tagForUnderAgeOfConsent;
}

- (void)reset {
  PAC_MUST_BE_MAIN_THREAD();
  [NSUserDefaults.standardUserDefaults removeObjectForKey:PACUserDefaultsRootKey];
  [self readStatusFromUserDefaults];
  [self writeStatusToUserDefaults];
}

/// Reads status from user defaults and updates the receiver's information.
- (void)readStatusFromUserDefaults {
  NSDictionary<PACStoreKey, id> *info =
      [NSUserDefaults.standardUserDefaults objectForKey:PACUserDefaultsRootKey];

  NSNumber *tagForUnderAgeOfConsentValue = info[PACStoreKeyTaggedForUnderAgeOfConsent];
  _tagForUnderAgeOfConsent = tagForUnderAgeOfConsentValue.integerValue != 0;

  NSNumber *isRequestInEEAOrUnknownValue = info[PACStoreKeyIsRequestInEEAOrUnknown];
  _isRequestInEEAOrUnknown = isRequestInEEAOrUnknownValue.integerValue != 0;

  NSNumber *hasAnyNonPersonalizedPublisherIdentifierValue =
      info[PACStoreKeyHasAnyNonPersonalizedPublisherIdentifier];
  _hasAnyNonPersonalizedPublisherIdentifier =
      hasAnyNonPersonalizedPublisherIdentifierValue.integerValue != 0;

  _status = PACConsentStatusForStatusString(info[PACStoreKeyConsentStatus]);

  NSArray<NSString *> *publisherIdentifierArray = info[PACStoreKeyPublisherIdentifiers] ?: @[];
  _publisherIdentifiers = [[NSSet alloc] initWithArray:publisherIdentifierArray];

  _adProviders = PACDeserializeAdProviders(info[PACStoreKeyProviders]);
  _consentedProviders = PACDeserializeAdProviders(info[PACStoreKeyConsentedProviders]);
}

/// Writes status to user defaults.
- (void)writeStatusToUserDefaults {
  PAC_MUST_BE_MAIN_THREAD();

  NSDictionary<PACStoreKey, id> *personalizedAdStatus = @{
    PACStoreKeyVersionString : PACVersionString,
    PACStoreKeyPlatform : @"ios",
    PACStoreKeyTaggedForUnderAgeOfConsent : _tagForUnderAgeOfConsent ? @1 : @0,
    PACStoreKeyIsRequestInEEAOrUnknown : _isRequestInEEAOrUnknown ? @1 : @0,
    PACStoreKeyHasAnyNonPersonalizedPublisherIdentifier :
        _hasAnyNonPersonalizedPublisherIdentifier ? @1 : @0,
    PACStoreKeyConsentStatus : PACConsentStatusStringForStatus(_status),
    PACStoreKeyPublisherIdentifiers : _publisherIdentifiers.allObjects ?: @[],
    PACStoreKeyProviders : PACSerializeAdProviders(_adProviders),
    PACStoreKeyConsentedProviders : PACSerializeAdProviders(_consentedProviders),
    PACStoreKeyRawResponse : _rawResponse ?: @"",
  };

  [NSUserDefaults.standardUserDefaults setObject:personalizedAdStatus
                                          forKey:PACUserDefaultsRootKey];
}

- (BOOL)debugModeEnabled {
#if TARGET_IPHONE_SIMULATOR
  return YES;
#else
  NSString *identifier = ASIdentifierManager.sharedManager.advertisingIdentifier.UUIDString;
  return [_debugIdentifiers containsObject:identifier];
#endif
}

/// Returns an info update URL for the provided publisher identifiers.
- (nullable NSURL *)infoUpdateURLForPublisherIdentifiers:
        (nonnull NSArray<NSString *> *)publisherIdentifiers {
  NSString *publisherIdentifierString = [publisherIdentifiers componentsJoinedByString:@","];
  if (!publisherIdentifierString.length) {
    publisherIdentifierString = @"";
  }
  NSString *infoUpdateURLString = [[NSString alloc]
      initWithFormat:PACInfoUpdateURLFormat, PACVersionString, publisherIdentifierString];

  if ([self debugModeEnabled]) {
    NSString *debugGeographyParam = @"";
    switch (_debugGeography) {
      case PACDebugGeographyEEA:
        debugGeographyParam = @"&debug_geo=1";
        break;
      case PACDebugGeographyNotEEA:
        debugGeographyParam = @"&debug_geo=2";
        break;
      case PACDebugGeographyDisabled:
        debugGeographyParam = @"";
        break;
    }
    infoUpdateURLString = [infoUpdateURLString stringByAppendingString:debugGeographyParam];
  }

  NSURL *infoUpdateURL = [NSURL URLWithString:infoUpdateURLString];
  return infoUpdateURL;
}

- (void)requestConsentInfoUpdateForPublisherIdentifiers:
            (nonnull NSArray<NSString *> *)publisherIdentifiers
                                      completionHandler:
                                          (nonnull PACConsentInformationUpdateHandler)handler {
  PAC_MUST_BE_MAIN_THREAD();

  NSSet *publisherIdentifiersSet = [[NSSet alloc] initWithArray:publisherIdentifiers];
  if (_publisherIdentifiers.count && ![_publisherIdentifiers isEqual:publisherIdentifiersSet]) {
    NSLog(@"Warning: publisher identifiers changed since last info update request. publisher "
          @"identifiers shouldn't change during an app session.");
  }

  // Calls handler asynchronously.
  PACConsentInformationUpdateHandler asyncHandler = ^(NSError *_Nullable error) {
    if (!handler) {
      return;
    }
    dispatch_async(dispatch_get_main_queue(), ^{
      handler(error);
    });
  };
  NSURL *infoURL = [self infoUpdateURLForPublisherIdentifiers:publisherIdentifiers];
  NSURLSession *session = [NSURLSession sharedSession];
  NSURLSessionDataTask *dataTask =
      [session dataTaskWithURL:infoURL
             completionHandler:^(NSData *_Nullable data, NSURLResponse *_Nullable response,
                                 NSError *_Nullable error) {
               if (error || !data.length) {
                 if (!error) {
                   error = PACErrorWithDescription(@"Unable to update publisher identifier info.");
                 }
                 asyncHandler(error);
                 return;
               }

               NSDictionary<NSString *, id> *info =
                   [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
               if (error || ![info isKindOfClass:[NSDictionary class]]) {
                 if (!error) {
                   error = PACErrorWithDescription(@"Invalid response.");
                 }
                 asyncHandler(error);
                 return;
               }

               NSString *responseString =
                   [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];

               dispatch_async(dispatch_get_main_queue(), ^{
                 [self handleInfoUpdateResponse:publisherIdentifiers
                                           info:info
                                 responseString:responseString
                         asyncCompletionHandler:asyncHandler];
               });
             }];
  [dataTask resume];
}

- (nullable NSError *)validateInfo:(nonnull NSDictionary<NSString *, id> *)info {
  // Validate EEA or unknown only.
  NSNumber *requestInEEAValue = info[@"is_request_in_eea_or_unknown"];
  BOOL isRequestInEEAOrUnknown = requestInEEAValue.boolValue;
  if (!isRequestInEEAOrUnknown) {
    return nil;
  }

  // Identify unmatched, not found, and publisher identifiers lookup failures.
  NSMutableArray *lookupFailedPublisherIdentifiers = [[NSMutableArray alloc] init];
  NSMutableArray *notFoundPublisherIdentifiers = [[NSMutableArray alloc] init];
  NSArray<NSDictionary *> *adNetworks = info[@"ad_network_ids"];
  for (NSDictionary<NSString *, id> *adNetwork in adNetworks) {
    NSString *publisherIdentifier = adNetwork[@"ad_network_id"] ?: @"Publisher identifier missing";
    NSNumber *lookupFailed = adNetwork[@"lookup_failed"] ?: @NO;
    NSNumber *notFound = adNetwork[@"not_found"] ?: @NO;
    if (lookupFailed.boolValue) {
      [lookupFailedPublisherIdentifiers addObject:publisherIdentifier];
    }
    if (notFound.boolValue) {
      [notFoundPublisherIdentifiers addObject:publisherIdentifier];
    }
  }

  if (!lookupFailedPublisherIdentifiers.count && !notFoundPublisherIdentifiers.count) {
    return nil;
  }

  NSMutableArray *errorMessages = [[NSMutableArray alloc] init];
  [errorMessages addObject:@"Response error."];

  if (lookupFailedPublisherIdentifiers.count) {
    NSString *commaSeparatedPublisherIdentifiers =
        [lookupFailedPublisherIdentifiers componentsJoinedByString:@", "];
    NSString *message = [[NSString alloc]
        initWithFormat:@"Lookup failure for: %@", commaSeparatedPublisherIdentifiers];
    [errorMessages addObject:message];
  }

  if (notFoundPublisherIdentifiers.count) {
    NSString *commaSeparatedPublisherIdentifiers =
        [notFoundPublisherIdentifiers componentsJoinedByString:@", "];
    NSString *message = [[NSString alloc]
        initWithFormat:@"Publisher identifiers not found: %@", commaSeparatedPublisherIdentifiers];
    [errorMessages addObject:message];
  }

  NSString *errorDescription = [errorMessages componentsJoinedByString:@" "];
  NSError *error = PACErrorWithDescription(errorDescription);
  return error;
}

/// Handles info update response.
- (void)handleInfoUpdateResponse:(nonnull NSArray<NSString *> *)publisherIdentifiers
                            info:(nonnull NSDictionary<NSString *, id> *)info
                  responseString:(nonnull NSString *)responseString
          asyncCompletionHandler:(nonnull PACConsentInformationUpdateHandler)asyncHandler {
  PAC_MUST_BE_MAIN_THREAD();
  // Validate response.
  NSError *error = [self validateInfo:info];
  if (error) {
    asyncHandler(error);
    return;
  }

  // Identify if any publisher identifier is configured for "non-personalized only".
  BOOL previousHasAnyNonPersonalizedPublisherIdentifier = _hasAnyNonPersonalizedPublisherIdentifier;
  _hasAnyNonPersonalizedPublisherIdentifier = NO;
  NSMutableSet<NSNumber *> *nonPersonalizedOnlyProviderIdentifiers = [[NSMutableSet alloc] init];
  NSArray<NSDictionary *> *adNetworkInfoDictionaries = info[@"ad_network_ids"];
  for (NSDictionary *adNetworkInfo in adNetworkInfoDictionaries) {
    NSNumber *isNonPersonalizedValue = adNetworkInfo[@"is_npa"];
    if (!isNonPersonalizedValue.boolValue) {
      continue;
    }
    _hasAnyNonPersonalizedPublisherIdentifier = YES;
    NSArray<NSNumber *> *providerIdentifiers = adNetworkInfo[@"company_ids"];
    if (providerIdentifiers) {
      [nonPersonalizedOnlyProviderIdentifiers addObjectsFromArray:providerIdentifiers];
    }
  }

  // Raw response.
  _rawResponse = responseString;

  // Publisher identifiers.
  _publisherIdentifiers = [[NSSet alloc] initWithArray:publisherIdentifiers];

  // Request origin.
  NSNumber *requestInEEAValue = info[@"is_request_in_eea_or_unknown"];
  _isRequestInEEAOrUnknown = requestInEEAValue.boolValue;

  // Process providers.
  NSArray<NSDictionary *> *providersInfo = info[@"companies"];
  NSMutableOrderedSet *providers = [[NSMutableOrderedSet alloc] init];
  for (NSDictionary<NSString *, id> *providerInfo in providersInfo) {
    PACAdProvider *provider = [[PACAdProvider alloc] initWithDictionary:providerInfo];
    if (!provider) {
      continue;
    }
    // If any publisher identifier is configured for "non-personalized only", include
    // "non-personalized only" providers in the provider array. Exclude all others.
    if (!_hasAnyNonPersonalizedPublisherIdentifier ||
        [nonPersonalizedOnlyProviderIdentifiers containsObject:provider.identifier]) {
      [providers addObject:provider];
    }
  }
  _adProviders = providers;

  BOOL nonPersonalizedOnlyValueChanged =
      _hasAnyNonPersonalizedPublisherIdentifier != previousHasAnyNonPersonalizedPublisherIdentifier;
  BOOL providersMatchesConsentedProviders = [_consentedProviders.set isEqual:_adProviders.set];
  if (_isRequestInEEAOrUnknown &&
      (!providersMatchesConsentedProviders || nonPersonalizedOnlyValueChanged)) {
    _consentedProviders = nil;
    _status = PACConsentStatusUnknown;
  }

  [self writeStatusToUserDefaults];
  asyncHandler(nil);
}

@end
