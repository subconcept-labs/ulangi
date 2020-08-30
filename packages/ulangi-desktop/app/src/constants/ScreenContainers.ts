import { ForgotPasswordScreenContainer } from '../views/auth/ForgotPasswordScreenContainer';
import { SignInScreenContainer } from '../views/auth/SignInScreenContainer';
import { SignOutScreenContainer } from '../views/auth/SignOutScreenContainer';
import { SignUpScreenContainer } from '../views/auth/SignUpScreenContainer';
import { DiscoverScreenContainer } from '../views/discover/DiscoverScreenContainer';
import { LearnScreenContainer } from '../views/learn/LearnScreenContainer';
import { LightBoxDialogScreenContainer } from '../views/light-box/LightBoxDialogScreenContainer';
import { LightBoxSelectionMenuScreenContainer } from '../views/light-box/LightBoxSelectionMenuScreenContainer';
import { LevelBreakdownScreenContainer } from "../views/level/LevelBreakdownScreenContainer"
import { ManageScreenContainer } from '../views/manage/ManageScreenContainer';
import { MoreScreenContainer } from '../views/more/MoreScreenContainer';
import { MainTabBasedScreenContainer } from '../views/navigation/MainTabBasedScreenContainer';
import { PreloadScreenContainer } from '../views/preload/PreloadScreenContainer';
import { HeatMapScreenContainer } from '../views/progress/HeatMapScreenContainer';
import { ProgressScreenContainer } from '../views/progress/ProgressScreenContainer';
import { CreateFirstSetScreenContainer } from '../views/set/CreateFirtSetScreenContainer';
import { WelcomeScreenContainer } from '../views/welcome/WelcomeScreenContainer';
import { AddSetScreenContainer } from "../views/set/AddSetScreenContainer"
import { SetManagementScreenContainer } from "../views/set/SetManagementScreenContainer"
import { CategorySelectorScreenContainer } from "../views/category/CategorySelectorScreenContainer"
import { CategoryDetailScreenContainer } from "../views/category/CategoryDetailScreenContainer"
import { AddVocabularyScreenContainer } from "../views/vocabulary/AddVocabularyScreenContainer"
import { SpacedRepetitionScreenContainer } from "../views/spaced-repetition/SpacedRepetitionScreenContainer"
import { WritingScreenContainer } from "../views/writing/WritingScreenContainer"
import { QuizScreenContainer } from "../views/quiz/QuizScreenContainer"
import { AtomScreenContainer } from "../views/atom/AtomScreenContainer"
import { ReflexScreenContainer } from "../views/reflex/ReflexScreenContainer"

export const ScreenContainers = {
  PRELOAD_SCREEN: PreloadScreenContainer,
  WELCOME_SCREEN: WelcomeScreenContainer,
  SIGN_IN_SCREEN: SignInScreenContainer,
  SIGN_UP_SCREEN: SignUpScreenContainer,
  FORGOT_PASSWORD_SCREEN: ForgotPasswordScreenContainer,
  MAIN_TAB_BASED_SCREEN: MainTabBasedScreenContainer,
  LIGHT_BOX_DIALOG_SCREEN: LightBoxDialogScreenContainer,
  LIGHT_BOX_SELECTION_MENU_SCREEN: LightBoxSelectionMenuScreenContainer,
  MANAGE_SCREEN: ManageScreenContainer,
  DISCOVER_SCREEN: DiscoverScreenContainer,
  LEARN_SCREEN: LearnScreenContainer,
  PROGRESS_SCREEN: ProgressScreenContainer,
  MORE_SCREEN: MoreScreenContainer,
  CREATE_FIRST_SET_SCREEN: CreateFirstSetScreenContainer,
  SIGN_OUT_SCREEN: SignOutScreenContainer,
  HEAT_MAP_SCREEN: HeatMapScreenContainer,
  SET_MANAGEMENT_SCREEN: SetManagementScreenContainer,
  ADD_SET_SCREEN: AddSetScreenContainer,
  LEVEL_BREAKDOWN_SCREEN: LevelBreakdownScreenContainer,
  ADD_VOCABULARY_SCREEN: AddVocabularyScreenContainer,
  CATEGORY_SELECTOR_SCREEN: CategorySelectorScreenContainer,
  CATEGORY_DETAIL_SCREEN: CategoryDetailScreenContainer,
  SPACED_REPETITION_SCREEN: SpacedRepetitionScreenContainer,
  WRITING_SCREEN: WritingScreenContainer,
  QUIZ_SCREEN: QuizScreenContainer,
  ATOM_SCREEN: AtomScreenContainer,
  REFLEX_SCREEN: ReflexScreenContainer,
};
