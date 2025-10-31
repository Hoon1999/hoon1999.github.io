---
title: "[Ruby on Rails 8][Tutorial] rich text area"
date: 2025-10-31 22:30:00 +09:00
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

## 전후 비교
![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-10-31-ROR_rich_text_area/1.png?raw=true)<br>
제품 상세 페이지에 제품 설명, 제품 이미지 등을 표시하는 영역을 추가할 것이다.<br>
![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-10-31-ROR_rich_text_area/2.png?raw=true)<br>
제품 추가 form 에 rich_text_area 를 추가한다.<br>
![사진3](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-10-31-ROR_rich_text_area/3.png?raw=true)<br>

## 개요
요즘 시대의 웹 애플리케이션은 텍스트 뿐만 아니라 이미지, 동영상 등 다양한 멀티미디어를 보여줘야한다.<br>
rails 는 이를 편리하게 만들 수 있도록 rich text area 를 제공한다.<br>
rich text area 는 action text 를 통해 지원한다.<br>

## action text 설치

```console
$ bin/rails action_text:install
$ bundle install
$ bin/rails db:migrate
== 20251031112406 CreateActiveStorageTables: migrating ========================
-- create_table(:active_storage_blobs, {id: :primary_key})
   -> 0.0024s
-- create_table(:active_storage_attachments, {id: :primary_key})
   -> 0.0020s
-- create_table(:active_storage_variant_records, {id: :primary_key})
   -> 0.0018s
== 20251031112406 CreateActiveStorageTables: migrated (0.0064s) ===============

== 20251031112407 CreateActionTextTables: migrating ===========================
-- create_table(:action_text_rich_texts, {id: :primary_key})
   -> 0.0023s
== 20251031112407 CreateActionTextTables: migrated (0.0023s) ==================
```

## model 에 rich text area 가 있다고 작성하기
rich text area 를 사용하려면, model 에 rich text area 를 사용할거라고 알려줘야한다.<br>

```ruby
class Product < ApplicationRecord
  has_rich_text :description
  validates :name, presence: true
end
```

제품 상세 페이지를 보면, @product 인스턴스에서 제품명을 꺼내 작성했던것을 볼 수 있다.<br>
마찬가지로 제품 설명도 @product 인스턴스에 보관할 것이므로 Product model 에 has_rich_text 를 추가하여 rich_text 를 사용할 수 있게한다.<br>
제품 설명을 작성할 공간이므로 description 이라고 명명했다.<br>

## form 에 rich text area 추가하기

![사진4](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-10-31-ROR_rich_text_area/4.png?raw=true)<br>

```erb
<%# app/view/products/_form.html.erb %>

<%= form_with model: product do |form| %>
    생략
    <div>
        <%= form.label :description, style: "display: block" %>
        <%= form.rich_textarea :description %>
    </div>
    생략
<% end %>
```

```form.rich_textarea``` 를 추가해준다. 제품 설명란이므로 id 는 description 으로 해준다.<br>

## 파라미터 expect 변경

```ruby
# product_controller.rb 
    def product_params
      params.expect(product: [ :name, :description ])
    end
```

form 에서 입력되는 값 중 :name 을 제외한 나머지는 입력받지 않도록 필터링을 걸어놨었다.<br>
지금은 :description 도 입력으로 받아야 하므로 추가해주었다.<br>

## 제품 상세 페이지에 제품 설명란 추가
rich text area 를 통해 @product 에 저장된 제품 설명을 화면에 출력할 차례다.<br>

```erb
<%# app/view/products/show.html.erb %>

<% cache @product do %>
    <h1><%= @product.name %></h1>
    <%= @product.description %>
<% end %>
이하 생략
```

```<%= @product.description %>``` 코드를 추가한다.<br>

## 테스트
![사진5](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-10-31-ROR_rich_text_area/5.png?raw=true)<br>
![사진6](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-10-31-ROR_rich_text_area/6.png?raw=true)<br>
new product 버튼을 클릭해 제품을 추가해보자.<br>
제품 설명이 잘 출력되는 것을 확인할 수 있다.<br>