# @ulangi/ulangi-mobile

Ulangi App for iOS and Android

---
## Install local packages
All packages are installed locally (not from npm registry). Any changes to the local packages require you to reinstall them as symlink is not supported by react-native bundler yet.
```
npm run install-local

# install-local is shorthand for
npm run pack-local && npm run install-packed-local
```

---
## Important note
- When add new npm or react-native package, please run the command below to fix all schemes. Otherwise, you will encounter some build errors.
  ```
  react-native-schemes-manager all
  ```
---

## Run with local simulator 
### iOS
```
react-native run-ios --scheme UlangiMobile-Dev

# To run with Release configuration
react-native run-ios --scheme UlangiMobile-Dev --configuration Release
```

### Android
```
# You may need to open emulator first
emulator -avd Nexus_5X_API_26

react-native run-android --variant=devDebug

# To run with Release configuration
react-native run-android --variant=devRelease

---
## Run e2e tests

1. Navigate to ```e2e``` folder:
```
cd e2e
```

2. If you haven't build the app, run build first
```
npm run build-ios 
npm run build-android 
```

3. You may need to open simulator or android emulator before running the test 
```
emulator -avd Nexus_5X_API_26
```

4. Run the test
```
npm run test-ios
npm run test-android

# To run a single test file
npm run test-ios -- path_to_test_file
```

---
## Take screenshots
1. Navigate to ```e2e``` folder
```
cd e2e
```

2. If you haven't build the app, run build first
```
npm run build-ios 
npm run build-android 
```

3. Run the app to take screenshots
```
npm run screenshot-ios
npm run screenshot-android
```

