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

/// Called after load completes. `error` is set if the load failed.
typedef void (^PACLoadCompletion)(NSError *_Nullable error);
typedef void (^PACDismissCompletion)(NSError *_Nullable error, BOOL userPrefersAdFree);

/// A single use consent form object.
@interface PACConsentForm : NSObject
/// Indicates whether the consent form should show a personalized ad option. Defaults to YES.
@property(nonatomic) BOOL shouldOfferPersonalizedAds;

/// Indicates whether the consent form should show a non-personalized ad option. Defaults to YES.
@property(nonatomic) BOOL shouldOfferNonPersonalizedAds;

/// Indicates whether the consent form should show an ad-free app option. Defaults to NO.
@property(nonatomic) BOOL shouldOfferAdFree;

/// Unavailable.
- (nullable instancetype)init NS_UNAVAILABLE;

/// Returns an initialized consent form with your application's privacy policy URL. Returns nil if
/// the privacy policy URL is invalid.
- (nullable instancetype)initWithApplicationPrivacyPolicyURL:(nonnull NSURL *)privacyPolicyURL
    NS_DESIGNATED_INITIALIZER;

/// Loads the consent form content and calls loadCompletion on completion. Must be called on the
/// main queue.
- (void)loadWithCompletionHandler:(nonnull PACLoadCompletion)loadCompletion;

/// Presents the full screen consent form over viewController. The form is dismissed and
/// completionHandler is called after the user selects an option. Must be called on the main queue.
- (void)presentFromViewController:(nonnull UIViewController *)viewController
                dismissCompletion:(nullable PACDismissCompletion)completionHandler;
@end
