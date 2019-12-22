/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ActivityState } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableImageSelectorScreen,
  ObservablePixabayImage,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';

export class SearchImageDelegate {
  private eventBus: EventBus;
  private observableConverter: ObservableConverter;
  private observableScreen: ObservableImageSelectorScreen;

  public constructor(
    eventBus: EventBus,
    observableConverter: ObservableConverter,
    observableScreen: ObservableImageSelectorScreen
  ) {
    this.eventBus = eventBus;
    this.observableConverter = observableConverter;
    this.observableScreen = observableScreen;
  }

  public prepareAndSearch(): void {
    if (this.observableScreen.input.get() !== '') {
      this.eventBus.pubsub(
        createAction(ActionType.IMAGE__PREPARE_SEARCH_IMAGES, {
          q: this.observableScreen.input.get(),
          safesearch: true,
          image_type: 'all',
        }),
        group(
          on(
            ActionType.IMAGE__PREPARING_SEARCH_IMAGES,
            (): void => {
              this.observableScreen.searchState.set(ActivityState.ACTIVE);
            }
          ),
          once(
            ActionType.IMAGE__PREPARE_SEARCH_IMAGES_SUCCEEDED,
            (): void => {
              this.observableScreen.searchState.set(ActivityState.INACTIVE);
              this.search();
            }
          ),
          once(
            ActionType.IMAGE__PREPARE_SEARCH_IMAGES_FAILED,
            (): void => {
              this.observableScreen.searchState.set(ActivityState.ERROR);
            }
          ),
          once(
            ActionType.IMAGE__CLEAR_SEARCH,
            (): void => {
              this.observableScreen.searchState.set(ActivityState.INACTIVE);
            }
          )
        )
      );
    }
  }

  public search(): void {
    if (
      this.observableScreen.noMore.get() === false &&
      this.observableScreen.searchState.get() === ActivityState.INACTIVE
    ) {
      this.eventBus.pubsub(
        createAction(ActionType.IMAGE__SEARCH_IMAGES, {}),
        group(
          on(
            ActionType.IMAGE__SEARCHING_IMAGES,
            (): void => {
              this.observableScreen.searchState.set(ActivityState.ACTIVE);
            }
          ),
          once(
            ActionType.IMAGE__SEARCH_IMAGES_SUCCEEDED,
            ({ images, noMore }): void => {
              this.observableScreen.searchState.set(ActivityState.INACTIVE);
              this.observableScreen.isRefreshing.set(false);
              this.observableScreen.noMore.set(noMore);
              const observableImages = images.map(
                (image): ObservablePixabayImage => {
                  return this.observableConverter.convertToObservablePixabayImage(
                    image
                  );
                }
              );

              if (this.observableScreen.images !== null) {
                this.observableScreen.images.push(...observableImages);
              } else {
                this.observableScreen.images = observable.array(
                  observableImages
                );
              }
            }
          ),
          once(
            ActionType.IMAGE__SEARCH_IMAGES_FAILED,
            (): void => {
              this.observableScreen.searchState.set(ActivityState.ERROR);
              this.observableScreen.isRefreshing.set(false);
            }
          ),
          once(
            ActionType.IMAGE__CLEAR_SEARCH,
            (): void => {
              this.observableScreen.searchState.set(ActivityState.INACTIVE);
            }
          )
        )
      );
    }
  }

  public clearSearch(): void {
    this.eventBus.publish(createAction(ActionType.IMAGE__CLEAR_SEARCH, null));
    this.observableScreen.images = null;
    this.observableScreen.isRefreshing.set(false);
    this.observableScreen.noMore.set(false);
    this.observableScreen.searchState.set(ActivityState.INACTIVE);
  }

  public resetSearch(): void {
    this.observableScreen.isRefreshing.set(true);
    this.clearSearch();
    this.prepareAndSearch();
  }
}
