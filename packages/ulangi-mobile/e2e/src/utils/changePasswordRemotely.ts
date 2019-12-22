import axios, { AxiosResponse } from 'axios';

import * as config from '../../e2e.config';

export function changePasswordRemotely(
  newPassword: string,
  currentPassword: string,
  accessToken: string
): Promise<AxiosResponse<any>> {
  return axios.post(
    config.apiUrl + '/change-password',
    {
      newPassword,
      currentPassword,
    },
    { headers: { Authorization: 'Bearer ' + accessToken } }
  );
}
