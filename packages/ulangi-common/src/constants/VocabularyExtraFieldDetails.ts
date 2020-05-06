/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ExtraFieldDetail } from '../core/extra-field-details/ExtraFieldDetail';
import { FemaleExtraFieldDetail } from '../core/extra-field-details/FemaleExtraFieldDetail';
import { GenderExtraFieldDetail } from '../core/extra-field-details/GenderExtraFieldDetail';
import { HiraganaExtraFieldDetail } from '../core/extra-field-details/HiraganaExtraFieldDetail';
import { IPAExtraFieldDetail } from '../core/extra-field-details/IPAExtraFieldDetail';
import { KanjiExtraFieldDetail } from '../core/extra-field-details/KanjiExtraFieldDetail';
import { KatakanaExtraFieldDetail } from '../core/extra-field-details/KatakanaExtraFieldDetail';
import { MaleExtraFieldDetail } from '../core/extra-field-details/MaleExtraFieldDetail';
import { NoteExtraFieldDetail } from '../core/extra-field-details/NoteExtraFieldDetail';
import { PastExtraFieldDetail } from '../core/extra-field-details/PastExtraFieldDetail';
import { PastParticipleExtraFieldDetail } from '../core/extra-field-details/PastParticipleExtraFieldDetail';
import { PinyinExtraFieldDetail } from '../core/extra-field-details/PinyinExtraFieldDetail';
import { PluralExtraFieldDetail } from '../core/extra-field-details/PluralExtraFieldDetail';
import { PresentExtraFieldDetail } from '../core/extra-field-details/PresentExtraFieldDetail';
import { PronunciationExtraFieldDetail } from '../core/extra-field-details/PronunicationExtraFieldDetail';
import { ReadingExtraFieldDetail } from '../core/extra-field-details/ReadingExtraFieldDetail';
import { RomajiExtraFieldDetail } from '../core/extra-field-details/RomajiExtraFieldDetail';
import { RomanizationExtraFieldDetail } from '../core/extra-field-details/RomanizationExtraFieldDetail';
import { SimplifiedExtraFieldDetail } from '../core/extra-field-details/SimplifiedExtraFieldDetail';
import { SingularExtraFieldDetail } from '../core/extra-field-details/SingularExtraFieldDetail';
import { TraditionalExtraFieldDetail } from '../core/extra-field-details/TraditionalExtraFieldDetail';
import { ZhuyinExtraFieldDetail } from '../core/extra-field-details/ZhuyinExtraFieldDetail';
import { VocabularyExtraFields } from '../interfaces/general/VocabularyExtraFields';

export const VocabularyExtraFieldDetails: {
  [P in keyof VocabularyExtraFields]: ExtraFieldDetail
} = {
  ipa: new IPAExtraFieldDetail(),
  pronunciation: new PronunciationExtraFieldDetail(),
  simplified: new SimplifiedExtraFieldDetail(),
  traditional: new TraditionalExtraFieldDetail(),
  plural: new PluralExtraFieldDetail(),
  singular: new SingularExtraFieldDetail(),
  note: new NoteExtraFieldDetail('Note', 'Note for the term', 'term'),
  present: new PresentExtraFieldDetail(),
  past: new PastExtraFieldDetail(),
  pastParticiple: new PastParticipleExtraFieldDetail(),
  reading: new ReadingExtraFieldDetail(),
  kanji: new KanjiExtraFieldDetail(),
  hiragana: new HiraganaExtraFieldDetail(),
  katakana: new KatakanaExtraFieldDetail(),
  romaji: new RomajiExtraFieldDetail(),
  romanization: new RomanizationExtraFieldDetail(),
  pinyin: new PinyinExtraFieldDetail(),
  zhuyin: new ZhuyinExtraFieldDetail(),
  gender: new GenderExtraFieldDetail(),
  female: new FemaleExtraFieldDetail(),
  male: new MaleExtraFieldDetail(),
};
