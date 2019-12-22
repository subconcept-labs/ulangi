import * as slugid from 'slugid';

export function generateRandomEmail(): string {
  return slugid.v4() + '@ulangi.com';
}
