import { Env } from '../interfaces/Env';
import { EnvResolver } from '../resolvers/EnvResolver';

export function resolveEnv(): Env {
  return new EnvResolver().resolve(
    process.env,
    true
  );
}
