/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as express from 'express';

const app = express();

app.get('/', function(_, res): void {
  res.send('It works.');
});

const port = process.env.PORT || 3000;

app.listen(port, (): void => console.log(`Server listening on port ${port}`));
