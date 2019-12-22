/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as AWS from 'aws-sdk';
import * as querystring from 'query-string';

export class MailerAdapter implements MailerAdapter {
  private ses: AWS.SES;

  public constructor(ses: AWS.SES) {
    this.ses = ses;
  }

  public sendEmail(
    sourceEmail: string,
    destinationEmail: string,
    replyToEmail: string,
    subject: string,
    message: string
  ): Promise<void> {
    return new Promise(
      (resolve, reject): void => {
        this.ses.sendEmail(
          {
            Source: sourceEmail,
            Destination: {
              ToAddresses: [destinationEmail],
            },
            ReplyToAddresses: [replyToEmail],
            Message: {
              Body: {
                Text: {
                  Data: message,
                  Charset: 'utf8',
                },
              },
              Subject: {
                Data: subject,
                Charset: 'utf8',
              },
            },
          },
          (error): void => {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              resolve();
            }
          }
        );
      }
    );
  }

  public sendResetPasswordEmail(
    serverUrl: string,
    recipientEmail: string,
    resetPasswordToken: string,
    expirationHours: number
  ): Promise<void> {
    return new Promise(
      (resolve, reject): void => {
        const resetPasswordLink =
          serverUrl +
          '/reset-password?' +
          querystring.stringify({ resetPasswordToken });
        this.ses.sendTemplatedEmail(
          {
            Source: 'no-reply@ulangi.com',
            Template: 'ResetPassword',
            Destination: {
              ToAddresses: [recipientEmail],
            },
            TemplateData: `{ "resetpasswordlink": "${resetPasswordLink}", "expirationhours": "${expirationHours}" }`,
          },
          (error): void => {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              resolve();
            }
          }
        );
      }
    );
  }
}
