import 'jest-extended';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'config', '.env.test') });

jest.setTimeout(10000);

