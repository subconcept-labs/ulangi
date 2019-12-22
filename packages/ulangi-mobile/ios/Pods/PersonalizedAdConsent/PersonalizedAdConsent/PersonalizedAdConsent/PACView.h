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

#import "PACConsentForm.h"

typedef NSString *PACFormKey NS_STRING_ENUM;
static PACFormKey const PACFormKeyOfferPersonalized = @"offer_personalized";
static PACFormKey const PACFormKeyOfferNonPersonalized = @"offer_non_personalized";
static PACFormKey const PACFormKeyOfferAdFree = @"offer_ad_free";
static PACFormKey const PACFormKeyAppPrivacyPolicyURLString = @"app_privacy_url";
static PACFormKey const PACFormKeyConstentInfo = @"consent_info";
static PACFormKey const PACFormKeyAppName = @"app_name";
static PACFormKey const PACFormKeyAppIcon = @"app_icon";
static PACFormKey const PACFormKeyPlatform = @"plat";

/// Loads and displays the consent form.
@interface PACView : UIView<UIWebViewDelegate>
@property(nonatomic, nullable) PACDismissCompletion dismissCompletion;
@property(nonatomic) BOOL shouldNonPersonalizedAds;
@property(nonatomic) BOOL shouldOfferAdFree;

/// Loads the view with form information and calls the handler on the main queue.
- (void)loadWithFormInformation:(nonnull NSDictionary<PACFormKey, id> *)formInformation
              completionHandler:(nonnull PACLoadCompletion)handler;
@end
