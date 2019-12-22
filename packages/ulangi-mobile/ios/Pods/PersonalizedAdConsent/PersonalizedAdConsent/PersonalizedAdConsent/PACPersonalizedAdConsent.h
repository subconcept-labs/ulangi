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

#import <UIKit/UIKit.h>

/// Personalized ad consent SDK version string.
extern NSString *_Nonnull const PACVersionString;

/// Personalized ad consent error domain.
extern NSErrorDomain _Nonnull const PACErrorDomain;

/// Personalized ad consent user defaults root key. Consent information is stored in standard user
/// defaults under this key.
extern NSString *_Nonnull const PACUserDefaultsRootKey;

/// Consent status values.
typedef NS_ENUM(NSInteger, PACConsentStatus) {
  PACConsentStatusUnknown = 0,          ///< Unknown consent status.
  PACConsentStatusNonPersonalized = 1,  ///< User consented to non-personalized ads.
  PACConsentStatusPersonalized = 2,     ///< User consented to personalized ads.
};

/// Debug values for testing geography.
typedef NS_ENUM(NSInteger, PACDebugGeography) {
  PACDebugGeographyDisabled = 0,  ///< Disable geography debugging.
  PACDebugGeographyEEA = 1,       ///< Geography appears as in EEA for debug devices.
  PACDebugGeographyNotEEA = 2,    ///< Geography appears as not in EEA for debug devices.
};

/// Ad provider information.
@interface PACAdProvider : NSObject
/// Ad provider's identifier.
@property(nonatomic, readonly, nonnull) NSNumber *identifier;
/// Ad provider's name.
@property(nonatomic, readonly, nonnull) NSString *name;
/// Ad provider's privacy policy URL.
@property(nonatomic, readonly, nonnull) NSURL *privacyPolicyURL;
@end

/// Called when the consent info request completes. Error is nil on success, and non-nil if the
/// update failed.
typedef void (^PACConsentInformationUpdateHandler)(NSError *_Nullable error);

/// Consent information. Not thread safe. All methods must be called on the main thread.
@interface PACConsentInformation : NSObject

/// The shared consent information instance.
@property(class, nonatomic, readonly, nonnull) PACConsentInformation *sharedInstance;

/// The user's consent status.
@property(nonatomic) PACConsentStatus consentStatus;

/// Indicates whether the user is tagged for under age of consent.
@property(nonatomic, getter=isTaggedForUnderAgeOfConsent) BOOL tagForUnderAgeOfConsent;

/// The consent info update request was in EEA or from an unknown location.
@property(nonatomic, readonly, getter=isRequestLocationInEEAOrUnknown)
    BOOL requestLocationInEEAOrUnknown;

/// Array of ad providers.
@property(nonatomic, readonly, nullable) NSArray<PACAdProvider *> *adProviders;

/// Array of advertising identifier UUID strings. Debug features are enabled for devices with these
/// identifiers. Debug features are always enabled for simulators.
@property(nonatomic, nullable) NSArray<NSString *> *debugIdentifiers;

/// Debug geography. Used for debug devices only.
@property(nonatomic) PACDebugGeography debugGeography;

/// Resets consent information to default state and clears ad providers.
- (void)reset;

/// Requests consent information update for the provided publisher identifiers. All publisher
/// identifiers used in the application should be specified in this call. Consent status is reset to
/// unknown when the ad provider list changes.
- (void)requestConsentInfoUpdateForPublisherIdentifiers:
            (nonnull NSArray<NSString *> *)publisherIdentifiers
                                      completionHandler:
                                          (nonnull PACConsentInformationUpdateHandler)handler;
@end
