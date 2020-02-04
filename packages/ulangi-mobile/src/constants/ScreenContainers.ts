/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { PrivacyPolicyScreenContainer } from '../views/about/PrivacyPolicyScreenContainer';
import { TermsOfServiceScreenContainer } from '../views/about/TermsOfServiceScreenContainer';
import { ChangeEmailScreenContainer } from '../views/account/ChangeEmailScreenContainer';
import { ChangePasswordScreenContainer } from '../views/account/ChangePasswordScreenContainer';
import { SecurityScreenContainer } from '../views/account/SecurityScreenContainer';
import { SetUpAccountScreenContainer } from '../views/account/SetUpAccountScreenContainer';
import { AdScreenContainer } from '../views/ad/AdScreenContainer';
import { AtomGameOverScreenContainer } from '../views/atom/AtomGameOverScreenContainer';
import { AtomPausedScreenContainer } from '../views/atom/AtomPausedScreenContainer';
import { AtomPlayScreenContainer } from '../views/atom/AtomPlayScreenContainer';
import { AtomScreenContainer } from '../views/atom/AtomScreenContainer';
import { AtomTutorialScreenContainer } from '../views/atom/AtomTutorialScreenContainer';
import { ForgotPasswordScreenContainer } from '../views/auth/ForgotPasswordScreenContainer';
import { SignInScreenContainer } from '../views/auth/SignInScreenContainer';
import { SignOutScreenContainer } from '../views/auth/SignOutScreenContainer';
import { SignUpScreenContainer } from '../views/auth/SignUpScreenContainer';
import { AutoArchiveScreenContainer } from '../views/auto-archive/AutoArchiveScreenContainer';
import { CategorizeScreenContainer } from '../views/category/CategorizeScreenContainer';
import { CategoryDetailScreenContainer } from '../views/category/CategoryDetailScreenContainer';
import { CategorySelectorScreenContainer } from '../views/category/CategorySelectorScreenContainer';
import { ContactUsScreenContainer } from '../views/contact-us/ContactUsScreenContainer';
import { DataSharingScreenContainer } from '../views/data-sharing/DataSharingScreenContainer';
import { DiscoverScreenContainer } from '../views/discover/DiscoverScreenContainer';
import { PublicSetDetailScreenContainer } from '../views/discover/PublicSetDetailScreenContainer';
import { FlashcardPlayerScreenContainer } from '../views/flashcard-player/FlashcardPlayerScreenContainer';
import { FollowUsScreenContainer } from '../views/follow-us/FollowUsScreenContainer';
import { GoogleSheetsAddOnScreenContainer } from '../views/google-sheets/GoogleSheetsAddOnScreenContainer';
import { ImageSelectorScreenContainer } from '../views/image/ImageSelectorScreenContainer';
import { FeatureManagementScreenContainer } from '../views/learn/FeatureManagementScreenContainer';
import { LearnScreenContainer } from '../views/learn/LearnScreenContainer';
import { IntervalsScreenContainer } from '../views/level/IntervalsScreenContainer';
import { LevelBreakdownScreenContainer } from '../views/level/LevelBreakdownScreenContainer';
import { LightBoxActionMenuScreenContainer } from '../views/light-box/LightBoxActionMenuScreenContainer';
import { LightBoxDialogScreenContainer } from '../views/light-box/LightBoxDialogScreenContainer';
import { LightBoxSelectionMenuScreenContainer } from '../views/light-box/LightBoxSelectionMenuScreenContainer';
import { ManageScreenContainer } from '../views/manage/ManageScreenContainer';
import { MembershipScreenContainer } from '../views/membership/MembershipScreenContainer';
import { MoreScreenContainer } from '../views/more/MoreScreenContainer';
import { OpenSourceProjectsScreenContainer } from '../views/open-source/OpenSourceProjectsScreenContainer';
import { PreloadScreenContainer } from '../views/preload/PreloadScreenContainer';
import { QuizMultipleChoiceScreenContainer } from '../views/quiz/QuizMultipleChoiceScreenContainer';
import { QuizScreenContainer } from '../views/quiz/QuizScreenContainer';
import { QuizSettingsScreenContainer } from '../views/quiz/QuizSettingsScreenContainer';
import { QuizWritingScreenContainer } from '../views/quiz/QuizWritingScreenContainer';
import { ReflexGameOverScreenContainer } from '../views/reflex/ReflexGameOverScreenContainer';
import { ReflexPausedScreenContainer } from '../views/reflex/ReflexPausedScreenContainer';
import { ReflexScreenContainer } from '../views/reflex/ReflexScreenContainer';
import { ReminderScreenContainer } from '../views/reminder/ReminderScreenContainer';
import { ReviewFeedbackScreenContainer } from '../views/review-feedback/ReviewFeedbackScreenContainer';
import { SearchScreenContainer } from '../views/search/SearchScreenContainer';
import { AddSetScreenContainer } from '../views/set/AddSetScreenContainer';
import { CreateFirstSetScreenContainer } from '../views/set/CreateFirstSetScreenContainer';
import { EditSetScreenContainer } from '../views/set/EditSetScreenContainer';
import { SetManagementScreenContainer } from '../views/set/SetManagementScreenContainer';
import { SpacedRepetitionFAQScreenContainer } from '../views/spaced-repetition/SpacedRepetitionFAQScreenContainer';
import { SpacedRepetitionLessonScreenContainer } from '../views/spaced-repetition/SpacedRepetitionLessonScreenContainer';
import { SpacedRepetitionScreenContainer } from '../views/spaced-repetition/SpacedRepetitionScreenContainer';
import { SpacedRepetitionSettingsScreenContainer } from '../views/spaced-repetition/SpacedRepetitionSettingsScreenContainer';
import { SynchronizerScreenContainer } from '../views/sync/SynchronizerScreenContainer';
import { ThemeScreenContainer } from '../views/theme/ThemeScreenContainer';
import { QuickTutorialScreenContainer } from '../views/tip/QuickTutorialScreenContainer';
import { AddVocabularyScreenContainer } from '../views/vocabulary/AddVocabularyScreenContainer';
import { DictionaryPickerScreenContainer } from '../views/vocabulary/DictionaryPickerScreenContainer';
import { EditVocabularyScreenContainer } from '../views/vocabulary/EditVocabularyScreenContainer';
import { ExtraFieldsPickerScreenContainer } from '../views/vocabulary/ExtraFieldsPickerScreenContainer';
import { VocabularyDetailScreenContainer } from '../views/vocabulary/VocabularyDetailScreenContainer';
import { WelcomeScreenContainer } from '../views/welcome/WelcomeScreenContainer';
import { WhatsNewScreenContainer } from '../views/whats-new/WhatsNewScreenContainer';
import { WritingFAQScreenContainer } from '../views/writing/WritingFAQScreenContainer';
import { WritingLessonScreenContainer } from '../views/writing/WritingLessonScreenContainer';
import { WritingScreenContainer } from '../views/writing/WritingScreenContainer';
import { WritingSettingsScreenContainer } from '../views/writing/WritingSettingsScreenContainer';

export const ScreenContainers = {
  ADD_SET_SCREEN: AddSetScreenContainer,
  ADD_VOCABULARY_SCREEN: AddVocabularyScreenContainer,
  AD_SCREEN: AdScreenContainer,
  ATOM_GAME_OVER_SCREEN: AtomGameOverScreenContainer,
  ATOM_PAUSED_SCREEN: AtomPausedScreenContainer,
  ATOM_PLAY_SCREEN: AtomPlayScreenContainer,
  ATOM_SCREEN: AtomScreenContainer,
  ATOM_TUTORIAL_SCREEN: AtomTutorialScreenContainer,
  AUTO_ARCHIVE_SCREEN: AutoArchiveScreenContainer,
  CATEGORIZE_SCREEN: CategorizeScreenContainer,
  CATEGORY_DETAIL_SCREEN: CategoryDetailScreenContainer,
  CATEGORY_SELECTOR_SCREEN: CategorySelectorScreenContainer,
  CHANGE_EMAIL_SCREEN: ChangeEmailScreenContainer,
  CHANGE_PASSWORD_SCREEN: ChangePasswordScreenContainer,
  CONTACT_US_SCREEN: ContactUsScreenContainer,
  CREATE_FIRST_SET_SCREEN: CreateFirstSetScreenContainer,
  DATA_SHARING_SCREEN: DataSharingScreenContainer,
  DICTIONARY_PICKER_SCREEN: DictionaryPickerScreenContainer,
  DISCOVER_SCREEN: DiscoverScreenContainer,
  EDIT_SET_SCREEN: EditSetScreenContainer,
  EDIT_VOCABULARY_SCREEN: EditVocabularyScreenContainer,
  EXTRA_FIELDS_PICKER_SCREEN: ExtraFieldsPickerScreenContainer,
  FEATURE_MANAGEMENT_SCREEN: FeatureManagementScreenContainer,
  FLASHCARD_PLAYER_SCREEN: FlashcardPlayerScreenContainer,
  FOLLOW_US_SCREEN: FollowUsScreenContainer,
  FORGOT_PASSWORD_SCREEN: ForgotPasswordScreenContainer,
  GOOGLE_SHEETS_ADD_ON_SCREEN: GoogleSheetsAddOnScreenContainer,
  IMAGE_SELECTOR_SCREEN: ImageSelectorScreenContainer,
  INTERVALS_SCREEN: IntervalsScreenContainer,
  LEARN_SCREEN: LearnScreenContainer,
  LEVEL_BREAKDOWN_SCREEN: LevelBreakdownScreenContainer,
  LIGHT_BOX_ACTION_MENU_SCREEN: LightBoxActionMenuScreenContainer,
  LIGHT_BOX_DIALOG_SCREEN: LightBoxDialogScreenContainer,
  LIGHT_BOX_SELECTION_MENU_SCREEN: LightBoxSelectionMenuScreenContainer,
  MANAGE_SCREEN: ManageScreenContainer,
  MEMBERSHIP_SCREEN: MembershipScreenContainer,
  MORE_SCREEN: MoreScreenContainer,
  OPEN_SOURCE_PROJECTS_SCREEN: OpenSourceProjectsScreenContainer,
  PRELOAD_SCREEN: PreloadScreenContainer,
  PRIVACY_POLICY_SCREEN: PrivacyPolicyScreenContainer,
  PUBLIC_SET_DETAIL_SCREEN: PublicSetDetailScreenContainer,
  QUICK_TUTORIAL_SCREEN: QuickTutorialScreenContainer,
  QUIZ_MULTIPLE_CHOICE_SCREEN: QuizMultipleChoiceScreenContainer,
  QUIZ_SCREEN: QuizScreenContainer,
  QUIZ_SETTINGS_SCREEN: QuizSettingsScreenContainer,
  QUIZ_WRITING_SCREEN: QuizWritingScreenContainer,
  REFLEX_GAME_OVER_SCREEN: ReflexGameOverScreenContainer,
  REFLEX_PAUSED_SCREEN: ReflexPausedScreenContainer,
  REFLEX_SCREEN: ReflexScreenContainer,
  REMINDER_SCREEN: ReminderScreenContainer,
  REVIEW_FEEDBACK_SCREEN: ReviewFeedbackScreenContainer,
  SEARCH_SCREEN: SearchScreenContainer,
  SECURITY_SCREEN: SecurityScreenContainer,
  SET_MANAGEMENT_SCREEN: SetManagementScreenContainer,
  SET_UP_ACCOUNT_SCREEN: SetUpAccountScreenContainer,
  SIGN_IN_SCREEN: SignInScreenContainer,
  SIGN_OUT_SCREEN: SignOutScreenContainer,
  SIGN_UP_SCREEN: SignUpScreenContainer,
  SPACED_REPETITION_FAQ_SCREEN: SpacedRepetitionFAQScreenContainer,
  SPACED_REPETITION_LESSON_SCREEN: SpacedRepetitionLessonScreenContainer,
  SPACED_REPETITION_SCREEN: SpacedRepetitionScreenContainer,
  SPACED_REPETITION_SETTINGS_SCREEN: SpacedRepetitionSettingsScreenContainer,
  SYNCHRONIZER_SCREEN: SynchronizerScreenContainer,
  TERMS_OF_SERVICE_SCREEN: TermsOfServiceScreenContainer,
  THEME_SCREEN: ThemeScreenContainer,
  VOCABULARY_DETAIL_SCREEN: VocabularyDetailScreenContainer,
  WELCOME_SCREEN: WelcomeScreenContainer,
  WHATS_NEW_SCREEN: WhatsNewScreenContainer,
  WRITING_FAQ_SCREEN: WritingFAQScreenContainer,
  WRITING_LESSON_SCREEN: WritingLessonScreenContainer,
  WRITING_SCREEN: WritingScreenContainer,
  WRITING_SETTINGS_SCREEN: WritingSettingsScreenContainer,
};
