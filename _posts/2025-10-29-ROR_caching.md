---
title: "[Ruby on Rails 8][Tutorial] Caching"
date: 2025-10-29 21:20:00 +09:00
categories: [Framework, Ruby on Rails]
tags:
  [
    Ruby on Rails,
    Ruby,
    caching
  ]
use_math: true
published: true
---

> [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html)<br>
위 튜토리얼을 따라 학습하며 작성한 글입니다.

## 개요
페이지의 일부분을 캐시하여 성능을 높일 수 있다.<br>
Rails 에는 기본적으로 Database 기반 Solid Cache 를 통해 이 기능을 단순화하였다.<br>

## 직접해보기
```erb
<%# app/view/products/show.html.erb %>

<% cache @product do %>
    <h1><%= @product.name %></h1>
<% end %>

이하 생략
```

cache 메서드에 @product 를 매개변수로 주었다.<br>
Active Record 객체는 cache_key 라는 메서드를 가지고 있다.<br>
cache 헬퍼는 이 cache_key 와 template digest 를 결합하여 unique key 를 만든다.<br>
cache_key 가 궁금하면 ```<%= @product.cache_key %>``` 를 입력하여 확인할 수 있다.<br>
template digest 는 뭔지 설명이 안되어있는데, 깊게 공부하는게 아니고 unique key 를 만든다는게 중요한거니 넘어간다.<br>

## 개발 환경 캐싱 활성화

```console
$ bin/rails dev:cache
Development mode is now being cached.
$ bin/rails dev:cache
Development mode is no longer being cached.
```

bin/rails dev:cache 를 한 번 입력하면 활성화되고 두 번 입력하면 비활성화 된다.<br>

## 캐싱 확인
제품 상세 페이지 링크를 클릭하면 다음과 같은 로그가 찍힌것을 확인할 수 있다.
```
Read fragment views/products/show:61a15e7c1d77d58e31fb96f742897de4/products/2-20251012142411713671 (0.3ms)
Write fragment views/products/show:61a15e7c1d77d58e31fb96f742897de4/products/2-20251012142411713671 (0.1ms)
```

/products/2 로 요청을 보냈더니 /view/products/show:생략/products/2-생략 으로 Read fragment 를 수행한다.<br>
하지만 처음 접속하는 것이므로 cache 가 없다. read 에 실패(?)하면 Write fragment 를 수행한다.<br>
그 다음부턴 요청을 보낼 때 Read fragment 에 성공하므로 Write fragment 가 나오지않는것을 볼 수 있다.<br>

링크를 클릭하지 않고 마우스만 올려놔도 클릭한것 처럼 데이터를 요청하고 가져오는 것을 확인할 수 있다.<br>
이는 rails 의 turbo 기능이 제공하는 prefetch 때문으로 추측된다.<br>
헷갈리면 마우스 호버시 수행되는 동작이 실제로 일어나지 않았고 클릭시에 일어난다고 생각하자.<br>