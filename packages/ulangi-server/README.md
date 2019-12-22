# @ulangi/ulangi-server

This package is the backend of [Ulangi](https://ulangi.com).

---
## Install local package
This package depends on ```ulangi-common``` and it must be installed locally. Any changes to this local package requires you to reinstall it.
```
npm run install-local

# install-local is shorthand for
npm run pack-local && npm run install-packed-local
```

---
## Start local server
### 1. Create .env.dev in /config by copying .env.example and fill in all neccessary values.

### 2. Start the server
```
npm run dev
```
