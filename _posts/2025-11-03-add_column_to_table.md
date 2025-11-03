---
title: "[Ruby on Rails 8][Tutorial] 테이블에 column 추가"
date: 2025-11-03 14:20:00 +09:00
categories: [Framework, Ruby on Rails]
tags:
  [
    Ruby on Rails,
    Ruby,
    DB
  ]
use_math: true
published: true
---

> [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html)<br>
위 튜토리얼을 따라 학습하며 작성한 글입니다.

## 개요
제품은 재고 기능을 붙이고, 재고가 있으면 이메일로 안내문을 발송하는 기능을 만들 것이다.<br>
기능을 만들기 전에 우선 products 테이블에 재고 column 을 추가해보자.<br>

## column 추가

```
generate migration Add[컬럼명]To[테이블명]
```

```console
$ bin/rails generate migration AddInventoryCountToProducts inventory_count:integer
      invoke  active_record
      create    db/migrate/20251103111243_add_inventory_count_to_products.rb
```

rails 에선 db 를 migration 파일로 관리하기 때문에 해당 파일을 만들어준다.<br>
```Add[컬럼명]To[테이블명]``` 이름 규칙을 지키면 대략적인 코드를 작성해주고 세부적인 내용만 직접 작성하면 된다.<br>
생성된 ```add_inventory_count_to_products.rb``` 파일을 열어서 확인해보자.<br>

```ruby
class AddInventoryCountToProducts < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :inventory_count, :integer, default: 0
  end
end
```

```default: 0``` 빼곤 동일할 것이다. 컬럼에 null 값이 들어가지 않도록 기본값을 0으로 설정해주자.<br>

```console
$ bin/rails db:migrate
```

migration 파일이 적용되도록 ```bin/rails db:migrate``` 를 수행하자.<br>
만약 파일을 수정하지 않고 migration 을 했다면, ```bin/rails db:rollback``` 으로 롤백한 뒤 파일을 수정하고 다시 migration 을 하면된다.<br>
column 추가가 완료되었다.<br>

## form 수정
![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-11-03-add_column_to_table/1.png?raw=true)<br>

```erb
<%# app/view/products/_form.html.erb %>

<%= form_with model: product do |form| %>
    <%# 생략 %>
    <div>
        <%= form.label :inventory_count, style: "display: block" %>
        <%= form.number_field :inventory_count %>
    </div>

    <div>
        <%= form.submit %>
    </div>
<% end %>
```

사진처럼 form 에 숫자입력기를 추가하고 id 를 inventory_count 로 준다.<br>

## 예외 추가
```ruby
class ProductsController < ApplicationController
  # 생략
  private
    def product_params
      params.expect(product: [ :name, :description, :featured_image, :inventory_count ])
    end
end
```

form 에서 받아오는 ```:inventory_count``` 를 예외에 추가한다.<br>

## 유효성 검사 추가
```
class Product < ApplicationRecord
  has_one_attached :featured_image
  has_rich_text :description

  validates :name, presence: true
  validates :inventory_count, numericality: { greater_than_or_equal_to: 0}
end
```

재고 값이 음수가 되지 않도록 ```:inventory_count``` 에 greater than or equal to 0 을 추가한다.<br>