---
title: 초기 세팅
date: 2024-06-26 16:36:00 +09:00
categories: [개발, Spring 1_핵심원리 Basic]
tags:
  [
    Spring,
    basic,
    inflearn
  ]
---

인프런의 스프링 핵심 원리 - 기본편을 수강하며 공부한 내용을 담고있습니다.

## 프로젝트 생성
스프링 부트 스타터 사이트에서 프로젝트 생성<br>
https://start.spring.io<br>
<br>
Project : Gradle Project<br>
Language : Java<br>
Spring boot : 안정화된 버전(snapshot 등 이 안써져있는 버전)<br>
Group 과 Artifact 는 아무거나 작성해도 된다.<br>
Packaging : Jar<br>
Java : 위에서 고른 Spring boot 와 호환되는 버전을 선택해야 한다. 이건 직접 찾아봐야한다.<br>
내가 듣는 강의에서는 Spring boot 버전이 2.3.0 이고 Java 11 을 이용하라는데, 현 시점에서는 둘 다 선택할 수가 없다.<br>
직접 검색해서 Spring boot 버전과 맞는 Java 버전을 선택한다.<br>

나머지는 건들지 않고 Generate 버튼을 클릭하여 파일을 다운 받는다.<br>

다운 받은 파일을 import 하여 실행한다.<br>
자바 버전을 확인할 수 있다. 17 인 것이 확인된다.<br>

preference 에 들어가서 실행환경을 intelliJ로 변경<br>
아래에서 실행하는 자바 버전도 변경할 수 있다.<br>
실행하는 자바 버전이 프로젝트에 설정된 버전보다 낮으면 오류가 발생한다.

