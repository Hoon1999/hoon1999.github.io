---
title: "[java] 중첩 인터페이스"
date: 2024-08-26 08:57:00 +09:00
categories: [Language, Java 기초]
tags:
  [
    Java,
    중첩인터페이스
  ]
use_math: true
---

## 중첩 인터페이스
클래스 내부에 선언된 인터페이스를 의미한다.<br>
<br>
중첩 클래스와 동일하게 <br>

1. 인스턴스 중첩 인터페이스
2. static 중첩 인터페이스 

두 가지가 가능하다.

## 선언 방법

```java
class A {
  // 중첩 인터페이스의 선언
  interface 중첩인터페이스 {
    void 메서드();
  }

  // 또는 static 중첩 인터페이스의 선언
  static interface 정적중첩인터페이스 {
    void 메서드();
  }
}
```

중첩인터페이스의 선언 방법은 중첩클래스와 동일하므로 따로 외울 필요가 없다.<br>

## 왜 사용할까?
선언 방법을 보고 어떻게 사용하면 좋을지 생각해보자.<br>
첫번째로 인터페이스를 implement(구현) 해야할 것이다.<br>
<br>
클래스 내부에 인터페이스가 존재하니 동일한 클래스 안에 해당 인터페이스를 구현받아 사용하면 어떨까?<br>
아래에 코드로 작성해보았다.<br>

```java
class A {
  // 중첩 인터페이스의 선언
  interface 중첩인터페이스 {
    void 메서드();
  }

  class 중첩클래스 implements 중첩인터페이스 {
    @override
    void 메서드() {
      // 로직
    }
  }
}
```

이렇게 구현한다면 무슨 의미가 있는지 모르겠다. 물론 정말 어쩔수없이 필요한 경우도 있겠지만, 보통은 중첩인터페이스-(구현)-중첩클래스 로 코드를 작성하기보단 외부에 새로운 클래스를 만들 것이다.<br>
다른 사용 방법을 살펴보자.

## 사용 방법

```java
public class Button {
  void click() {
    // 로직 작성
    // 버튼마다 다른 로직이었으면 좋겠다.. 어떻게 하지?
  }
}
```

예시로 버튼 클래스를 만들고 내부에 버튼을 클릭하면 호출될 메소드를 작성했다.<br>
이 click 메서드를 내 마음대로 작성하고 갈아끼우고 싶으면 Button을 class 가 아닌 interface 로 만들고 익명함수로 만들어야할 것이다.<br>

> 무슨말이야? Button 을 상속받아 오버라이딩하면 되잖아

그런 의미가 아니다. 만약 그렇게 하면 새로운 클래스를 만들고 click 메서드 뿐만 아니라 Button의 필요한것들을 새로 작성해주어야 할 것이다.(위에 코드는 구현할 것이 click 밖에 없지만 일반적으로 그렇지 않다.)<br>
우리가 하고자 하는 것은 **click 메서드만 따로 만들어서 Button 클래스 속에 삽입** 하고 싶은 것이다.<br>

```java
public class Button {
  // static 중첩 인터페이스 선언
  static interface OnClickListener {
    void onClick();
  }

  // 멤버 변수
  private OnClickListener a;

  // setter
  void setOnClickListener(OnClickListener a) {
    this.a = a;
  }

  // 멤버 메서드
  void click() {
    a.OnClick();
  }
}
```

이제 click 메서드는 OnClickListener 의 onClick 메서드를 호출하게 되었다.<br>
만약 내가 노래하기 버튼을 만들고 click 메서드에 노래하기 로직을 넣고 싶을때, 버튼을 상속해서 만들필요가 없어진다.<br>
우리가 할 일은 Button 의 OnClcikListener 를 구현하여 Button에 넣어주면 된다.<br>

```java
import Button;

public class 노래하기Listener implements Button.OnClickListener {
  @Override
  public void onClick() {
    System.out.println("노래를 불렀다");
  }
}

public class 춤추기Listener implements Button.OnClickListener {
  @Override
  public void onClick() {
    System.out.println("춤을 추었다");
  }
}
```

```java
import Button;

public class Main {
  public static void main(String[] args) {
    Button btn = new Button();

    // btn 의 click 메서드에 로직을 삽입했다.
    btn.setOnClickListener(new 노래하기Listener());
    btn.click(); // 노래를 불렀다 출력.

    // btn 의 click 메서드에 다른 로직을 삽입했다.
    btn.setOnClickListener(new 춤추기Listener());
    btn.click(); // 춤을 추었다 출력.

    // 인터페이스를 즉석에서 구현해서 넣었다.
    // 익명 구현 객체
    btn.setOnClickListener(new Button.OnClickListener() {
      @Override
      public void onClick() {
        System.out.println("전원을 종료했다");
      }
    });
    btn.click(); // 전원을 종료했다 출력
  }
}
```

이렇게해서 클래스의 특정 메소드만 만들어서 수정하는 방법을 알아보았다.<br>

**References** <br>
한빛 미디어 - 혼자공부하는자바 개정판 (저자 신용권) 교재의 내용을 공부하며 작성하였습니다.<br>