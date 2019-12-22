/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Server } from './Server';

const server = new Server();

server
  .setup()
  .then(
    (): void => {
      server.start();
    }
  )
  .catch(
    (error): void => {
      console.log('Error occurred while setting up server: ', error);
    }
  );
