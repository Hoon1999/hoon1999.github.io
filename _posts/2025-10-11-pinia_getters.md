---
title: "[vue3] pinia getter"
date: 2025-10-11 23:58:00 +09:00
categories: [Framework, Vue]
tags:
  [
    vue,
    store,
    getter,
    pinia
  ]
---


## getter 의 역할
getters 는 computed 랑 같은 역할을 한다.

## getter 작성

```javascript
// 방법 1
getters: {
  doubleCount: (state) => state.count * 2
}
```

```javascript
// 방법 2
getters: {
  doubleCountPlusOne() { 
    // return doubleCount + 1; // 오류 : doubleCount 를 찾을 수 없음
    return this.doubleCount + 1;
  }
}
```

options store 기준으로 getter 작성 방법은 두 가지가 있다.<br>
단순히 state 의 값을 사용해 계산하는것은 화살표 함수로 가능하다.<br>
만약 방법 2 처럼 다른 getter 를 사용해야한다면 this 를 붙여줘야하기 때문에 익명 함수를 사용할 수 없다.<br>

## getter 에 인자 전달

getter 는 computed 이기 때문에 인자를 받을 수 없다.<br>
하지만 만약 getter 의 return 이 함수라면? 직접 확인해보자.<br>

{% raw %}
```javascript
import { defineStore } from "pinia";

export const useUserStore = defineStore ('user', {
    state: () => ({ users: [{id: 1, name: 'kim'}, {id:2, name: 'lee'}]}),
    getters: {
        getUserById: (state) => {
            return (userId) => { return state.users.find((user) => user.id === userId) }
        }
    }
})
```
{% endraw %}

{% raw %}
```html
<template>
  user(2) : {{ userStore.getUserById(2) }}
</template>

<script>
import { useUserStore } from './stores/user';
export default {
  name: 'App',
  components: {
  },
  data() {
    const userStore = useUserStore();
    return {
      userStore
    }
  },
}
</script>
```
{% endraw %}

userStore.getUserById(2) 의 출력 결과로 { "id": 2, "name": "lee" } 가 나오는 것을 확인할 수 있다.<br>

```javascript
getters: {
  getUserById: (state) => {
    return (userId) => { return state.users.find((user) => user.id === userId) }
    }
  }
```

이 코드를 잘 보자.<br>
getUserById 는 (userId) => { //생략 } 이라는 함수를 반환 한다.<br>
getUserById(2) 라고 줬으니, (2) => {return state.users.find((user) => user.id === 2)} 가 되고, state.users.find((user) => user.id === 2) 의 결과가 { "id": 2, "name": "lee" } 이므로, 이 값이 화면에 출력된 것이다.<br>

## 다른 store 의 getter 사용하기

```js
import {defineStore} from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0, name: 'Eduardo', items: []}),
    getters: {
        doubleCount: (state) => state.count * 2,
        doubleCountPlusOne() {
            return this.doubleCount + 1;
        },
        // 여기를 주목
        // hello 라는 이름의 getter 를 추가
        hello() {
            return "안녕 나는 counter store 야~";
        }
    },
    actions: {
        increment() {
            this.count++
        },
    },
})
```

```javascript
import { defineStore } from "pinia";
import { useCounterStore } from "./counter";

export const useUserStore = defineStore ('user', {
    state: () => ({ users: [{id: 1, name: 'kim'}, {id:2, name: 'lee'}]}),
    getters: {
        getUserById: (state) => {
            return (userId) => { return state.users.find((user) => user.id === userId) }
        },
        // 여기를 주목
        // counter store 에서 hello 라는 getter 를 가져와 사용했다
        helloCounterStore() {
            const counterStore = useCounterStore();
            return counterStore.hello;
        }
    }
})
```

{% raw %}
```html
<template>
  <!-- 생략 -->
  <hr/>
  <!-- user store 에서 counter store 의 hello getter 가 출력되는 것을 확인할 수 있다. -->
  user store 에서 counter store 호출 : {{ userStore.helloCounterStore }}
</template>

<script>
import { mapState } from 'pinia';
import { useCounterStore } from '@/stores/counter';
import { useUserStore } from './stores/user';

export default {
  name: 'App',
  components: {
  },
  computed: {
  },
  data() {
    const userStore = useUserStore();
    const store = useCounterStore();
    // 생략
    return {
      store, unsubscribe, userStore
    }
  },
  methods: {
    // 생략
  }
}
</script>
```
{% endraw %}

다른 store 의 getter 를 호출하는 법은 간단하다.<br>
다른 store 를 꺼내서 getter 를 사용하면 된다.<br>
제대로 가져와서 사용되는지 확인하려고 화면까지 가져와 출력해봤다. 정상적으로 출력된다<br>

## mapState

```javascript
import {defineStore} from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0, name: 'Eduardo', items: []}),
    getters: {
        doubleCount: (state) => state.count * 2,
        doubleCountPlusOne() {
            return this.doubleCount + 1;
        },
        hello() {
            return "안녕 나는 counter store 야~";
        }
    },
    actions: {
        increment() {
            this.count++
        },
    },
})
```

```html
<template>
  store 테스트 합니다.<br>
  <!-- 생략 -->
  doubleCount: {{ doubleCount }}<br />
  <!-- 이하 생략 -->
</template>
<script>
import { mapState } from 'pinia';
import { useCounterStore } from '@/stores/counter';

export default {
  name: 'App',
  components: {
  },
  computed: {
    ...mapState(useCounterStore, ['count', 'doubleCount']),
  },
  // 이하 생략
}
</script>
```

함수 이름은 mapState 지만 getters 도 맵핑할 수 있다.<br>
counter store 의 count state 와 doubleCount getter 를 각각 count 변수와 doubleCount 변수에 맵핑했다.<br>
그래서 template 에서 변수명만 사용해도 출력되는 모습을 확인할 수 있다.<br>

