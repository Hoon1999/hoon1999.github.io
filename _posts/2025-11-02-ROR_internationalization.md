---
title: "[Ruby on Rails 8][Tutorial] Internationalization"
date: 2025-11-02 14:20:00 +09:00
categories: [Framework, Ruby on Rails]
tags:
  [
    Ruby on Rails,
    Ruby,
    internationalization
  ]
use_math: true
published: true
---

> [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html)<br>
위 튜토리얼을 따라 학습하며 작성한 글입니다.

## 개요
여러 국가 언어를 동시에 지원하는 방법을 배워본다.<br>
이 기능을 Internationalization 이라고 하며 줄여서 I18n 이라고 적는다.<br>

translate 또는 t 헬퍼를 사용하여 구현할 수 있다.<br>

## 테스트
```erb
<h1><%= t "hello" %></h1>
```

app/views/products/index.html.erb 에 위 코드를 추가하면 ```Hello world``` 가 출력된다.<br>
왜 출력될까? <br>
![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-11-02-ROR_internationalization/1.png?raw=true)<br>
```hello``` 문자열을 ```Hello world``` 로 번역했기 때문이다.<br>

## 새로운 locale file 생성 및 설정
영어 말고 스페인어도 만들어보자.<br>
```yml
es:
  hello: "Hola mundo"
```
config/locale/es.yml 파일을 만들고 위와 같이 작성한다.<br>

하지만 이런다고 바로 es.yml locale file 을 사용할 수 있는게 아니다.<br>
controller 에서 어떤 locale 을 사용할 지 지정해줘야한다.<br>

```ruby
  around_action :switch_locale

  def switch_locale(&action)
    locale = params[:locale] || I18n.default_locale
    I18n.with_locale(locale, &action)
```
locale 변수에 params[:locale] 또는 I18n.default_locale 값을 할당한다.<br>
I18n.with_locale 로 locale 파일을 지정한다.<br>

마지막으로 모든 controller 에 공통적으로 적용하기 위해 application_controller.rb 파일에 작성한다.<br>
이제 파라미터에 locale 을 넣고 locale file 명을 집어넣으면 잘 적용되는 모습을 볼 수 있다.<br>

http://localhost:3000/products?locale=es 로 요청하면 es.yml 을 이용한 번역을 확인할 수 있다.<br>

## 상대경로 이용하기
위에선 hello 를 Hello world 로 변경시켜 출력했다.<br>
그러나 다른 페이지에선 hello 를 Hello Korea 로 변경시켜야할 수도 있다.<br>
물론 hello 가 아닌 다른 키워드를 사용해도 되지만, 여기선 동일한 키워드가 다른 경로를 참조할 수 있도록 하는 방법을 알아본다.<br>

```
<%# app/view/products/index.html.erb %>

변경 전
<h1>Products</h1>

변경 후
<h1><%= t ".title" %></h1>
```

```.```은 현재 컨트롤러의 액션을 가리킨다. 즉 ```.title``` 은 ```products.index.title``` 을 의미하게 된다.<br>
en.yml 파일과 es.yml 파일을 다음과 같이 수정하자.<br>

```yml
en:
  hello: "Hello world"
  products:
    index:
      title: "Products"
```

```yml
es:
  hello: "Hola mundo"
  products:
    index:
      title: "Productos"
```

그리고 ```http://localhost:3000/products?locale=en```, ```http://localhost:3000/products?locale=es``` 으로 각각 테스트해보면 정상적으로 반영되는 것을 확인할 수 있다.<br>

