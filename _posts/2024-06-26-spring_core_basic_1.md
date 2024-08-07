---
title: 스프링을 사용하는 이유
date: 2024-06-26 14:46:00 +09:00
categories: [개발, Spring 1_핵심원리 Basic]
tags:
  [
    Spring,
    basic,
    inflearn
  ]
---

> 이 게시글은 인프런의 유료 강의 [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8)을 수강하며 공부한 내용을 담고있습니다.

## 스프링을 왜 사용할까
스프링은 자바 기반의 언어이다. 자바는 객체지향 언어이고 객체지향의 특징을 살려낸 프레임워크가 스프링이다.<br>
과거의 자바 프레임워크인 EJB 는 객체지향의 특징을 살리지 못했다.<br>
<br>

## 좋은 객체지향 프로그래밍이란
객체 지향의 특징인 추상화, 캡슐화, 상속, 다형성을 지닌 프로그래밍을 객체 지향 프로그래밍이라고 한다.<br>
객체 지향 프로그래밍을 하면 프로그램을 유연하고 변경에 용이하게 만들 수 있다.<br>
<br>
유연하고 변경에 용이하려면, 다시말해 교체가 용이하려면 역할과 구현을 분리하여야 한다.<br>
역할과 구현의 의미는 다음과 같다.<br>
역할은 클라이언트가 어떤 행위를 할 수 있게끔 하는 것이고 구현은 역할을 구현한 방법이다.<br>
역할과 구분을 잘 설명할 수 있는 예시는 다음과 같다.<br>
역할 - 자동차<br>
구현 - 아반떼, 쏘나타, 테슬라 등<br>
자동차의 역할은 사용자가 운전을 하여 이동을 할 수 있게 한다.<br>
사용자가 아반떼를 타다가 테슬라를 운전해도 자동차의 역할을 수행할 수 있다.<br>
아반테와 쏘나타 그리고 테슬라는 자동차를 구현한 방법이 모두 다르다. 하지만 사용자는 그런거 하나도 몰라도 된다.<br>
만약 역할과 구현이 분리가 되어있지 않다면, 다시말해 자동차의 역할이 정해져 있지 않다면 아반떼를 타던 사람은 쏘나타나 테슬라 등 다른 자동차를 탈 때 마다 새로 조작법을 배워야 할 것이다.<br>
<br>
**정리**<br>
클라이언트는 역할(인터페이스)만 알면된다.<br>
클라이언트는 구현을 몰라도 된다.<br>
클라이언트는 구현 방법이 변경되거나 구현 대상 자체가 바뀌어도 영향을 받지 않는다.<br>
역할과 구현이 분리됨으로써 유연하고 변경이 용이한 프로그램이 된다.<br>
<br>
**한계점**<br>
역할을 변경해야하면 클라이언트와 서버 모두 변경이 필요하다.<br>
예를 들어 자동차를 비행기로 바꾼다면 자동차를 사용하던 클라이언트의 코드를 모두 수정 해야하고 자동차 요청을 받던 서버의 코드 또한 모두 수정이 필요해진다.<br>
따라서 설계할 때 인터페이스를 안정적으로 잘 설계하는 것이 중요하다.<br>
**클라이언트는 요청을 하는 주체이고 서버는 요청을 받는 주체이다.**

## 좋은 객체지향 설계 원칙 5가지 (SOLID)
* 단일 책임 원칙(SRP; Single Responsibility Principle)
* 개방-폐쇄 원칙(OCP; Open - Close Principle)
* 리스코프 치환 원칙(LSP; Liskov Substitution Principle)
* 인터페이스 분리 원칙(ISP; Interface Segregation Principle)
* 의존관계 역전 원칙(DIP; Dependency Inversion Principle)

SOLID의 경우 예시 코드와 함께 이해하는 것이 좋다. 다음 게시글을 참고하자<br>
[Siner's Blog - 그림으로 보는 SOLID 법칙](https://blog.siner.io/2020/06/18/solid-principles/)