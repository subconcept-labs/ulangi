/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyExtraFieldParser } from './VocabularyExtraFieldParser';

describe('VocabularyExtraFieldParser', (): void => {
  const parser = new VocabularyExtraFieldParser();

  test('strip an invalid fields', (): void => {
    const result = parser.parse('term [unknown]');

    expect(result.vocabularyTerm).toEqual('term');
  });

  test('strip any invalid field', (): void => {
    const result = parser.parse(
      'term [ipa: ipa_value] [unknown] [kanji: kanji_value]'
    );

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.ipa).toEqual([['ipa_value']]);
    expect(result.extraFields.kanji).toEqual([['kanji_value']]);
  });

  test('strip pipe character', (): void => {
    const result = parser.parse('term [not extra fields] | [ipa: ipa_value]');

    expect(result.vocabularyTerm).toEqual('term [not extra fields]');
    expect(result.extraFields.ipa).toEqual([['ipa_value']]);
  });

  test('only parse extra fields they are at the end', (): void => {
    const result = parser.parse(
      'term [ipa: ipa_value] with [kanji:kanji_value]'
    );

    expect(result.vocabularyTerm).toEqual('term [ipa: ipa_value] with');
    expect(result.extraFields.kanji).toEqual([['kanji_value']]);
  });

  test('parse multiple extra fields with new lines', (): void => {
    const result = parser.parse('term\n[ipa: ipa_value]\n[kanji:kanji_value]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.ipa).toEqual([['ipa_value']]);
    expect(result.extraFields.kanji).toEqual([['kanji_value']]);
  });

  test('parse multilple extra fields with spaces in between', (): void => {
    const result = parser.parse('term [ipa: ipa_value] [kanji:kanji_value]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.ipa).toEqual([['ipa_value']]);
    expect(result.extraFields.kanji).toEqual([['kanji_value']]);
  });

  test('parse multilple extra fields without spaces in between', (): void => {
    const result = parser.parse('term[ipa: ipa_value][kanji:kanji_value]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.ipa).toEqual([['ipa_value']]);
    expect(result.extraFields.kanji).toEqual([['kanji_value']]);
  });

  test('parse extra fields with inner brackets', (): void => {
    const result = parser.parse('term [ipa: ipa_value[]]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.ipa).toEqual([['ipa_value[]']]);
  });

  test('parse ipa', (): void => {
    const result = parser.parse('term [ipa: value1] [ipa:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.ipa).toEqual([['value1'], ['value2']]);
  });

  test('parse singular', (): void => {
    const result = parser.parse('term [singular: value1] [singular:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.singular).toEqual([['value1'], ['value2']]);
  });

  test('parse plural', (): void => {
    const result = parser.parse('term [plural: value1] [plural:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.plural).toEqual([['value1'], ['value2']]);
  });

  test('parse note', (): void => {
    const result = parser.parse('term [note: value1] [note:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.note).toEqual([['value1'], ['value2']]);
  });

  test('parse present form', (): void => {
    const result = parser.parse('term [present: value1] [present:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.present).toEqual([['value1'], ['value2']]);
  });

  test('parse past form', (): void => {
    const result = parser.parse('term [past: value1] [past:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.past).toEqual([['value1'], ['value2']]);
  });

  test('parse past participle form', (): void => {
    const result = parser.parse(
      'term [past-participle: value1] [past-participle:value2]'
    );

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.pastParticiple).toEqual([['value1'], ['value2']]);
  });

  test('parse kanji', (): void => {
    const result = parser.parse('term [kanji: value1] [kanji:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.kanji).toEqual([['value1'], ['value2']]);
  });

  test('parse hiragana', (): void => {
    const result = parser.parse('term [hiragana: value1] [hiragana:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.hiragana).toEqual([['value1'], ['value2']]);
  });

  test('parse katakana', (): void => {
    const result = parser.parse('term [katakana: value1] [katakana:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.katakana).toEqual([['value1'], ['value2']]);
  });

  test('parse romaji', (): void => {
    const result = parser.parse('term [romaji: value1] [romaji:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.romaji).toEqual([['value1'], ['value2']]);
  });

  test('parse pinyin', (): void => {
    const result = parser.parse('term [pinyin: value1] [pinyin:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.pinyin).toEqual([['value1'], ['value2']]);
  });

  test('parse gender', (): void => {
    const result = parser.parse('term [feminine] [masculine] [neutral]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.gender).toEqual([
      ['feminine'],
      ['masculine'],
      ['neutral'],
    ]);
  });

  test('parse female', (): void => {
    const result = parser.parse('term [female: value1] [female:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.female).toEqual([['value1'], ['value2']]);
  });

  test('parse male', (): void => {
    const result = parser.parse('term [male: value1] [male:value2]');

    expect(result.vocabularyTerm).toEqual('term');
    expect(result.extraFields.male).toEqual([['value1'], ['value2']]);
  });
});
