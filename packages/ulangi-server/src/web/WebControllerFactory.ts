/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Env } from '../interfaces/Env';
import { AMPHomeBController } from './controllers/AMPHomeBController';
import { AMPHomeCController } from './controllers/AMPHomeCController';
import { AMPHomeController } from './controllers/AMPHomeController';
import { ContactUsController } from './controllers/ContactUsController';
import { HomeBController } from './controllers/HomeBController';
import { HomeCController } from './controllers/HomeCController';
import { HomeController } from './controllers/HomeController';
import { PrivacyPolicyController } from './controllers/PrivacyPolicyController';
import { ResetPasswordController } from './controllers/ResetPasswordController';
import { TermsOfServiceController } from './controllers/TermsOfServiceController';
import { UlangiSheetsController } from './controllers/UlangiSheetsController';
import { WebController } from './controllers/WebController';
import { WhatsNewController } from './controllers/WhatsNewController';

export class WebControllerFactory {
  private env: Env;

  public constructor(env: Env) {
    this.env = env;
  }

  public makeControllers(): readonly WebController[] {
    return [
      new HomeController(this.env),
      new HomeBController(this.env),
      new HomeCController(this.env),
      new WhatsNewController(this.env),
      new PrivacyPolicyController(this.env),
      new TermsOfServiceController(this.env),
      new ResetPasswordController(this.env),
      new ContactUsController(this.env),
      new AMPHomeController(this.env),
      new AMPHomeBController(this.env),
      new AMPHomeCController(this.env),
      new UlangiSheetsController(this.env),
    ];
  }
}
