// We must load config and env first
import { config } from './artifacts/constants/config';
import { env } from './artifacts/constants/env';

import { Navigation } from "@ulangi/react-native-navigation"
import { App } from "./artifacts/App";

const app = new App();
app.init();

Navigation.events().registerAppLaunchedListener(() => {
  if (app.isStarted()){
    app.clearApp();
  }

  app.startApp();
})
