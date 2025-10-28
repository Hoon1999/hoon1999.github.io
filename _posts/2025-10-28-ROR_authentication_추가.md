---
title: "[Ruby on Rails 8][Tutorial] Authentication 추가"
date: 2025-10-28 21:20:00 +09:00
categories: [Framework, Ruby on Rails]
tags:
  [
    Ruby on Rails,
    Ruby,
    authentication
  ]
use_math: true
published: true
---

> [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html)<br>
위 튜토리얼을 따라 학습하며 작성한 글입니다.

## 개요
현재 제품 목록 페이지와 제품 상세 페이지는 아무나 수정할 수 있다.<br>
로그인 기능을 만들어 보안을 강화한다.<br>
user 와 session 에 대한 model, controller, view(로그인 페이지)를 만든다.<br>

## authentication generator
rails 8 에는 authentication 생성기가 있다.<br>
user 와 session 에 대한 model, contoller, view 를 일일히 만들필요가 없다.<br>
생성기를 사용해 authentication 을 만들고 커스텀해보자.<br>
```console
$ bin/rails generate authentication
$ bin/rails db:migrate
아래는 출력 결과
== 20251025214856 CreateUsers: migrating ======================================
-- create_table(:users)
   -> 0.0010s
-- add_index(:users, :email_address, {unique: true})
   -> 0.0004s
== 20251025214856 CreateUsers: migrated (0.0015s) =============================

== 20251025214857 CreateSessions: migrating ===================================
-- create_table(:sessions)
   -> 0.0013s
== 20251025214857 CreateSessions: migrated (0.0013s) ==========================
```
users 테이블과 session 테이블이 만들어진 것을 볼 수 있다.<br>

```console
$ bin/rails console
store> User.create! email_address: "foo@bar.org", password: "password", password_confirmation: "password"
```
첫 user 는 콘솔에서 직접 만들어넣자.<br>
코드만 읽고 확인할 수 있는것
- User 라는 model(class) 이 만들어진 것
- create! 라는 메서드를 이용해 user 를 추가한 것(ruby 는 특정 상황에서 매개변수의 괄호를 생략할 수 있다.)

ruby 문법: create 메서드와 create! 메서드의 차이점은 뭘까?<br>
1. dangerous method 라는 의미
2. 예외를 발생한다는 의미
여기서는 2번으로 사용된다.<br>
- create! : 실패 시 예외 발생
- create : 실패 시 유효하지 않은 User 객체 반환
필요에 따라 적절히 사용하면 된다.<br>
직접 테스트 해보자.<br>

```console
한번 더 수행
store> User.create! email_address: "foo@bar.org", password: "password", password_confirmation: "password"

(store):3:in '<main>': SQLite3::ConstraintException: UNIQUE constraint failed: users.email_address (ActiveRecord::RecordNotUnique)
/Users/kjhoon44/.local/share/mise/installs/ruby/3.4.7/lib/ruby/gems/3.4.0/gems/sqlite3-2.7.4-arm64-darwin/lib/sqlite3/statement.rb:125:in 'SQLite3::Statement#step': UNIQUE constraint failed: users.email_address (SQLite3::ConstraintException)
```
users.email_address 에 unique 제약조건이 걸려있기 때문에 ActiveRecord::RecordNotUnique 라는 예외를 발생시켰다고 나온다.<br>

```console
> User.create email_address: "foo@bar.org", password: "password", password_confirmation: "password"

(store):15:in '<main>': SQLite3::ConstraintException: UNIQUE constraint failed: users.email_address (ActiveRecord::RecordNotUnique)
/Users/kjhoon44/.local/share/mise/installs/ruby/3.4.7/lib/ruby/gems/3.4.0/gems/sqlite3-2.7.4-arm64-darwin/lib/sqlite3/statement.rb:125:in 'SQLite3::Statement#step': UNIQUE constraint failed: users.email_address (SQLite3::ConstraintException)
```

엥 같은 예외가 발생했다? <br>
사실 이 예외는 create 가 아니라 sqlite 에서 예외를 발생시킨거니 둘 다 발생하는게 맞다.<br>

다시 rails 로 돌아와서 웹 페이지에 접속해보자.<br>
```console
$ bin/rails server
```
사이트에 접속하면 어느 페이지를 가던 /session/new 경로의 로그인 페이지로 빨려들어간다.<br>

## log out 추가
button_to 헬퍼를 이용해 로그아웃 기능을 넣는다.<br>
근데, 그냥 넣으면 배울게 없으니까 웹 페이지 전체에 적용될 수 있도록 해본다.<br>
```erb
<%# app/views/layouts/application.html.erb %>
<!DOCTYPE html>
<html>
  <head>
    <!-- 생략 -->
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```

app/views/layouts/application.html.erb 파일을 열어보면 위와같이 작성되어있다.<br>
app/views/layouts/application.html.erb 이 레이아웃 파일은 기본적으로 모든 페이지에 적용되는 레이아웃이다.<br>
다음과 같이 body 를 수정한다.<br>

```erb
<%# app/views/layouts/application.html.erb %>
<!DOCTYPE html>
<html>
  <head>
    <!-- 생략 -->
  </head>

  <body>
    <nav>
      <%= link_to "Home", root_path %>
      <%= button_to "Log out", session_path, method: :delete if authenticated? %>
    </nav>

    <main>
      <%= yield %>
    </main>
  </body>
</html>
```

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-10-28-ROR_authentication_추가/1.png?raw=true)<br>

body 를 수정 후 실행하면 위 이미지와 같은 결과가 나올 것이다.<br>
모든 페이지에서 nav 가 동일하게 있는 것을 확인 할 수 있고, view 가 yield 라고 작성된 부분에 삽입되는것을 확인할 수 있다.<br>
yield 는 ruby 문법이다.<br>

![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-10-28-ROR_authentication_추가/2.png?raw=true)<br>
button_to 헬퍼를 보면 method 가 delete 인데, html 에서 보면 post 인것을 확인할 수 있다.<br>
대신 내부에 input 태그를 숨기고 거기에 name= _method, value= delete 라고 보내게되어있다.<br>
rails 는 해당 post 요청을 delete 요청으로 변환한다. 이후 라우팅 정보를 따라 sessions#destroy 로 보내지게된다.<br>
해당 라우팅 정보는 ```bin/rails generate authentication``` 과정에서 추가되었으므로 ```bin/rails routes``` 로 확인할 수 있다.<br>

제일 뒤에 오는 ```if authenticated?``` 는 ruby 의 inline if 문법이다.<br>

## Allow Unauthenticated Access
인증되지 않은 사용자의 접근 허용하기<br>
```bin/rails generate authentication``` 를 수행한 이후부터 로그인 페이지를 제외한 모든 페이지에 접근할 수 없었다.<br>
일부 페이지에서 이를 해제하는 방법을 알아보자.<br>

```ruby
class ProductsController < ApplicationController
  allow_unauthenticated_access only: %i[ index show ]
  이하 생략
end
```

로그인 하지 않아도 제품 목록과 상세페이지에 접속할 수 있도록 index 액션과 show 액션을 허용하는 코드이다.<br>
로그아웃 후 해당 페이지에 요청을 보내면 정상적으로 접속할 수 있다.<br>
다만 관리자만 사용해야하는 제품 추가와 제품 삭제 버튼이 그대로 노출되어 있다.<br>
물론 클릭하면 로그인 페이지로 리다이렉트 되긴한다.<br>

## 인증된 사용자만 링크 표시하기
바로 위에서 말했던 문제를 해결하자.<br>
로그아웃 버튼을 생성할 때 ```if authenticated?``` 를 사용했었다.<br>
동일한 방법을 사용하여 링크를 숨겨보자.<br>

```erb
<%# app/view/products/index.html.erb %>

<h1>Products</h1>
<%# if authenticated? 를 추가하여 New Product 링크가 출력되지않게한다. %>
<%= link_to "New Product", new_product_path if authenticated? %>

<% @products.each do |product| %>
    <div>
        <%= link_to product.name, product %>
    </div>
<% end %>
```

```erb
<%# app/view/products/show.html.erb %>

<h1><%= @product.name %></h1>

<%= link_to "Back", products_path %>
<%# if authenticated? 를 사용하여 비로그인 사용자는 Edit 링크와 Delete 버튼이 표시되지 않게한다. %>
<% if authenticated? %>
    <%= link_to "Edit", edit_product_path(@product) %>
    <%= button_to "Delete", @product, method: :delete, data: { turbo_confirm: "Are you sure?" } %>
<% end %>
```

위 코드처럼 수정 후 실행해보자.<br>
마지막으로 레이아웃의 application.html.erb 에 ```<%= link_to "Login", new_session_path unless authenticated? %>``` 를 추가하여 로그인 링크를 추가하자. 비로그인 사용자만 볼 수 있도록 ```unless authenticated?``` 를 붙여줬다.<br>
unless 는 if not 이다.<br>

