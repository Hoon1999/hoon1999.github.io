---
title: "[Ruby on Rails 8][Tutorial] action mailer 와 email 알림"
date: 2025-11-26 23:20:00 +09:00
categories: [Framework, Ruby on Rails]
tags:
  [
    Ruby on Rails,
    Ruby,
    mailer,
    concern,
    generate_token_for
  ]
use_math: true
published: true
---

> [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html)<br>
위 튜토리얼을 따라 학습하며 작성한 글입니다.

## mailer 생성
이제 구독자들에게 메일을 보내는 방법을 알아본다.<br>

```console
$ bin/rails g mailer Product in_stock
      create  app/mailers/product_mailer.rb
      invoke  erb
      create    app/views/product_mailer
      create    app/views/product_mailer/in_stock.text.erb
      create    app/views/product_mailer/in_stock.html.erb
      invoke  test_unit
      create    test/mailers/product_mailer_test.rb
      create    test/mailers/previews/product_mailer_preview.rb
```

우선 ```bin/rails generate mailer Product in_stock``` 을 입력한다.<br>
generate 대신 g 라고만 입력해도 된다.<br>
Product 와 관련된 Mailer 이므로 이름은 Product 로 주었다. 그럼 product_mailer 라는 이름으로 생성된다.<br>
마지막 인자로 in_stock 을 주었다.<br>
in_stock 메서드를 만들어준다.<br>
출력 결과를 보면 다음과 같은 파일이 생성되었다.<br>
1. app/mailers/product_mailer.rb
2. app/views/product_mailer/in_stock.text.erb
3. app/views/product_mailer/in_stock.html.erb
4. test 파일

## mailer 수정
app/mailers/product_mailer.rb 부터 확인해보자.<br>
```ruby
class ProductMailer < ApplicationMailer
  def in_stock
    @greeting = "Hi"
    mail to: "to@example.org"
  end
end
```

@greeting 변수에 Hi 라는 값을 넣고, to@example.org 에게 메일을 보내는 동작을 하고 있는걸 확인할 수 있다.<br>
보내는 메일 내용은 in_stock.text.erb, in_stock.html.erb 이다.<br>

일단 변수값이랑 메일 수신인을 바꿔보자.<br>

```ruby
class ProductMailer < ApplicationMailer
  def in_stock
    @product = params[:product]
    mail to: params[:subscriber].email
  end
end
```

변수에 보관하는 값을 product 로 바꾸고, mail 을 받는 사람을 구독자로 바꿨다.<br>
사실 이것만 보면 이해가 안될수가 있다. 이미지를 보면 다음과 같다.<br>
![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-11-26-ROR_action_mailer_and_email_notification/1.png?raw=true)<br>
```ProductMailer.with(매개변수).in_stock.deliver_later```를 실행하면 with 에 있는 매개변수는 ProductMailer 의 in_stock 메서드로 전달된다.<br>

사진을 다시 보니 너무 지저분하다 차근차근 설명하겠다.<br>
우선 우측 상단의 ```in_stock.text.erb``` 템플릿을 보자. ```@product``` 를 사용하는 것을 볼 수 있다.<br>
이건 ```in_stock``` 메서드로부터 전달 받은 값이다. 템플릿에 변수를 사용하고 싶다면 메서드로부터 전달받아야한다.<br>
```@product``` 변수는 ```params[:product]``` 로 부터 할당되었다. 해당 파라미터는 HTTP 요청으로 받을수도 있고 다른 여러 방법으로 받을 수 있지만 여기선 ```ProductMailer.with(매개변수)``` 를 통해 전달받을 것이다.<br>
원래 다른 코드에서 ```ProductMailer.with(매개변수).메서드명.deliver_later``` 을 호출하면 되지만 그 전에 콘솔에서 먼저 테스트를 해보자.<br>

```Product.first``` 로 객체를 하나 가져오자. Pants 가 가져와졌다.<br>
메일을 받을 구독자도 가져와보자. foo@bar.org 라는 이메일을 가진 구독자가 가져와졌다. 비록 filter 되어 보이진 않지만 내가 등록한 이메일이니 알고있다.<br>

가져온 두 객체를 매개변수로 전달하자. ```ProductMailer.with(매개변수).메서드명.deliver_later``` 를 하면 매개변수가 메서드로 params 형식으로 전달된다. ```.deliver_later``` 는 메일을 발송하는 역할이다.<br>


## email template 수정
발송될 메일의 내용을 수정해보자.<br>
```in_stock.html.erb``` , ```in_stock.text.erb``` 파일을 각각 다음과 같이 수정한다.<br>

```erb
<%# app/view/product_mailer/in_stock.html.erb %>
<h1>Good News!</h1>

<p>
  <%= link_to @product.name, product_url(@product) %> 의 재고가 생겼습니다.
</p>
```

외부 mail 앱에서 사이트로 연결될 링크이므로 product_path 가 아니라 product_url 을 사용해야한다.<br>

```erb
<%# app/view/product_mailer/in_stock.text.erb %>
Good News!

<%= @product.name %> 의 재고가 생겼습니다.
<%= product_url(@product) %>
```
html 이 아니므로 anchor 태그를 사용할 수 없다. 그래서 link_to 헬퍼를 안쓰고 주소가 바로 출력되게 한 것이다.<br>

## 중간 테스트

```console
$ bin/rails console
> product = Product.first
> subscriber = product.subscribers.find_or_create_by(email: "foo@bar.org")
> ProductMailer.with(product: product, subscriber: subscriber).in_stock.deliver_later
```

아래는 출력 결과이다.
```
ProductMailer#in_stock: processed outbound mail in 33.7ms
Delivered mail 690d115d226bb_1d5216b28700f1@kjhoon44-MacBook-Air.local.mail (24.5ms)
Date: Fri, 07 Nov 2025 06:21:33 +0900
From: from@example.com
To: foo@bar.org
Message-ID: <690d115d226bb_1d5216b28700f1@kjhoon44-MacBook-Air.local.mail>
Subject: In stock
Mime-Version: 1.0
Content-Type: multipart/alternative;
 boundary="--==_mimepart_690d115d21597_1d5216b28699c5";
 charset=UTF-8
Content-Transfer-Encoding: 7bit
```

```
----==_mimepart_690d115d21597_1d5216b28699c5
Content-Type: text/plain;
 charset=UTF-8
Content-Transfer-Encoding: base64

R29vZCBOZXdzIQ0KDQpQYW50cyDsnZgg7J6s6rOg6rCAIOyDneqyvOyKteuL
iOuLpC4NCmh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wcm9kdWN0cy8yDQo=
```

in_stock.text.erb 부분이다.

```
----==_mimepart_690d115d21597_1d5216b28699c5
Content-Type: text/html;
 charset=UTF-8
Content-Transfer-Encoding: quoted-printable

<!-- BEGIN app/views/layouts/mailer.html.erb --><!DOCTYPE html>
<html>
  <head>
    <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3Dutf=
-8">
    <style>
      /* Email styles need to be inline */
    </style>
  </head>

  <body>
    <!-- BEGIN app/views/product_mailer/in_stock.html.erb --><h1>Good New=
s!</h1>

<p>
  <a href=3D"http://localhost:3000/products/2">Pants</a> =EC=9D=98 =EC=9E=
=AC=EA=B3=A0=EA=B0=80 =EC=83=9D=EA=B2=BC=EC=8A=B5=EB=8B=88=EB=8B=A4.
</p>
<!-- END app/views/product_mailer/in_stock.html.erb -->
  </body>
</html>
<!-- END app/views/layouts/mailer.html.erb -->=

----==_mimepart_690d115d21597_1d5216b28699c5--

Performed ActionMailer::MailDeliveryJob (Job ID: e36848ae-0fe2-48b8-883a-b8c348299c4e) from Async(default) in 67.4ms
```

in_stock.html.erb 부분이다.<br>
email 은 내가 보낸 메일을 열 수 없는 환경임을 고려하여 다양한 포멧을 보낸다.<br>
출력결과를 보면 알 수 있듯이 text 버전과 html 버전을 따로 보내는건 아니고, 하나의 mail 에 합쳐서 보낸다.<br>
text 버전을 읽을지 html 버전을 읽을지는 받는 쪽에서 판단한다.<br>

## 트리거 설정
메일이 잘 전송되는 것 까지 확인했다.<br>
이제 메일이 발송되는 트리거를 추가해보자.<br>

```ruby
class Product < ApplicationRecord
  # 생략
  after_update_commit :notify_subscribers, if: :back_in_stock?

  def back_in_stock?
    재고가 0 이었다가 양수가 되었다면 true 를 반환한다.
  end

  def notify_subscribers
    구독자들에게 알림 메일을 발송한다.
  end
end
```

after_update_commit 은 model 에 update 가 수행되면 호출할 메서드를 등록할 수 있게한다.<br>
즉 update 가 수행되면 notify_subscribers 메서드가 호출된다.<br>
재고가 0 이었다가 양수가 되었다면 이라는 조건이 있었으므로 조건을 걸어주면된다.<br>

코드를 구현하면 다음과 같다.<br>

```
  after_update_commit :notify_subscribers, if: :back_in_stock?

  def back_in_stock?
    inventory_count_previously_was.zero? && inventory_count.positive?
  end

  def notify_subscribers
    subscribers.each do |subscriber|
      ProductMailer.with(product: self, subscriber: subscriber).in_stock.deliver_later
    end
  end
```

## 관심사 추출
Product model 은 DB 요소뿐만아니라 Notification 요소도 가지게되었다.<br>
관심사의 분리 원칙에 따라 Notification 요소만 따로 추출해주자.<br>

우선 ```app/models/product``` 경로에 ```notifications```  모듈을 하나 만들어준다.<br>

```ruby
# app/models/product/notifications.rb
module Product::Notifications
    extend ActiveSupport::Concern
    
end
```

그 다음 Product model 에서 Notification 관련 코드들을 가져오자.<br>

![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-11-26-ROR_action_mailer_and_email_notification/2.png?raw=true)<br>

```ruby
# app/models/product/notifications.rb
module Product::Notifications
    extend ActiveSupport::Concern

    included do
        has_many :subscribers, dependent: :destroy
        after_update_commit :notify_subscribers, if: :back_in_stock?
    end

    
    def back_in_stock?
        inventory_count_previously_was.zero? && inventory_count.positive?
    end
  
    def notify_subscribers
      subscribers.each do |subscriber|
        ProductMailer.with(product: self, subscriber: subscriber).in_stock.deliver_later
      end
    end
end
```

```ruby
# notifications.rb 로 옮긴 코드를 지운후 깔끔해진 Product 의 모습
class Product < ApplicationRecord
  include Notifications

  has_one_attached :featured_image
  has_rich_text :description

  validates :name, presence: true
  validates :inventory_count, numericality: { greater_than_or_equal_to: 0}
end
```

코드를 옮겼으면 Product model 에서 기존 코드를 삭제하고 ```include Notifications``` 를 추가해주면 된다.<br>

## 구독 취소 링크 생성

|id|product_id|email|
|---|---|---|
|1|157|foo@bar.org|
|2|163|aha@korea.com|
|3|113|foo@bar.org|

157번 상품을 foo@bar.org가 구독 중이라면, 구독 해제는 해당 레코드를 삭제하면 된다.<br>
하지만 ID(예: 1)를 링크에 그대로 넣어 보내면 보안상 위험하므로, 다른 방식이 필요하다.<br>

여기서 rails 는 ```generate_token_for``` 이라는 기능을 제공한다.<br>
특정 레코드를 조회할 수 있게하는 토큰을 만드는 기능이다.<br>

해당 기능을 사용하려면 Subscribe 모델에 다음과 같이 작성해주자.<br>
```
class Subscriber < ApplicationRecord
  belongs_to :product
  generates_token_for :unsubscribe
end
```

이제 ```generate_token_for``` 을 사용할 준비가 되었다.<br>

```
> a = Subscriber.find(1)
> a.generate_token_for(:unsubscribe)
```

```bin/rails console``` 콘솔로 접속해 위 명령어를 입력해보자.<br>
a 레코드에 접근할 수 있는 token 이 생성되는걸 확인할 수 있다.<br>

구독자 알림 메일에 이 token 을 링크와 함께 첨부하면 구독취소링크가 된다.<br>

## 구독 취소 로직 작성
시나리오를 상상해보자.<br>
1. 재고가 채워진다. 
2. 구독 알림 메일이 발송된다.
3. 구독자가 구독 취소 링크를 누른다.
4. 구독 취소 로직을 탄다.
5. 구독이 취소된다.

1번 로직은 이미 만들어져 있으니, 2번 로직을 만들어보자.<br>
```erb
<%# app/view/product_mailer/in_stock.html.erb %>
<h1>Good News!</h1>

<p>
  <%= link_to @product.name, product_url(@product) %> 의 재고가 생겼습니다.
</p>

<%= link_to "구독취소하기", unsubscribe_url(token: params[:subscriber].generate_token_for(:unsubscribe)) %>
```

url 은 https://주소/unsubscribe?token=생성값 이 된다.<br>
그럼 params[:subscriber] 은 subscriber 객체라는건데 어떻게 받은 것일까?<br>
```
ProductMailer.with(product: product, subscriber: subscriber).in_stock.deliver_later
```
바로 ```ProductMailer.with``` 을 통해 전달받은인자이며, 아직 in_stock 내부이므로 유효한 인자이다.<br>
아무튼 해당되는 record 정보가 있는 객체로 token 을 만들고 링크에 삽입했다.<br>

3번 로직을 보자.<br>
사용자가 링크를 클릭하면 어떻게 될까? routes 가 설정되어있지않아 거부당한다.<br>
위 url 을 클릭하면 서버에서 받을 수 있게 routes.rb 에 다음 한 줄을 추가해주자.<br>
```
resource :unsubscribe, only: [:show]
```

unsubscirbe#show 로 접근할 수 있게 되었다.<br>

4번 로직을 만들어보자.<br>
unsubscribe#show 로 올 수 있어도 아직 unsubscribe controller 를 만들지 않았다.<br>
만들자.<br>
```
# app/controllers/unsubscribes_controller.rb
class UnsubscribesController < ApplicationController
    allow_unauthenticated_access
    
    def show
        @subscriber = Subscriber.find_by_token_for(:unsubscribe, params[:token])
        @subscriber&.destroy
        redirect_to root_path, notice: "Unsubscribed successfully."
    end
end
```

```
$ bin/rails console
> product_a = Product.last
> subscriber_a = product_a.subscribers.find_or_create_by(email: "foo@bar.org")
> ProductMailer.with(product: product_a, subscriber: subscriber_a).in_stock.deliver_later
```

위 명령어를 입력하여 콘솔창에서 메일을 확인해보자.<br>
잘 작동하는 모습을 확인할 수 있다.