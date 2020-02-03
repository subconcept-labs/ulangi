import { observable } from 'mobx';

export class ObservableFeatureSettings {
  @observable
  public spacedRepetitionEnabled: boolean;

  @observable
  public writingEnabled: boolean;

  @observable
  public quizEnabled: boolean;

  @observable
  public reflexEnabled: boolean;

  @observable
  public atomEnabled: boolean;

  public constructor(
    spacedRepetitionEnabled: boolean,
    writingEnabled: boolean,
    quizEnabled: boolean,
    reflexEnabled: boolean,
    atomEnabled: boolean
  ) {
    this.spacedRepetitionEnabled = spacedRepetitionEnabled;
    this.writingEnabled = writingEnabled;
    this.quizEnabled = quizEnabled;
    this.reflexEnabled = reflexEnabled;
    this.atomEnabled = atomEnabled;
  }
}
