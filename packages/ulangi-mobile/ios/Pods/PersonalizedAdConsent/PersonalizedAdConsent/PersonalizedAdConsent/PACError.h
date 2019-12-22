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

#define PAC_MUST_BE_MAIN_THREAD()                                            \
  do {                                                                       \
    NSCAssert([NSThread isMainThread], @"Must be executed on main thread."); \
  } while (0)

/// Returns an NSError with the consent domain and provided description.
NSError *_Nonnull PACErrorWithDescription(NSString *_Nonnull description);
