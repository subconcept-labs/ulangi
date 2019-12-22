import { LightBoxDialogIds } from '../../../src/constants/Ids/LightBoxDialogIds';
import { Element } from '../adapters/Element';

export class LightBoxDialog {
  public async close(): Promise<void> {
    await Element.byId(LightBoxDialogIds.CLOSE_DIALOG_BTN).tap();
  }

  public async cancel(): Promise<void> {
    await Element.byId(LightBoxDialogIds.CANCEL_BTN).tap();
  }

  public async okay(): Promise<void> {
    await Element.byId(LightBoxDialogIds.OKAY_BTN).tap();
  }

  public async expectFailedDialogToExist(): Promise<void> {
    await Element.byId(LightBoxDialogIds.FAILED_DIALOG).expectToExist();
  }

  public async expectSuccessDialogToExist(): Promise<void> {
    await Element.byId(LightBoxDialogIds.SUCCESS_DIALOG).expectToExist();
  }

  public async expectToHaveMessage(message: string): Promise<void> {
    await Element.byId(LightBoxDialogIds.DIALOG_MESSAGE).expectToHaveText(
      message
    );
  }
}

export const lightBoxDialog = new LightBoxDialog();
