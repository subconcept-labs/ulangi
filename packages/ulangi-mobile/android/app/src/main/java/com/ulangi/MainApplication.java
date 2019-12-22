package com.ulangi;

import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.rnfs.RNFSPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.codemotionapps.reactnativedarkmode.DarkModePackage;
import cx.evermeet.versioninfo.RNVersionInfoPackage;
import com.horcrux.svg.SvgPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.dooboolab.RNIap.RNIapPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import de.bnass.RNAdConsent.RNAdConsentPackage;
import org.pgsqlite.SQLitePluginPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.appsflyer.reactnative.RNAppsFlyerPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

    // Required by FBSDK
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
    protected static CallbackManager getCallbackManager() {
      return mCallbackManager;
    }

    @Override
    public void onCreate() {
      super.onCreate();
      AppEventsLogger.activateApp(this);
      //...
    }

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
      return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new FastImageViewPackage(),
          new FBSDKPackage(mCallbackManager),
          new RNIapPackage(),
          new NetInfoPackage(),
          new RNCWebViewPackage(),
          new RNAdConsentPackage(),
          new RNFirebasePackage(),
          new RNFirebaseAuthPackage(),
          new RNFirebaseDatabasePackage(),
          new RNFirebaseAdMobPackage(),
          new RNFirebaseNotificationsPackage(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseCrashlyticsPackage(),
          new RNFirebaseAnalyticsPackage(),
          new RNFSPackage(),
          new RNVersionInfoPackage(),
          new RNAppsFlyerPackage(),
          new DarkModePackage(),
          new SvgPackage(),
          new RNSoundPackage(),
          new ReactNativeConfigPackage(),
          new SplashScreenReactPackage(),
          new SQLitePluginPackage()
      );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

}
