---
layout: page
title: Run a local server
parent: Server Side
nav_order: 0
permalink: /server-side/run-a-local-server/
---

# Run a local server

#### Difficulty: Easy

---

### Prerequisites
- MySQL 5.6 or above installed

---

### 0. Bootstrap (if you haven't)
```bash
# run the following commands in the root project directory 
npm run bootstrap && npm run compile-all && npm run set-up-dev-env
```

---

### 1. Create databases
```bash
# Login to mysql (assuming user is root)
mysql -u root -p

# Enter password when prompted
```

After logged in, create databases by entering following SQL:
```sql
create database ulangi_auth;
create database ulangi_shard_0;
```

---

### 2. Edit config/.env.dev
```bash
# Go to ulangi-server package
cd packages/ulangi-server

open config/.env.dev
```

```
# On AUTH_DATABASE_CONFIG line, change to your database user and password
AUTH_DATABASE_CONFIG=(localhost;3306;ulangi_auth;root;password;20)

# On ALL_SHARD_DATABASE_CONFIG line, change to your database user and password
ALL_SHARD_DATABASE_CONFIG=(0;localhost;3306;root;password;20)

# Add a random key to JWT_SECRET_KEY
JWT_SECRET_KEY=
```

---

### 3. Run server
```bash
npm run dev
```
