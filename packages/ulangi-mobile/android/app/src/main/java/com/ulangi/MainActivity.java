package com.ulangi;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

import com.reactnativenavigation.NavigationActivity;
import com.reactnativenavigation.utils.CommandListenerAdapter;
import android.content.Intent;

public class MainActivity extends NavigationActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        if(BuildConfig.ENABLE_SPLASH_SCREEN == "true") {
          SplashScreen.show(this, R.style.SplashScreenTheme);
        }
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        if (!navigator.handleBack(new CommandListenerAdapter())) {
            moveTaskToBack(true);
        }
    }
}
