import { by, element, expect, waitFor } from 'detox';

import * as config from '../../e2e.config';

export class Element {
  public static byId(id: string): Element {
    return new Element(by.id(id));
  }

  public static byText(text: string): Element {
    return new Element(by.text(text));
  }

  private matcher: Detox.Matchers;

  public constructor(matcher: Detox.Matchers) {
    this.matcher = matcher;
  }

  public getMatcher(): Detox.Matchers {
    return this.matcher;
  }

  public withAncesstor(element: Element): Element {
    return new Element(this.matcher.withAncestor(element.getMatcher()));
  }

  public withDescendant(element: Element): Element {
    return new Element(this.getMatcher().withDescendant(element.getMatcher()));
  }

  public async tap(waitTimeout?: number): Promise<void> {
    await this.waitForDisplayed(waitTimeout);
    await element(this.matcher).tap();
  }

  public async tapAtPoint(point: {x: number, y: number}, waitTimeout?: number): Promise<void> {
    await this.waitForDisplayed(waitTimeout);
    await element(this.matcher).tapAtPoint(point);
  }

  public async clearText(waitTimeout?: number): Promise<void> {
    await this.waitForDisplayed(waitTimeout);
    // Some elements need to tapped to show keyboard first before clearing
    await element(this.matcher).tap();
    await element(this.matcher).clearText();
  }

  public async typeText(text: string, waitTimeout?: number): Promise<void> {
    await this.waitForDisplayed(waitTimeout);
    // Some elements need to tapped to show keyboard first before typing
    await element(this.matcher).tap();
    await element(this.matcher).typeText(text);
  }

  public async replaceText(
    text: string,
    waitTimeout?: number,
    setTextDirectly?: boolean
  ): Promise<void> {
    await this.waitForDisplayed(waitTimeout);

    await element(this.matcher).tap();
    if (setTextDirectly === true) {
      // workaround for bug #151: replaceText doesn't trigger onChangeText.
      await element(this.matcher).replaceText(text);
      await element(this.matcher).typeText(" ");
      await element(this.matcher).tapBackspaceKey();
    } else {
      await element(this.matcher).clearText();
      await element(this.matcher).typeText(text);
    }
  }

  public async scrollTo(
    direction: Detox.Direction
  ): Promise<void> {
    await element(this.matcher).scrollTo(direction)
  }
  
  public async scrollChildIntoView(
    child: Element,
    direction: Detox.Direction,
    waitTimeout?: number
  ): Promise<void> {
    await this.waitForDisplayed(waitTimeout);
    await waitFor(element(child.getMatcher()))
      .toBeVisible()
      .whileElement(this.matcher)
      .scroll(config.scrollAmount, direction);
  }

  public async isExisting(waitTimeout?: number): Promise<boolean> {
    try {
      await this.expectToExist(waitTimeout);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async isDisplayed(waitTimeout?: number): Promise<boolean> {
    try {
      await this.expectToBeDisplayed(waitTimeout);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async expectToExist(waitTimeout?: number): Promise<void> {
    await this.waitForExist(waitTimeout);
    await expect(element(this.matcher)).toExist();
  }

  public async expectToNotExist(waitTimeout?: number): Promise<void> {
    await this.waitForNotExist(waitTimeout);
    await expect(element(this.matcher)).toNotExist();
  }

  public async expectToBeDisplayed(waitTimeout?: number): Promise<void> {
    await this.waitForDisplayed(waitTimeout);
    await expect(element(this.matcher)).toBeVisible();
  }

  public async expectToHaveText(
    text: string,
    waitTimeout?: number
  ): Promise<void> {
    await this.waitForHavingText(text, waitTimeout);
    await expect(element(this.matcher)).toHaveText(text);
  }

  public async expectToHaveDescendant(
    descendantElement: Element,
    waitTimeout?: number
  ): Promise<void> {
    await this.waitForHavingDescendant(descendantElement, waitTimeout);
    await expect(
      element(this.matcher.withDescendant(descendantElement.getMatcher()))
    ).toExist();
  }

  public async expectToNotHaveDescendant(
    descendantElement: Element,
    waitTimeout?: number
  ): Promise<void> {
    await this.waitForNotHavingDescendant(descendantElement, waitTimeout);
    await expect(
      element(this.matcher.withDescendant(descendantElement.getMatcher()))
    ).toNotExist();
  }

  private async waitForExist(waitTimeout?: number): Promise<void> {
    await waitFor(element(this.matcher))
      .toExist()
      .withTimeout(
        typeof waitTimeout !== 'undefined' ? waitTimeout : config.waitTimeout
      );
  }

  private async waitForNotExist(waitTimeout?: number): Promise<void> {
    await waitFor(element(this.matcher))
      .toNotExist()
      .withTimeout(
        typeof waitTimeout !== 'undefined' ? waitTimeout : config.waitTimeout
      );
  }

  private async waitForDisplayed(waitTimeout?: number): Promise<void> {
    await waitFor(element(this.matcher))
      .toBeVisible()
      .withTimeout(
        typeof waitTimeout !== 'undefined' ? waitTimeout : config.waitTimeout
      );
  }

  private async waitForNotDisplayed(waitTimeout?: number): Promise<void> {
    await waitFor(element(this.matcher))
      .toBeNotVisible()
      .withTimeout(
        typeof waitTimeout !== 'undefined' ? waitTimeout : config.waitTimeout
      );
  }

  private async waitForHavingText(
    text: string,
    waitTimeout?: number
  ): Promise<void> {
    await waitFor(element(this.matcher))
      .toHaveText(text)
      .withTimeout(
        typeof waitTimeout !== 'undefined' ? waitTimeout : config.waitTimeout
      );
  }

  private async waitForHavingDescendant(
    descendantElement: Element,
    waitTimeout?: number
  ): Promise<void> {
    await waitFor(
      element(this.matcher.withDescendant(descendantElement.getMatcher()))
    )
      .toExist()
      .withTimeout(
        typeof waitTimeout !== 'undefined' ? waitTimeout : config.waitTimeout
      );
  }

  private async waitForNotHavingDescendant(
    descendantElement: Element,
    waitTimeout?: number
  ): Promise<void> {
    await waitFor(
      element(this.matcher.withDescendant(descendantElement.getMatcher()))
    )
      .toNotExist()
      .withTimeout(
        typeof waitTimeout !== 'undefined' ? waitTimeout : config.waitTimeout
      );
  }
}
