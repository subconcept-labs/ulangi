import * as _ from 'lodash';

export class AttributionHelper {
  public formatSource(source: string): string {
    if (_.includes(['wiktionary', 'google', 'ulangi', 'wikibooks'], source)) {
      return _.upperFirst(source);
    } else {
      return source;
    }
  }

  public getLicenseBySource(source: string): string | undefined {
    if (source === 'wiktionary') {
      return 'CC SA-BY 3.0';
    } else {
      return undefined;
    }
  }

  public getLinkByLicense(license: string): string | undefined {
    if (license === 'CC SA-BY 3.0') {
      return 'https://creativecommons.org/licenses/by-sa/3.0/';
    } else {
      return undefined;
    }
  }

  public generateLinkBySource(
    source: string,
    extra: { term?: string }
  ): undefined | string {
    if (source === 'wiktionary') {
      return 'https://en.wiktionary.org/wiki/' + (extra.term || '');
    } else {
      return undefined;
    }
  }
}
