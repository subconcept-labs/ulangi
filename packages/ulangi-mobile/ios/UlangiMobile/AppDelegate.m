/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import <React/RCTRootView.h>

#import <ReactNativeNavigation/ReactNativeNavigation.h>

#import "UIColorFromRGB.h"

#import "RNSplashScreen.h"

#import "ReactNativeConfig.h"

#import <AdSupport/AdSupport.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  //NSLog(@"Advertising ID: %@",
        //ASIdentifierManager.sharedManager.advertisingIdentifier.UUIDString);
  
  // react-native-navigation v2
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
  
  NSString *enableSplashScreen = [ReactNativeConfig envFor:@"ENABLED_SPLASH_SCREEN"];
  if ([enableSplashScreen  isEqual: @"true"]){
    [RNSplashScreen show];
  }
  
  // original RN bootstrap -
  /*
   NSURL *jsCodeLocation;
   jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
   RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
   moduleName:@"UlangiMobile"
   initialProperties:nil
   launchOptions:launchOptions];
   rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
   
   self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
   UIViewController *rootViewController = [UIViewController new];
   rootViewController.view = rootView;
   self.window.rootViewController = rootViewController;
   [self.window makeKeyAndVisible];
   */
  
  return YES;
}

@end
