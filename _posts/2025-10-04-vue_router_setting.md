---
title: "vue router 세팅"
date: 2025-10-04 18:21:00 +09:00
categories: [개발, vue]
tags:
  [
    vue,
  ]
---

## 설치 및 세팅

**설치**<br>

```
npm install vue-router@4
```

npm run serve 하는 경로로 가서 npm install vue-router@버전 을 입력해 설치한다.<br>

**라우팅 정보 작성**<br>

```javascript
// router/index.js

import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
    history: createWebHistory(""),
    routes: [
        {
            name: "login", // 원하는 이름
            path: "/", // 경로
            component: () => import("../views/Login.vue") // 보여줄 vue 파일
        },
        {
            name: "chatting",
            path: "/chatting",
            component: () => import("../views/Chatting.vue")
        }
    ],
});

export default router;
```

src > router (디렉토리 생성) > index.js (생성) 후 위처럼 라우팅 정보를 작성해준다.<br>
위를 예로 들면 사용자가 /chatting 경로를 요청했을때 Chatting.vue 를 보여주도록 세팅한 것이다.<br>

**router 사용** <br>

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from "./router" // ./router/index.js에서 내보낸 router 인스턴스를 가져옴

createApp(App).use(router).mount('#app') // App 에 router 플러그인을 등록함
```

작성한 router 객체를 main.js 에 등록해준다.<br>

**테스트**<br>

```vue
<!-- App.vue -->

<template>
  <RouterView></RouterView>
</template>
```

실행 후 / 경로를 요청하면 RouterView 태그 자리에 위에서 설정했던 Login.vue 가 들어온다.<br>
이번엔 /chatting 경로를 요청하면 RouterView 자리에 Chatting.vue 가 들어온다.<br>