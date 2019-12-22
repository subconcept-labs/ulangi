/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import {
  Direction,
  ExtraFieldDetail,
} from '../extra-field-details/ExtraFieldDetail';

export abstract class ExtraFieldParser<
  T extends { [P in string]: readonly string[][] }
> {
  public abstract readonly extraFieldDetails: {
    [P in keyof T]: ExtraFieldDetail
  };

  protected parseFromLeft(
    text: string,
    stripUnknown: boolean
  ): { capturedValues: Partial<T>; stoppedAt: number } {
    const capturedValues: { -readonly [P in keyof T]?: T[P] } = {};

    let cursor = 0;
    let done = false;

    while (cursor <= text.length - 1 && done === false) {
      if (text[cursor] === '[') {
        const content = this.getContentInsideBracketsFromLeft(text, cursor);

        if (content !== null) {
          const parseResult = this.parseWithDirection(content, 'left');
          if (parseResult !== null) {
            const [key, value] = parseResult;
            if (typeof capturedValues[key] !== 'undefined') {
              (capturedValues[key] as readonly string[][]) = [
                ...(capturedValues[key] as readonly string[][]),
                value,
              ];
            } else {
              (capturedValues[key] as readonly string[][]) = [value];
            }

            cursor = cursor + content.length + 2;
          } else {
            if (stripUnknown === true) {
              cursor = cursor + content.length + 2;
            } else {
              done = true;
            }
          }
        } else {
          done = true;
        }
      } else if (text[cursor] === ' ' || text[cursor] === '\n') {
        cursor += 1;
      } else {
        done = true;
      }
    }

    return {
      capturedValues,
      stoppedAt: cursor,
    };
  }

  protected parseFromRight(
    text: string,
    stripUnknown: boolean
  ): { capturedValues: Partial<T>; stoppedAt: number } {
    const capturedValues: { -readonly [P in keyof T]?: T[P] } = {};

    let cursor = text.length - 1;
    let done = false;

    while (cursor >= 0 && done === false) {
      if (text[cursor] === ']') {
        const content = this.getContentInsideBracketsFromRight(text, cursor);

        if (content !== null) {
          const parseResult = this.parseWithDirection(content, 'right');
          if (parseResult !== null) {
            const [key, value] = parseResult;
            if (typeof capturedValues[key] !== 'undefined') {
              (capturedValues[key] as readonly string[][]) = [
                value,
                ...(capturedValues[key] as readonly string[][]),
              ];
            } else {
              (capturedValues[key] as readonly string[][]) = [value];
            }

            cursor = cursor - content.length - 2;
          } else {
            if (stripUnknown === true) {
              cursor = cursor - content.length - 2;
            } else {
              done = true;
            }
          }
        } else {
          done = true;
        }
      } else if (text[cursor] === ' ' || text[cursor] === '\n') {
        cursor -= 1;
      } else {
        done = true;
      }
    }

    return {
      capturedValues,
      stoppedAt: cursor,
    };
  }

  protected trimWhiteSpacesAndPipes(text: string): string {
    return text
      .replace(/^\s+|\s+$/g, '')
      .replace(new RegExp(/^\|/), '')
      .replace(new RegExp(/\|$/), '')
      .replace(/^\s+|\s+$/g, ''); // Remove all begin and end white spaces/ new lines
  }

  protected getContentInsideBracketsFromLeft(
    text: string,
    cursor: number
  ): null | string {
    if (text[cursor] !== '[') {
      throw new Error('getContentInsideBracketsFromLeft must begin with [');
    }

    cursor += 1;

    let content = '';
    let done = false;
    while (cursor <= text.length - 1 && done === false) {
      if (text[cursor] === '[') {
        const innerContent = this.getContentInsideBracketsFromLeft(
          text,
          cursor
        );
        if (innerContent !== null) {
          content += '[' + innerContent + ']';
          cursor += innerContent.length + 2;
        } else {
          content += text[cursor];
          cursor += 1;
        }
      } else if (text[cursor] === ']') {
        done = true;
      } else {
        content += text[cursor];
        cursor += 1;
      }
    }

    return done === false ? null : content;
  }

  protected getContentInsideBracketsFromRight(
    text: string,
    cursor: number
  ): null | string {
    if (text[cursor] !== ']') {
      throw new Error('getContentInsideBracketsFromLeft must begin with ]');
    }

    // Skip ]
    cursor -= 1;

    let content = '';
    let done = false;
    while (cursor >= 0 && done === false) {
      if (text[cursor] === ']') {
        const innerContent = this.getContentInsideBracketsFromRight(
          text,
          cursor
        );
        if (innerContent !== null) {
          content = '[' + innerContent + ']' + content;
          cursor = cursor - innerContent.length - 2;
        } else {
          content = text[cursor] + content;
          cursor -= 1;
        }
      } else if (text[cursor] === '[') {
        done = true;
      } else {
        content = text[cursor] + content;
        cursor -= 1;
      }
    }

    return done === false ? null : content;
  }

  private parseWithDirection(
    content: string,
    direction: Direction
  ): null | [keyof T, string[]] {
    let result: null | [keyof T, string[]] = null;
    let i = 0;

    const pairs = _.toPairs(this.extraFieldDetails);

    while (result === null && i <= pairs.length - 1) {
      const [key, extraFieldDetail] = pairs[i];
      if (direction === extraFieldDetail.parseDirection) {
        const value = extraFieldDetail.parse(content);

        if (value !== null) {
          result = [key, value];
        }
      }

      i++;
    }

    return result;
  }
}
