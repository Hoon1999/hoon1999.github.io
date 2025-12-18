---
title: "[Ruby on Rails 8][Tutorial] Testing"
date: 2025-12-18 23:30:00 +09:00
categories: [Framework, Ruby on Rails]
tags:
  [
    Ruby on Rails,
    Ruby,
    test
  ]
use_math: true
published: true
---

> [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html)<br>
위 튜토리얼을 따라 학습하며 작성한 글입니다.

## 개요
테스트 코드를 작성하는 방법을 공부한다.<br>
로직이 내 의도대로 동작하는지 테스트를 위한 코드이며, 다음과 같은 로직으로 작성하면 된다.<br>

1. ㅇㅇ 을 호출한다.
2. ㅇㅇ 을 호출했을 때 발생하는 로직을 관찰한다.
3. 관찰 결과가 기대하는 동작과 일치하면 테스트 통과

## Test Data(Fixture)

```
$ bin/rails test
```

테스트 코드를 작성하고 위 명령어를 입력하면 테스트가 수행된다.<br>
테스트를 수행하는 DB 는 개발환경 DB 랑 분리되어 있다.<br>
그래서 테스트 데이터를 작성해야한다.<br>

테스트 데이터를 채우려면 test/fixture 경로에서 파일을 작성해야한다.<br>
product 테이블을 채우려면 ```test/fixtures/products.yml``` 파일에 다음과 같이 작성해준다.<br>

```yml
# test/fixtures/products.yml
tshirt:
  name: T-Shirt
  inventory_count: 15
```

그럼 product 테이블에 다음과 같이 데이터가 삽입이 된다.<br>

| id | name | inventory_count |
|---|---|---|
|12|T-Shirt|15|

subscriber 테이블도 채워보자.<br>

```yml
# test/fixtures/subscribers.yml
foobar:
  product: tshirt
  email: foo@bar.org

hong:
  product: tshirt
  email: hong@gil.dong
```

| id | product_id | email |
|---|---|---|
|83|12|foo@bar.org|
|143|12|hong@gil.dong|

응? 두번째 열은 product_id 를 작성해야하는데, product 의 label 이름을 작성했다.<br>
테스트 데이터에서 다른 테이블의 id 를 직접 넣기는 어렵기 때문이다. 왜냐하면 thirt, foobar, hong 등 label 을 가지고 id 를 만들게 되는데, 이 값을 예측할 수가 없다.<br>
뭐 다 방법이야 있겠지만 굳이 그런 수고를 할 필요가 없다. 그냥 참조하는 레코드의 label 이름을 적어주면 된다.<br>
그럼 자동으로 해당 label 에 해당되는 id 가 들어간다.<br>

## Test Code
이메일 테스트에 필요한 데이터는 다 넣었다.<br>
테스트 코드를 작성해보자.<br>

```ruby
# test/models/product_test.rb
require "test_helper"

class ProductTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

```

```generate model``` 을 이용해 product 를 만들었다면 ```test/models/product_test.rb``` 파일이 만들어져 있을 것이다.<br>
파일을 열어보면 위와같이 기본적인 형태가 있다.<br>
이메일 알림 테스트 코드를 작성해보자.<br>

```ruby
# test/models/product_test.rb
require "test_helper"

class ProductTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper # 설명 1

  test "재고가 채워졌을 때 이메일 알림 발송" do # test 블럭
    product = products(:tshirt) # 설명 2

    product.update(inventory_count: 0) # 설명 3

    product.update(inventory_count: 1) # 이메일 발송
  end
end
```

1. ActionMailer 를 테스트 할 때 필요한 헬퍼다. 이메일 전송이 잘 됐는지 모니터링할 때 필요하다.
2. products(:tshirt) 는 Fixture 헬퍼다. DB에 저장된 fixture 데이터를 label 로 손쉽게 꺼낼 수 있게 해준다. 대신 test block 안에서만 가능
3. inventory count 가 0 에서 양수가 되는 순간 메일이 발송되므로 0으로 update 해주었다.

여기까지 하면 이메일이 발송된다.<br>
하지만 이대로 실행하면 테스트가 성공했는지 알 수 없다.<br>
테스트가 성공했다는걸 알기위해서 assertion 을 해야한다.<br>

```ruby
# test/models/product_test.rb
require "test_helper"

class ProductTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

  test "재고가 채워졌을 때 이메일 알림 발송" do
    product = products(:tshirt)

    product.update(inventory_count: 0)

    # 이메일 발송 후 비교
    assert_emails 2 do
      product.update(inventory_count: 1)
    end
  end
end
```

assert_emails 블록을 추가하고 그 안에 이메일 발송 로직을 넣었다.<br>
email 개수가 2 인지 assert 한다.<br>

이제 진짜 test code 를 실행해보자.<br>

```
$ bin/rails test
또는
$ bin/rails test 파일명
예를 들어 bin/rails test test/models/products_test.rb
```

만약 ```bin/rails test``` 를 수행했는데, ```Running 2 tests in a ...``` 라는 문구가 나오며 실패한다면 이런 의미다.<br>
2 개의 test 가 수행중 에러가 났습니다. 에러의 원인은 ... 입니다.<br>
우리는 1 개의 test 를 만들었고 그것만 잘 되는지 확인하면 되므로 ```bin/rails test 파일명``` 을 이용해 실행하자.<br>

이전 포스팅에서 ```bin/rails generate mailer ...``` 를 사용해 product_mailer 를 만들었다.<br>
해당 명령어로 인해 자동으로 product_mailer_test 파일이 만들어졌는데 이것도 완성시켜보자.<br>

```ruby
# test/mailers/product_mailer_test.rb
require "test_helper"

class ProductMailerTest < ActionMailer::TestCase
  test "in_stock" do
    mail = ProductMailer.in_stock                   # 설명 1
    assert_equal "In stock", mail.subject           # 설명 2
    assert_equal [ "to@example.org" ], mail.to      # 설명 3
    assert_equal [ "from@example.com" ], mail.from  # 설명 4
    assert_match "Hi", mail.body.encoded            # 설명 5
  end
end

```

열어보면 이렇게 되어 있다.<br>
기본 템플릿의 의미는 다음과 같다.<br>
1. ProductMailer.in_stock 을 호출하고 리턴값을 mail 변수에 저장할거다.
2. assert_equal 은 두 값이 동일하면 테스트를 통과한다는 의미로 "In stock" 과 mail.subject 가 같은지 비교한다.
3. "to@example.org" 과 mail.to 가 같은 값인지 비교
4. "from@example.com" 과 mail.from 이 같은 값인지 비교
5. "Hi" 라는 문자열이 mail.body.encoded 안에 포함되어있는지 확인

![사진1](https://placehold.co/600x400)<br>

메일을 보내면 어떤 값이 들어있어야 되는지 모를 수 있다. 그럴땐 위 이미지처럼 직접 확인해보면 된다.<br>

```ruby
# test/mailers/product_mailer_test.rb
require "test_helper"

class ProductMailerTest < ActionMailer::TestCase
  test "in_stock" do
    mail = ProductMailer.with(product: products(:tshirt), subscriber: subscribers(foobar)).in_stock
    assert_equal "In stock", mail.subject # mail.subject == "In stock" 입니까?
    assert_equal [ "foo@bar.org" ], mail.to # mail.to == "foo@bar.org" 입니까?
    assert_equal [ "from@example.com" ], mail.from
    assert_match "Good News!", mail.body.encoded # mail.body 에 "Good News!" 가 포함되어 있습니까?
  end
end
```

이렇게 바꿔주었다.<br>

우선 test DB 에 있는 product 와 subscriber 를 하나 선정해서 메일을 발송했다(in_stock 메서드를 호출했다)<br>

그럼 다음과 같은 내용이 갈 것이다.<br>
mail.from : from@example.com<br>
mail.to : foo@bar.org<br>
Good News!<br>
T-Shirt 의 재고가 생겼습...(이하생략)<br>

정상적으로 위 내용이 mail 변수에 담기면 테스트가 통과될 것이고 다른 내용이 mail 변수에 담기면 테스트가 실패할 것이다.<br>
test 가 실패했다는건 다음을 의미한다.<br>
1. test 로직을 잘못 작성했다.
2. 메일 발송 내용을 잘못 작성했다.

## Test Code 를 작성하는 위치

위에서 메일 발송 로직을 테스트하는 코드는 ProductTest 에서 작성하고, mail 내용이 올바른지 확인하는 테스트 코드는 ProductMailerTest 에서 작성했다.<br>

**기준이 뭘까?**<br>
바로 원본 코드가 작성된 위치이다.<br>
메일 발송 로직(트리거)는 Product 에 작성되어 있고 메일 발송 메서드는 ProductMailer 에 작성되어 있기 때문이다.<br>

메일 발송 로직(트리거) 즉, notify_subscribers 메서드는 Product 에 있으므로 Test 도 ProductTest 에서 해야한다.<br>

메일 발송 메서드(in_stock) 은 ProductMailer 에 있으므로 ProductMailerTest 에서 해야한다.<br>


## Test Data(Fixture) 를 사용하는 이유
귀찮게 Fixture 를 만들지 않고 개발DB 에 있는 데이터를 사용해도 될 것이다.<br>
근데 왜 굳이 Fixture 를 만들까?<br>

우선 두 가지 이유가 있다.<br>
1. 배포환경(CI/CD) 엔 개발DB 가 연결되어있지 않다.
2. 테스트 커버리지만 테스트할 수 있다.
개발DB 에 있는 데이터가 모든 테스트 커버리지를 검사하지 않을수도 있다는걸 생각해보자.<br>
개발DB 를 실제 운영환경과 동일하게 fork 떠와서 몇천만 데이터가 저장되어 있어도 몇몇 특이 케이스가 없다면 테스트가 제대로 되지 않을것이다. 그러다 우연찮게 특이케이스가 운영환경에 생겨서 버그를 발생시킨다면? 난감해진다.<br>
차라리 그러지 말고 테스트 할 때는 반드시 필요한 소수의 데이터만 테스트DB 에 넣으면 배포환경에서 빠르게 테스트를 수행할 수 있고, 정확도도 높은 결과를 얻을 수 있다.