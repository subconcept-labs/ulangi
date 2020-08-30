import styled from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const SideBarContainer = styled(View)({
  width: '250px',
  backgroundColor: config.styles.primaryColor,
});

export const TopContainer = styled(View)({
  padding: '16px',
  flexDirection: 'row',
  alignItems: 'center',
});

export const Avatar = styled(View)({
  height: '44px',
  width: '44px',
  borderRadius: '4px',
  backgroundColor: '#353e54',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
  boxShadow: '0 2px 4px #00000030',
});

export const AvatarText = styled.span({
  fontSize: '25px',
  color: '#eee',
});

export const EmailContainer = styled(View)({
  flexShrink: 1,
  marginLeft: '12px',
});

export const LoggedInAs = styled.span({
  fontSize: '12px',
  color: '#f7f7f7',
});

export const Email = styled.span({
  fontSize: '14px',
  color: '#f7f7f7',
  paddingTop: '2px',
  fontWeight: 'bold',
});

export const MenuContainer = styled(View)({
  padding: '10px 0px',
  flex: 'auto',
});

export const MenuItem = styled.a({
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  opacity: 0.8,
});

export const MenuItemIcon = styled.img({});

export const MenuItemText = styled.span({
  paddingLeft: '6px',
  color: '#fff',
  fontWeight: 700,
});

export const BottomContainer = styled(View)({
  padding: '20px',
});

export const Touchable = styled.a({});

export const TouchableText = styled.span({
  color: config.styles.lightPrimaryColor,
  fontSize: '15px',
});
