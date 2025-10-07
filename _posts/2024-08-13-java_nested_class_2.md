---
title: "[java] 중첩 클래스 접근 제한"
date: 2024-08-13 17:40:00 +09:00
categories: [Language, Java 기초]
tags:
  [
    Java,
    중첩클래스
  ]
use_math: true
---

## 중첩 클래스의 접근 제한 
중첩 클래스에서 바깥 클래스의 필드와 메소드에 모두 접근할 수 있는 것은 아니고 제한적으로 접근이 가능하다.<br>
바깥 클래스는 중첩 클래스를 감싸는 클래스를 말한다.<br>

### 바깥 클래스에서 중첩 클래스로의 접근 제한

```java
class A {
  B b = new B();
  C c = new C();

  static B sb = new B(); // 불가능. 클래스 A가 인스턴스화 되기 전까지는 B객체를 만들 수 없으니까.
  static C sc = new C();

  void A의메소드() {
    B b = new B();
    C c = new C();
  }
  static void A의정적메소드() {
    B b = new B(); // 불가능. 클래스 A가 인스턴스화 되기 전까지는 B객체를 만들 수 없으니까.
    C c = new C();
  }

  class B { }
  static class C { }
}
```

### 멤버 클래스의 접근 제한

```java
class A {
  int A의멤버변수;
  static int A의정적변수;

  void A의메소드();
  static void A의정적메소드();

  class B {
    void B의메소드() {
      A의멤버변수 = 10; 
      A의정적변수 = 20;

      A의메소드(); 
      A의정적메소드();
    }
  }
  
  static class C {
    void C의메소드() {
      A의멤버변수 = 10; // 불가능
      A의정적변수 = 20;

      A의메소드(); // 불가능
      A의정적메소드();
    }
  }
}
```

인스턴스 멤버 클래스에서는 바깥 클래스의 필드와 메소드에 제한없이 접근할 수 있다.<br>
static 멤버 클래스인 경우 바깥 클래스의 static 필드와 static 메소드에만 접근할 수 있다.<br>
### 로컬 클래스의 접근 제한

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-08-13_java_nested_class/1.png?raw=true)<br>
로컬 클래스는 final 로 선언된 지역변수에만 접근이 가능하다.<br>
![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-08-13_java_nested_class/2.png?raw=true)<br>
만약 final이 없다면 암묵적으로 final로 선언해준다.<br>
![사진3](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-08-13_java_nested_class/3.png?raw=true)<br>
하지만 변수의 값을 재할당하면 final이 아니게되기 때문에 에러가 발생한다.

## 중첩 클래스에서 바깥 클래스를 this로 접근 하는 방법

```java
class A {
  int field;
  void method();

  class B {
    int field;
    void method();

    void example() {
      this.field = 10; // B의 변수에 할당
      A.this.field = 20;

      this.method(); // B의 메소드 호출
      A.this.method();
    }
  }
}
```
바깥 클래스와 중첩 클래스의 필드, 메소드명이 같을 때 접근하는 방법이다.<br>
<hr>
** Reference **<br>
한빛 미디어 - 혼자공부하는자바 교재의 내용을 공부하며 작성하였습니다.<br>