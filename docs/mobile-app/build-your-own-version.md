---
layout: page
title: Build and install custom version
parent: Mobile App
nav_order: 0
permalink: /mobile-app/build-and-install-custom-version/
---
## Build and install your own Ulangi app

#### Difficulty: Easy

### 1. Clone the project from GitHub

```bash
git clone git@github.com:ulangi/ulangi.git
```

---

### 2. Install dependencies and set up environment

```bash
# Go to the root project
cd ulangi

npm run bootstrap && npm run compile-all && npm run set-up-dev-env
```

#### Explanation:
- ```npm run bootstrap```: Install dependencies of all packages.
- ```npm run compile```: Compile source code to JavaScript.
- ```npm run set-up-dev-env```: Set up default environment variables.

---

### 3. Install the app on your device

```bash
# Go to the mobile app project
cd packages/ulangi-mobile

open ios/UlangiMobile.xcworkspace
```
