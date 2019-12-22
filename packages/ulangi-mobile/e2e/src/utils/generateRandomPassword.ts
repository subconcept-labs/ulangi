import * as slugid from 'slugid';

export function generateRandomPassword(): string {
  return slugid.v4().toLowerCase();
}
