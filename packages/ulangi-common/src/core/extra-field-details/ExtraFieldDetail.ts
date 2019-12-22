/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

export type Direction = 'right' | 'left';

export abstract class ExtraFieldDetail {
  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract readonly kind: 'term' | 'definition';
  public abstract readonly parseDirection: Direction;
  public abstract readonly targetLanguageCodes: string[] | 'any';
  public abstract readonly templateName: undefined | string;

  public abstract readonly params: {
    readonly description: string;
    readonly rule: Joi.StringSchema;
    readonly isSpeakable: boolean;
  }[];

  public abstract readonly shortcodes: {
    readonly value: string;
    readonly cursor?: number;
  }[];

  public parse(content: string): null | string[] {
    if (this.isValidTemplate(content)) {
      const valueContent = this.stripTemplate(content);
      const values = valueContent.split('|');
      return this.areValuesValid(values) ? values : null;
    } else {
      return null;
    }
  }

  private isValidTemplate(content: string): boolean {
    if (
      typeof this.templateName === 'undefined' ||
      content.startsWith(this.templateName + ':')
    ) {
      return true;
    } else {
      return false;
    }
  }

  private stripTemplate(content: string): string {
    if (typeof this.templateName !== 'undefined') {
      return content.replace(this.templateName + ':', '').trim();
    } else {
      return content.trim();
    }
  }

  private areValuesValid(values: string[]): boolean {
    if (this.params.length < values.length) {
      return false;
    } else {
      return (
        this.params.filter(
          (param, index): boolean => {
            const { error } = Joi.validate(values[index], param.rule);
            return error === null;
          }
        ).length === values.length
      );
    }
  }
}
