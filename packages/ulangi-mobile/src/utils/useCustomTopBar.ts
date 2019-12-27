import { OptionsTopBar } from '@ulangi/react-native-navigation';
import { CustomViewName, ScreenName } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

import { TopBarPassedProps } from '../views/top-bar/TopBar';
import { TopBarStyles } from '../views/top-bar/TopBar.style';

export function useCustomTopBar(
  options: OptionsTopBar & {
    screenName: ScreenName;
    styles: {
      light: TopBarStyles;
      dark: TopBarStyles;
    };
  },
): OptionsTopBar {
  return _.merge(
    {
      title: {
        component: {
          name: CustomViewName.TOP_BAR,
          alignment: 'fill',
          passProps: {
            get passedProps(): TopBarPassedProps {
              return {
                screenName: options.screenName,
                styles: options.styles,
              };
            },
          },
        },
      },
    },
    options,
  );
}
