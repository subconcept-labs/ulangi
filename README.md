<h1 align="center">
  <img src="https://github.com/minhloi/ulangi/blob/master/images/logo.png?raw=true"><br>
  <span>Ulangi</span><br>
</h1>
<h3 align="center">
  <span>Advanced open-source language learning app</span><br>
  <span>with 20+ features</span><br>
</h3>

<h3 align="center">
  <a href="/" alt="Written in React-Native">
    <img src="https://img.shields.io/badge/framework-react--native-brightgreen" /></a>
  <a href="https://github.com/minhloi/ulangi/releases" alt="Release version">
    <img src="https://img.shields.io/github/v/tag/minhloi/ulangi?label=version" /></a>
  <a href="https://twitter.com/UlangiApp" alt="Ulangi's Twitter">
    <img src="https://img.shields.io/twitter/follow/UlangiApp?style=social" /></a>
</h3>

---
## Main apps

iOS: [https://itunes.apple.com/us/app/id1435524341?mt=8](https://itunes.apple.com/us/app/id1435524341?mt=8)

Android: [https://play.google.com/store/apps/details?id=com.ulangi](https://play.google.com/store/apps/details?id=com.ulangi)

---
## Table of contents
- [Bootstrapping](#bootstrapping)
- [Local packages](#local-packages)
- [Architecture](#architecture)
- [Dependency diagram](#dependency-diagram)

---
## Bootstrapping
This project uses monorepo architecture. To add/remove dependencies, you must manually enter/remove them inside package.json of respective packages then run ```npm run bootstrap``` in the root folder.

| Command | What it does |
| --- | --- |
| ```npm run bootstrap``` | This will install dependencies of each package; however, it does not remove existing dependencies. |
| ```npm run rebootstrap``` | This will clean up ```node_modules``` of each package and install their dependencies. |


---
## Local packages
| Package | Responsiblities |
| --- | --- |
| [@ulangi/ulangi-common](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-common) | It defines all common interfaces, types, enums... so that all packages can communicate with each other. |
| [@ulangi/ulangi-action](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-action) | It defines all actions that can be fired in the app. Some packages can publish and/or subscribe to these actions. |
| [@ulangi/ulangi-event](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-event) | Contains EventBus and utilities for subscribing and publishisg actions (used by ```ulangi-mobile```).  |
| [@ulangi/ulangi-saga](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-saga) | Asynchronous tasks, such as reading from local databases and sending requests to the server are defined in this package. |
| [@ulangi/ulangi-store](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-store) | This package contains all global states (such as current logged in user) and their respective reducers. |
| [@ulangi/ulangi-observable](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-observable) | The packages contains all observable states that can be used in views and delegates. |
| [@ulangi/ulangi-local-database](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-local-database) |  Local databases used by client for offline access. |
| [@ulangi/ulangi-remote-database](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-remote-database) | Remote databases used by server for data back-up. |
| [@ulangi/ulangi-mobile](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-mobile) | This package contains all views (presentation logic) and delegates (business logic) of the mobile platform.|
| [@ulangi/ulangi-server](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-server) | This is the [backend](https://ulangi.com) of Ulangi. |
| [@ulangi/ulangi-dictionary](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-dictionary) | Used to connect with dictionary server. |
| [@ulangi/ulangi-library](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-library) | Used to connect with library server. |
| [@ulangi/ulangi-script](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-script) | It contains all useful CLIs and scripts for development and maintenance. |
| [@ulangi/ulangi-data](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-data) | It contains curated flashcards. |
| [@ulangi/ulangi-google-sheets](https://github.com/minhloi/ulangi/tree/master/packages/ulangi-google-sheets) | Ulangi Sheets add-on published in G Suite Marketplace. |

---
## Architecture
![Ulangi's Architecture](/images/architecture.png)

---
## Dependency Diagram
![Ulangi's Dependency Diagram](/images/dependency-diagram.png)
