---
title: "[vue3] pinia 기초 및 state"
date: 2025-10-10 23:58:00 +09:00
categories: [Framework, Vue]
tags:
  [
    vue,
    store,
    state,
    pinia
  ]
---

## 개요
vue 로 개발하면서 자손에서 조상으로 데이터를 전달해야하는 일이 있었다.<br>
근데 컴포넌트가 너무 많이 중첩되어 있어 $emit() 을 여러번 사용해야 겨우 조상으로 가져올 수 있었다.<br>
전역변수를 설정하는 법은 찾아보면 많긴한데, 그중 pinia 라는 상태 관리 라이브러리를 사용했다.<br>
단순히 값만 저장하는 변수가 아닌 반응형으로 만들 수 있기 때문이다.<br>

## 설치

```
npm install pinia
```

## pinia 의 구조

1. State
2. Getters
3. Actions

- State  
	상태 값을 의미한다. stateful, stateless 할 때, 그 state 와 동일한 개념이다. 변수도 일종의 state 라고 볼 수 있다.
- Getters  
	state 를 활용해 값을 미리 계산하는 속성. computed 라고 생각하면 된다.
- Actions  
	state 를 활용하는 methods 라고 생각하면 된다.

## Store 정의

store 는 state 를 저장하는 저장소를 의미한다.<br>
단순히 state 만 저장하지 않고 getters 와 actions 도 같이 저장할 수 있다.<br>

```javascript
import {defineStore} from 'pinia'

export const useAlertsStore = defineStore('alerts', {
})
```

store 를 정의하려면 pinia 에서 제공하는 ```defineStore()``` 함수를 사용한다.<br>
첫번째 인자는 만들고자 하는 store 의 이름을 작성해준다.<br>
이름은 store 와 devtools 와 연결해주는 id 역할도 한다.<br>
그리고 반환된 함수의 이름은 use + 이름 + Store 라고 짓는게 관례다.<br>

위에서 정의한 store 는 state 와 getters 가 없다.<br>
두번째 인자에 전달해주면 된다.<br>

## Option Store

store 의 두번째 인자에 options 객체를 전달해주는 방법이다.<br>

```javascript
// @/stores/counter.js
export const useCounterStore = defineStore('counter', {
	state: () => ({ count: 0, name: 'Eduardo'}),
	getters: {
		doubleCount: (state) => state.count * 2,
	},
	actions: {
		increment() {
			this.count++
		},
	},
})
```

option 객체를 사용해 store 를 정의하는 것의 장점은 기존의 option API 사용법과 99% 유사해 쉽다는것이다.<br>
state 를 date() 로, getters 를 computed 로, actions 를 methods 로 치환하면 거의 똑같다.<br>

아무튼 위 코드를 사용해 store 를 정의하면, count 와 name 이라는 state 를 보관하는 store 를 만들 수 있다.<br>
이제 count 가 필요하다면 vue 의 어디서든지 useCounterStore 를 호출해 count 를 꺼낼 수 있다.<br>

## Setup Store

```javascript
export const useCounterStore = defineStore('counter', () => {
	const count = ref(0)
	const name = ref('Eduardo')
	const doubleCount = computed(() => count.value * 2)
	function increment() {
		count.value++
	}
	
	return { count, name, doubleCount, increment }
})
```

setup 함수의 문법을 사용해 store 를 정의할 수 있다.<br>
문법만 setup 과 동일한게 아니라 setup store 는 options store 에 비해 더욱 유연하고 강력한 기능을 제공한다.<br>
하지만 앞으로 설명할 내용은 option store 방식을 기준으로 작성되어있다.

## Store 사용

위에선 store 를 정의했을뿐 사용할 수 있는것이 아니다.<br>
애초에 store 를 정의할 때, 이름을 useCounterStore 라고 지어줬다. 즉 **counter store 사용하기** 라는 이름인 것이고 이걸 호출해야 진짜 store 가 나온다.<br>

```javascript
// main.js
import { createApp } from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

```javascript
// src/stores(생성)/counter.js(생성)
import {defineStore} from 'pinia'

export const useCounterStore = defineStore('counter', {
	state: () => ({ count: 0, name: 'Eduardo'}),
	getters: {
		doubleCount: (state) => state.count * 2,
	},
	actions: {
		increment() {
			this.count++
		},
	},
})
```

{% raw %}
```html
// App.vue

<template>
	store 테스트 합니다.<br>
	<br />
	{{ store }}<br />
	<br />
	store.count : {{ store.count }} <br />
	store.name: {{ store.name }}
</template>

<script>
import { useCounterStore } from '@/stores/counter';

export default {
	name: 'App',
	components: {
	},
	data() {
		const store = useCounterStore();
		store.increment();
		return {
			store
		}
	}
}
</script>
```
{% endraw %}
store.increment() 를 수행했으므로 1이 정상적으로 출력되는 것을 확인할 수 있다.

## State 초기화
{% raw %}
```html
// App.vue

<template>
	store 테스트 합니다.<br>
	<br />
	{{ store }}<br />
	<br />
	store.count : {{ store.count }} <br />
	store.name: {{ store.name }}<br />
	<br />
	<button @click="clickIncrease">Increase</button><br/>
	<br/>
	<!-- 리셋 버튼을 만들어서 클릭해보자 -->
	<button @click="clickReset">Reset</button><br/> 
</template>

<script>
import { useCounterStore } from '@/stores/counter';

export default {
	name: 'App',
	components: {
	},
	data() {
		const store = useCounterStore();
		store.increment();
		return {
			store
		}
	},
	methods: {
		clickIncrease() {
			this.store.increment();
		},
		// 이 함수가 호출되면 store 의 state 가 초기화된다.
		clickReset() {
			this.store.$reset();
		}
	}
}
</script>
```
{% endraw %}
state 의 값을 초기화하기 위해선 $reset() 을 호출한다.(option store 방식)<br>

## mapState

{% raw %}
```html
<template>
	store 테스트 합니다.<br>
	<hr />
	{{ store }}<br />
	<br />
	store.count : {{ store.count }} <br />
	store.name: {{ store.name }} <br />
	<br/>
	<button @click="clickIncrese">Increase</button><br />
	<br />
	<button @click="clickReset">Reset</button><br />
	<hr />
	count : {{ count }}<br />
	doubleCount : {{ doubleCount }}<br />
	myCount : {{ myCount }}<br />
	triple : {{ triple }}<br />
	magic value : {{ magicValue }}<br />
	<button @click="clickCount">Count</button><br /><br />
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
		...mapState(useCounterStore, {
			myCount: 'count',
			triple: store => store.count * 3,
			magicValue(store) {
				return store.count + this.triple;
			}
		}),
	},
	data() {
		const store = useCounterStore();
		return {
			store
		}
	},
	methods: {
		clickIncrese() {
			this.store.increment();
		},
		clickReset() {
			this.store.$reset();
		},
		clickCount() {
			this.count++;
		}
	}
}
</script>
```
{% endraw %}
mapState 는 state 를 변수에 mapping 하는 함수다.<br>
```...mapState(useCounterStore, ['count']),``` 라고 작성하면, count 변수에 store.count 를 mapping 해준다.<br>
template 의 {% raw %} ```count : {{ count }}<br />``` {% endraw %} 가 아주 정상적으로 출력이되며 store.count 값과 공유되는것을 확인할 수 있다.<br>
두번째 인자에 배열을 사용할 때는 변수명을 변경할 수 없다. state 의 이름이 count 이면 변수명은 반드시 count 를 사용해야한다.<br>

만약 변수명을 지정하고 싶다면 아래처럼 작성하면 된다.<br>
```javascript
		...mapState(useCounterStore, {
			myCount: 'count',
			triple: store => store.count * 3,
			magicValue(store) {
				return store.count + this.triple;
			}
		}),
```
store.count 라는 state 를 myCount 라는 변수에 mapping 할 수 있게된다.<br>
뿐만 아니라 getters(computed), actions(methods) 를 작성할 수 있다.<br>
triple 이라는 변수에 ```store => store.count * 3``` 이라는 새로운 getters 를 작성해 할당한 모습을 볼 수 있고, magicValue(store) 라는 action 을 새로 작성한것도 확인할 수 있다.<br>

clickCount() 함수를 호출하면 count 가 증가하지 않는것을 확인할 수 있다.<br>
이는 mapState() 가 **읽기전용** 속성으로 mapping 해주기때문이다.<br>
만약 수정할 수 있게 하려면 mapState() 대신 mapWritableState() 를 사용해야한다.<br>
사용법은 완전히 동일하다. mapState() 를 지우고 mapWritableState() 를 작성하면된다.<br>
mapWritableState() 로 변경 후 clickCount() 함수를 호출해보자. 잘 작동할것이다.<br>

```javascript
import { mapWritableState } from 'pinia';

export default {
	computed: {
		...mapWritableState(useCounterStore, {
			myCount: 'count',
			// triple 작동 안함
			triple: store => store.count * 3,
			// magicValue 작동 안함
			magicValue(store) {
				return store.count + this.triple;
			}
		}),
	}
}
```

대신 triple 이나 magicValue 같은 함수들은 사용이 불가능하고 state만 mapping 할 수 있다.<br>

## state 값 변경

```javascript
clickCount() {
	// this.count++;
	this.store.count++;
},
// 방법 1 : 매개변수로 state 객체를 전달
// { count: count + 1, name: 'DIO' } 객체를 매개변수로 전달
clickPatch() {
	this.store.$patch({
		count: this.store.count + 1,
		name: 'DIO',
		// items: items.push({ name: 'shoes', quantity: 1 }) 불가능
	});
},
// 방법 2 : 매개변수로 익명 함수를 사용
clickPatch2() {
	this.store.$patch( state => {
		const x = this.count * this.triple + this.magicValue; // 어떤 로직
		state.count = x;
		state.count++;
		state.name = 'DIO';
	});
}
```

state 의 값을 변경할 때는 $patch 메서드를 사용한다.<br>
clickCount() 처럼 state 를 직접 조작할 수도 있지만 $patch 사용을 권장한다.<br>
이 방법의 장점은 간편하고 직관적이다.<br>
단점은 변경해야하는 것이 많은 경우 devtools 로 추적이 어렵다는 점이다.<br>
clickCount() 처럼 한 두개 정도 변경하는것이면 문제가 안되는데, 만약 100개의 state를 조작한다면 어떨까?<br>
100 개의 변경사항이 개별적인 변경사항으로 기록되어 뿔뿔이 흩어져 기록될 수가 있다.<br>
만약 이해가 안되도 괜찮다. $patch 설명을 들으면 이해가 될 수있다.<br>

$patch() 의 사용 방법은 2 가지다.<br>
변경할 state 들을 객체로 만들어 전달하는 방법과 함수로 묶어서 사용하는 방법이다.<br>
방법 1 의 경우 간편하지만 복잡한 조작이 어렵다. 예를 들어 items.push() 같은 경우 객체 내부에서 사용할 수 없다.<br>
또한 방법 2 에 나와있는 것처럼 어떤 로직이 필요한 경우 방법 1 에선 사용할 수 없다.<br>

$patch() 를 사용하는 이유중 하나는 변경 history 가 patch 단위로 기록된다는 것이다.<br>
patch 도중 인터럽트가 들어와 다른 로직이 수행되고 다시 patch 가 마무리 되면 변경 history 가 한번에 기록이 된다는 의미다.<br>
만약 patch 를 사용하지 않고 this.store.count++; this.store.name = 'DIO' 를 사용했다면, history 에 count++ 작성되고, name = "DIO" 이렇게 작성될것이다.<br>
만약 중간에 다른 기능이 수행되면? 두 history 는 떨어지게 될 것이다.<br>

$patch() 를 사용하는 두번째 이유는 코드 일관성이 유지되어 유지보수하기 용이해진다.<br>
state 를 변경하는 로직에 모두 patch 를 사용하면 나중에 patch 를 검색해서 찾아갈 수 있다.<br>

## state 변화 감시(구독)

```javascript
const store = useCounterStore();
store.$subscribe( (mutation, state) => {
	console.log("store 변화가 감지되었습니다.");
	console.log("mutation.type: " + mutation.type);
	console.log("mutation.storeId: "+ mutation.storeId);
	console.log("mutation.payload: " + mutation.payload);
	console.log(state);
});
// 또는
store.$subscribe( (mutation, state) => {
	console.log("store 변화가 감지되었습니다.");
	console.log("mutation.type: " + mutation.type);
	console.log("mutation.storeId: "+ mutation.storeId);
	console.log("mutation.payload: " + mutation.payload);
	console.log(state);
}, { flush: 'sync' });
```

store의 변화를 감시하려면 $subscribe( ) 메서드를 사용한다.<br>
값의 변화가 감지되면 수행할 동작을 콜백함수로 작성해준다.<br>

pinia 는 객체의 상태가 변화할때마다 mutation 객체를 만들어서 넘겨주는데, 이것으로 다음 정보를 확인할 수 있다.<br>
- mutation.type
store 의 변경 방식에 대해 알려준다.<br>
1. direct : 직접 수정. store.count++ 과 같이 직접 조작한 경우다.
2. patch function : $patch( state => { count = count + 1 } ) 를 이용한 경우다.
3. patch object : $patch( { count: count + 1 } ) 를 이용한 경우다.
$patch 를 사용할때 객체를 사용했으면 patch object 라고 알려주고 함수를 사용해 조작했으면 patch function 이라고 알려준다.<br>

- mutation.storeId
변화가 감지된 store 의 id 를 알려준다.<br>
위 코드 같은 경우 id 가 'counter' 가 출력된다.<br>

- mutation.payload
mutation.type 이 patch object 인 경우에만 출력된다.<br>
patch 로 전달된 object 를 알려준다.<br>
$patch( { count: count + 1 } ) 를 했으면 mutation.payload 는 { count: count + 1 } 가 된다.<br>

$subscribe( ) 는 내부적으로 vue 의 watch( ) 를 사용하기 때문에 flush 값을 watch 로 전달해줄 수 있다.<br>
flush 는 default 값이 있기 때문에 생략해도 된다.<br>

## 구독 해제
```html
<template>
	<!-- 생략 -->
	<button @click="clickPatch">Patch</button><br /><br />
	<button @click="clickUnsubscribe">Unsubscribe</button><br /><br />
</template>

<script>
export default {
	name: 'App',
	components: {
	},
	//생략
	,

	data() {
		const store = useCounterStore();
		const unsubscribe = store.$subscribe( (mutation, state) => {
		console.log("store 변화가 감지되었습니다.");
		console.log("mutation.type: " + mutation.type);
		console.log("mutation.storeId: "+ mutation.storeId);
		console.log("mutation.payload: " + mutation.payload);
		console.log(state);
		});
		return {
			store, unsubscribe
		}
	},
	methods: {
		// 생략
		clickPatch() {
			this.store.$patch( state => {
				const x = this.count * this.triple + this.magicValue;
				state.count = x;
				state.count++;
				state.name = 'DIO';
			});
			// this.store.$patch({
				// count: this.store.count+1,
				// hasChanged: true,
			// })
		},
		clickUnsubscribe() {
			this.unsubscribe(); // 구독 해제
		}
	}
}
</script>
```

const unsubscribe = store.$subscribe( )<br>
$subscribe( ) 는 **구독 해제 함수** 를 리턴한다.<br>
즉 리턴된 함수를 사용하면 구독이 해제된다.<br>
unsubscribe 버튼을 클릭하기 전 후로 patch 버튼을 클릭해 비교해보면 확인할 수 있다.<br>


