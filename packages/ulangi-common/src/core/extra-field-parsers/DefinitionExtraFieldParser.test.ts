/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefinitionExtraFieldParser } from './DefinitionExtraFieldParser';

describe('DefinitionExtraFieldParser', (): void => {
  const parser = new DefinitionExtraFieldParser();

  test('strip an invalid field', (): void => {
    const result = parser.parse('meaning [unknown]');

    expect(result.plainMeaning).toEqual('meaning');
  });

  test('strip any invalid fields', (): void => {
    const result = parser.parse(
      'meaning [example: example_value] [unknown] [note: note_value]'
    );

    expect(result.plainMeaning).toEqual('meaning');
    expect(result.extraFields.example).toEqual([['example_value']]);
    expect(result.extraFields.note).toEqual([['note_value']]);
  });

  test('strip pipe characters', (): void => {
    const result = parser.parse(
      '[n] | term [not extra fields] | [example: example_value]'
    );

    expect(result.plainMeaning).toEqual('term [not extra fields]');
    expect(result.extraFields.wordClass).toEqual([['n']]);
    expect(result.extraFields.example).toEqual([['example_value']]);
  });

  test('only parse extra fields they are at the end', (): void => {
    const result = parser.parse(
      'meaning [example: example_value] with [note: note_value]'
    );

    expect(result.plainMeaning).toEqual(
      'meaning [example: example_value] with'
    );
    expect(result.extraFields.note).toEqual([['note_value']]);
  });

  test('should not parse word class from right', (): void => {
    const result = parser.parse('meaning [n] [v]');

    expect(result.plainMeaning).toEqual('meaning');
    expect(result.extraFields.wordClass).toEqual([]);
  });

  test('parse multpile extra fields with new lines', (): void => {
    const result = parser.parse(
      '[n]\n[v]\nmeaning\n[example: example_value]\n[note: note_value]'
    );

    expect(result.plainMeaning).toEqual('meaning');
    expect(result.extraFields.wordClass).toEqual([['n'], ['v']]);
    expect(result.extraFields.example).toEqual([['example_value']]);
    expect(result.extraFields.note).toEqual([['note_value']]);
  });

  test('parse multilple extra fields with spaces in between', (): void => {
    const result = parser.parse(
      '[n] [v] meaning [example: example_value] [note: note_value]'
    );

    expect(result.plainMeaning).toEqual('meaning');
    expect(result.extraFields.wordClass).toEqual([['n'], ['v']]);
    expect(result.extraFields.example).toEqual([['example_value']]);
    expect(result.extraFields.note).toEqual([['note_value']]);
  });

  test('parse multilple extra fields without spaces in between', (): void => {
    const result = parser.parse(
      '[n][v]meaning[example: example_value][note: note_value]'
    );

    expect(result.plainMeaning).toEqual('meaning');
    expect(result.extraFields.example).toEqual([['example_value']]);
    expect(result.extraFields.note).toEqual([['note_value']]);
  });

  test('parse extra fields with inner brackets', (): void => {
    const result = parser.parse('meaning [note: note_value[]]');

    expect(result.plainMeaning).toEqual('meaning');
    expect(result.extraFields.note).toEqual([['note_value[]']]);
  });

  test('parse wordClass', (): void => {
    const result = parser.parse('[n][v] meaning');

    expect(result.plainMeaning).toEqual('meaning');
    expect(result.extraFields.wordClass).toEqual([['n'], ['v']]);
  });

  test('parse synonym', (): void => {
    const result = parser.parse('term [synonym: value1] [synonym:value2]');

    expect(result.plainMeaning).toEqual('term');
    expect(result.extraFields.synonym).toEqual([['value1'], ['value2']]);
  });

  test('parse antonym', (): void => {
    const result = parser.parse('term [antonym: value1] [antonym:value2]');

    expect(result.plainMeaning).toEqual('term');
    expect(result.extraFields.antonym).toEqual([['value1'], ['value2']]);
  });

  test('parse example', (): void => {
    const result = parser.parse('meaning [example: value1] [example:value2]');

    expect(result.plainMeaning).toEqual('meaning');
    expect(result.extraFields.example).toEqual([['value1'], ['value2']]);
  });

  test('parse note', (): void => {
    const result = parser.parse('meaning [note: value1] [note:value2]');

    expect(result.plainMeaning).toEqual('meaning');
    expect(result.extraFields.note).toEqual([['value1'], ['value2']]);
  });
});
