/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AtomShellType } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableCommandList } from '../animation/ObservableCommandList';

export class ObservableParticle {
  @observable
  public position: { x: number; y: number };

  @observable
  public color: 'normal' | 'highlighted';

  @observable
  public enabled: boolean;

  @observable
  public commandList: ObservableCommandList;

  @observable
  public id: string;

  @observable
  public character: string;

  @observable
  public shellType: AtomShellType;

  @observable
  public index: number;

  @observable
  public newPosition?: { x: number; y: number };

  public constructor(
    id: string,
    enabled: boolean,
    character: string,
    position: { x: number; y: number },
    shellType: AtomShellType,
    index: number,
    color: 'normal' | 'highlighted'
  ) {
    this.id = id;
    this.enabled = enabled;
    this.character = character;
    this.commandList = new ObservableCommandList();
    this.position = position;
    this.shellType = shellType;
    this.index = index;
    this.color = color;
  }
}
