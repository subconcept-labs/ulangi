---
layout: page
title: Build and install
parent: Mobile App
nav_order: 0
permalink: /mobile-app/build-and-install/
---
# Build and install

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
- ```npm run compile-all```: Compile source code to JavaScript.
- ```npm run set-up-dev-env```: Set up default environment variables.

---

### 3. Install the app on your device

```bash
# Go to the mobile app project
cd packages/ulangi-mobile
```

#### iOS:
```bash
# Open xcode to install it on your device
open ios/UlangiMobile.xcworkspace

# Or install it to the simulator
npm run ios
```

#### Android:
```bash
# Open emulator or plug-in your device first
npm run android
```
