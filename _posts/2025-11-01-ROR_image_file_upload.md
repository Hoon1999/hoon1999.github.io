---
title: "[Ruby on Rails 8][Tutorial] 이미지 파일 업로드"
date: 2025-11-01 01:20:00 +09:00
categories: [Framework, Ruby on Rails]
tags:
  [
    Ruby on Rails,
    Ruby,
    active storage
  ]
use_math: true
published: true
---

> [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html)<br>
위 튜토리얼을 따라 학습하며 작성한 글입니다.

## 개요
앞서 rich text area 를 공부하면서 action text 를 설치했다.<br>
action text 는 active storage 를 기반으로 구축되어있다.<br>
즉 active storage 를 사용할 수 있다.<br>

active storage 를 이용하면 image 등 file 을 쉽게 업로드할 수 있다.<br>
제품 상세 페이지에 대표 이미지를 삽입해본다.<br>

## model 에 첨부파일이 있다고 작성하기

```ruby
class Product < ApplicationRecord
  has_one_attached :featured_image
  has_rich_text :description
  validates :name, presence: true
end
```

form 에 첨부파일을 추가하기 전에, Product model 에 첨부파일을 사용할거라고 작성한다.<br>
has_one_attached 라고 작성하고 이름을 featured_image (대표 이미지) 라고 명명했다.<br>

## 파라미터 expect 에 추가
지금은 :name 과 :description 을 제외하고 나머지를 필터링 하고있다.<br>
form 을 통해 서버로 image 를 보내도 받을 수 없다.<br>

```ruby
# products_controllers.rb
    def product_params
      params.expect(product: [ :name, :description, :featured_image ])
    end
```

expect 에 :featured_image 를 추가해줬다.<br>

## 저장된 이미지 출력
대표 이미지를 제품 상세 페이지의 상단에 출력되도록 하자.<br>

```erb
<%# app/view/products/show.html.erb %>

<%= image_tag @product.featured_image if @product.featured_image.attached? %>

<% cache @product do %>
    <h1><%= @product.name %></h1>
    <%= @product.description %>
<% end %>

<%= link_to "Back", products_path %>
<% if authenticated? %>
    <%= link_to "Edit", edit_product_path(@product) %>
    <%= button_to "Delete", @product, method: :delete, data: { turbo_confirm: "Are you sure?" } %>
<% end %>
```

image_tag 헬퍼를 사용해 이미지를 출력하는 코드를 추가했다.<br>

## 테스트

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-11-01-ROR_image_file_upload/1.png?raw=true)<br>
제품에 파일을 추가 후 확인해보니 잘 나온다.<br>
아직은 CSS 를 적용하는 법을 안배웠다. 이미지가 너무 크게나오면 해상도가 작은 이미지를 사용해보자.<br>