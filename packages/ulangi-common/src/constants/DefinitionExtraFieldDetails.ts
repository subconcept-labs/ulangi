/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AntonymExtraFieldDetail } from '../core/extra-field-details/AntonymExtraFieldDetail';
import { ExampleExtraFieldDetail } from '../core/extra-field-details/ExampleExtraFieldDetail';
import { ExtraFieldDetail } from '../core/extra-field-details/ExtraFieldDetail';
import { ImageExtraFieldDetail } from '../core/extra-field-details/ImageExtraFieldDetail';
import { NoteExtraFieldDetail } from '../core/extra-field-details/NoteExtraFieldDetail';
import { SynonymExtraFieldDetail } from '../core/extra-field-details/SynonymExtraFieldDetail';
import { WordClassExtraFieldDetail } from '../core/extra-field-details/WordClassExtraFieldDetail';
import { DefinitionExtraFields } from '../interfaces/general/DefinitionExtraFields';

export const DefinitionExtraFieldDetails: {
  [P in keyof DefinitionExtraFields]: ExtraFieldDetail
} = {
  wordClass: new WordClassExtraFieldDetail(),
  image: new ImageExtraFieldDetail(
    'Image',
    'Image for the definition',
    'definition'
  ),
  synonym: new SynonymExtraFieldDetail(),
  antonym: new AntonymExtraFieldDetail(),
  example: new ExampleExtraFieldDetail(),
  note: new NoteExtraFieldDetail(
    'Note',
    'Note for the definition',
    'definition'
  ),
};
