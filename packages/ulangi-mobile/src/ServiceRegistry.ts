/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';

import { Services } from './interfaces/Services';

export class ServiceRegistry {
  private static registry: Partial<Services> = {};

  public static register<K extends keyof Services>(
    name: K,
    prop: Services[K],
  ): void {
    ServiceRegistry.registry[name] = prop;
  }

  public static get<K extends keyof Services>(name: K): Services[K] {
    return assertExists(ServiceRegistry.registry[name] as Services[K]);
  }

  public static getAll(): Services {
    return ServiceRegistry.registry as Services;
  }
}
