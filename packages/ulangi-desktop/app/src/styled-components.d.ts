// This file adds interface for theme props

import 'styled-components';

interface CustomTheme {
  name: 'light' | 'dark';
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends CustomTheme {}
}
