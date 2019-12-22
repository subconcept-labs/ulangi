import { Config } from '../interfaces/Config';
import { ConfigResolver } from '../resolvers/ConfigResolver';

export function loadConfig(): Config {
  const rawConfig = require('../../config/config.json');
  return new ConfigResolver().resolve(rawConfig, true);
}
