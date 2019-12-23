package com.ulangi;

import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

import com.facebook.react.PackageList;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;

import java.util.List;
import androidx.annotation.Nullable;

public class MainApplication extends NavigationApplication {

    @Override
    protected ReactNativeHost createReactNativeHost() {
        return new NavigationReactNativeHost(this) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Nullable
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        List<ReactPackage> packages = new PackageList(this).getPackages();
        // Packages that might not support autolinking can still go here
        packages.add(new RNFirebaseAuthPackage());
        packages.add(new RNFirebaseDatabasePackage());
        packages.add(new RNFirebaseAdMobPackage());
        packages.add(new RNFirebaseNotificationsPackage());
        packages.add(new RNFirebaseMessagingPackage());
        packages.add(new RNFirebaseCrashlyticsPackage());
        packages.add(new RNFirebaseAnalyticsPackage());

        return packages;
    }
}
