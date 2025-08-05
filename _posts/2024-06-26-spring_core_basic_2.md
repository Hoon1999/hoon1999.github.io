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

> 이 게시글은 인프런의 유료 강의 [스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8)을 수강하며 공부한 내용을 담고있습니다.<br>
> 저작권에 의해 강의내용에 해당하는 전체 코드는 공개할 수 없습니다. <br>
> 저작권에 의해 모든 내용을 담을 수 없습니다. 중복 및 반복되는 내용은 생략했습니다.<br>

## 프로젝트 생성
스프링 부트 스타터 사이트에서 프로젝트 생성<br>
[spring initializr](https://start.spring.io)<br>
<br>
![2024-06-26_1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-06-26/1.png?raw=true)<br>
Project : Gradle Project<br>
Language : Java<br>
Spring boot : 안정화된 버전(snapshot 등 이 안써져있는 버전)<br>
Group 과 Artifact 는 아무거나 작성해도 된다.<br>
Packaging : Jar<br>
Java : 위에서 고른 Spring boot 와 호환되는 버전을 선택해야 한다. 이건 직접 찾아봐야한다.<br>
내가 수강하고 있는 강의에서는 Spring boot 버전이 2.3.0 이고 Java 11 을 이용하라는데, 구버전 강의라 현 시점에서는 둘 다 선택할 수가 없다.<br>
직접 검색해서 Spring boot 버전과 맞는 Java 버전을 선택한다.<br>

나머지는 건들지 않고 Generate 버튼을 클릭하여 파일을 다운 받는다.<br>
![2024-06-26_2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-06-26/2.png?raw=true)<br>
다운 받은 파일을 압축해제한다.<br>
![2024-06-26_3](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-06-26/3.png?raw=true)<br>
![2024-06-26_4](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-06-26/4.png?raw=true)<br>
open 버튼을 누르고 압축 해제한 폴더로 가서 build.gradle 을 열어준다.<br>
![2024-06-26_5](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-06-26/5.png?raw=true)<br>
![2024-06-26_6](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-06-26/6.png?raw=true)<br>
파일이 열릴 때 까지 파란색 버튼을 계속 눌러준다.<br>
![2024-06-26_7](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-06-26/7.png?raw=true)<br>
![2024-06-26_8](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-06-26/8.png?raw=true)<br>
자바 버전을 확인할 수 있다. 17 인 것이 확인된다.<br>

![2024-06-26_9](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-06-26/9.png?raw=true)<br>
preference(윈도우는 Settings) 에 들어가서 실행환경을 intelliJ로 변경한다.<br>
아래에서 실행하는 자바 버전도 변경할 수 있다.<br>
실행하는 자바 버전이 프로젝트에 설정된 버전보다 낮으면 오류가 발생한다.(맞나?)<br>
아무튼 Spring Boot 버전이 3.x.x 인데 Java 11로 설정되어 있으면 JDK 17 이상 버전이 필요하다는 오류가 뜨는 것으로 알고 있다.

<br>
<hr>
이전 포스팅 : [스프링을 사용하는 이유](https://hoon1999.github.io/posts/spring_core_basic_1/)<br>
다음 포스팅 : [기본 예제 만들기](https://hoon1999.github.io/posts/기본예제만들기/)<br>