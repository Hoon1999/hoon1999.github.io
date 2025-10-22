---
title: "[vue3] pinia actions"
date: 2025-10-13 23:58:00 +09:00
categories: [Framework, Vue]
tags:
  [
    vue,
    store,
    action,
    pinia
  ]
use_math: true
published: true
---

## action 의 역할
> 액션은 컴포넌트의 메서드와 동일합니다. defineStore()의 actions 속성으로 정의할 수 있으며, 비즈니스 로직을 정의하기에 완벽합니다

라고 공식문서는 설명하고 있다.<br>
그럼 왜 methods 라고 안하고 actions 라고 이름 지어서 헷갈리게 할까?<br>
이유는 다음과 같다.<br>
getter 라는 이름은 계산된 state 를 **가져온다**는 의미로 getter 라고 지었다.<br>
java 같은 객체지향 언어를 사용하다보면 getter setter 를 사용해봤을것이다. 즉 getter 의 본질은 **가져온다** 이다.<br>
그리고 getter 들을 모아놓았으니 getters 가 되는 것이다.<br>
<br>
action 도 같은 이치다.<br>
action 은 단순한 method 가 아니라 state 의 **동작**을 표현하는것이다.<br>
예를 들어 action 에 state 랑 전혀 상관없는 console.log("안녕하세요") 같은 것들로만 채워져있다면 본질에서 벗어나는 것이다.<br>

## action 작성

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    // `this`를 사용하므로, 화살표 함수는 사용할 수 없습니다
    increment() {
      this.count++
    },
    randomizeCounter() {
      this.count = Math.round(100 * Math.random())
    },
  },
})
```

위에서 말했듯 본질은 state 를 조작하는 것이다.<br>
state 를 조작하려면 
1. 매개변수로 state 를 받거나 
2. this 를 사용해야한다.

첫번째 방법을 상상해보자. action 을 사용할 때 외부에서 자기자신의 state 를 매개변수로 받는건 이상하다.<br>
그럼 두번재 방법인 this 밖에 없는데, 화살표 함수 내에서 this 는 undefined 다.<br>
그러므로 위 코드처럼 일반적인 함수 작성방식을 사용한다.<br>

## async await

```javascript
import { mande } from 'mande'
const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // 폼 컴포넌트가 에러를 표시할 수 있도록 반환
        return error
      }
    },
  },
})
```

mande 는 신경쓰지 말고 async await 만 살펴보자.<br>
action 이나 메서드나, async await 작성하는 방법의 다른점이 하나도 없다.<br>
원래 사용하던 방법 그대로 사용하면 된다.<br>

## action 호출
```html
<template>
  <!-- 방법 1 -->
  counter 의 increment action : <button @click="store.increment()">increment</button>
</template>

<script>
import { useCounterStore } from '@/stores/counter';

export default {
  name: 'App',
  data() {
    const store = useCounterStore();
    store.increment(); // 방법 2
    return {
      store
    }
  },
}
</script>
```

[스토어명].[action명]() 으로 호출하면 된다.<br>

## 다른 store 의 action 호출

```javascript
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

store 내에서 다른 store 의 action 을 호출하는 방법도 다르지 않다.<br>
다른 store 를 가져와서 action 을 호출하면 된다.<br>

## mapActions
```html
<template>
  counter 의 increment action : <button @click="store.increment()">increment</button><br/>
  counter 의 increment action : <button @click="increment()">increment</button><br/>
  counter 의 increment action : <button @click="myIncrement()">increment</button>
</template>

<script>
import { useCounterStore } from '@/stores/counter';

export default {
  name: 'App',
  data() {
    const store = useCounterStore();
    store.increment(); // 방법 2
    return {
      store
    }
  },
  methods: {
    // store 의 increment 를 this.increment() 에 매핑
    ...mapActions(useCounterStore, ['increment']),
    // store 의 increment 를 this.myIncrement() 에 매핑
    ...mapActions(useCounterStore, {
      myIncrement: 'increment'
    }),
  }
}
</script>
```

mapActions 를 사용하여 store 의 action 을 컴포넌트의 method 에 매핑할 수 있다.<br>

## action 구독

state 를 구독하는 것과 비슷하다. state 를 구독하면 state의 변화를 감시하다가 변화가 포착된 순간 특정 동작을 수행하게했다.<br>
action 을 구독하면 action 이 수행되기 전에 특정 동작을 수행하게 하고, 수행 된 후에 또 특정 동작을 수행할 수 있게 만들 수 있다.<br>

```javascript
const store = useCounterStore();

const unsubscribe = store.$onAction(callback, true); // 구독 해제 함수를 리턴한다.

unsubscribe(); // 구독해제
```

기본적인 형태는 위와같다.<br>
action 수행 전, 후로 수행할 동작을 callback 함수로 전달한다.<br>
컴포넌트에서 unmount 되어도 구독을 유지하고 싶을 때 두번째 인자로 true 를 주면된다.<br>
구독 메서드는 구독 해제 함수를 리턴하므로 직접 구독해제를 수행할 수도 있다.<br>

```javascript
const unsubscribe = store.$onAction(({ name, store, args, after, onError }) => {
  console.log("여기는 action 이 호출되기 전에 수행되는 영역입니다.");
  console.log("name: ", name); // increment 출력
  console.log("store: ", store); // store 객체 출력
  console.log("args: ", args); // action 으로 전달되는 매개변수 출력
  // 아래 변수 beforeCount 는 이 action 에서 공유됩니다.
  const beforeCount = store.count;
  console.log("beforeCount: ", beforeCount);

  after((result) => {
    console.log("액션이 성공적으로 마무리되면 수행되는 영역입니다.");
    console.log("result: ", result);
  });

  onError((error) => {
    console.log("액션이 reject 되거나 throw 되면 수행되는 영역입니다.");
    console.log("error: ", error);
  });
});
```

첫번째 인자인 callback 함수의 기본 형태는 위와같다.<br>
화살표 함수의 매개변수는 pinia 가 전달해준다. 무슨 값이 전달되는지는 함수 내부에서 console.log 로 출력해서 확인한다.<br>
action 이 수행되기 전의 동작을 화살표 함수 내부에 작성한다.<br>
action 이 수행 된 후의 동작은 after() 함수에 콜백함수로 작성해준다.<br>
action 이 실패한 경우 동작은 onError() 함수에 콜백함수로 작성해준다.<br>
