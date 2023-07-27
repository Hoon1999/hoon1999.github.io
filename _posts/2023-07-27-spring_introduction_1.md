---
title: 스프링 입문 1강
date: 2023-06-24 12:36:00 +09:00
categories: [개발, Spring]
tags:
  [
    Spring,
	입문,
	inflearn
  ]
---

> 이 글은 인프런 무료 강의인 [스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%EC%9E%85%EB%AC%B8-%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8) 을 바탕으로 작성되었습니다.<br>

## 스프링 부트 스타터
<https://start.spring.io>
스프링 부트 스타터 웹사이트를 이용하면 손쉽게 초기 설정을 할 수 있다.<br>

- Project : Gradle - Groovy
- Language : Java
- Spring Boot : 2.7.x
- Group : hello
- Artifact : hello-spring
- Packaging : Jar
- Java : 11
- Dependencies : Spring web, Thymeleaf

강의 환경이 Java 11 이기 때문에 11로 설정합니다.<br>
Java 11 은 Spring boot 2.x.x 버전을 사용해야 한다고 합니다. <br>
Group 이름은 회사 도메인을 입력한다고 합니다. 실습단계에선 자유롭게 작성합니다.<br>
Artifact 명은 빌드명입니다. 자유롭게 작성합니다. <br>
이외에 설정 값들도 강의에서 요구하는대로 맞춰줍니다.<br>
<br>

## 파일열기
스프링 부트 스타터에서 다운받은 파일을 압축해제합니다.<br>
intelliJ IDE 에서 open 을 누르고 압축해제한 폴더로 갑니다.<br>
build.gradle 파일을 선택하고 open 합니다.<br>

## 자동으로 설정된 파일들 둘러보기

가장 처음으로 볼 파일은 bundle.gradle 입니다.<br>
스프링 부트 스타터에서 설정한 값들이 보입니다.<br>
dependencies 블럭을 보면 thymeleaf, spring web, test 가 있습니다.<br>
test 는 자동으로 들어가는 라이브러리라고 합니다. JUnit 설명을 하시는걸보니 유닛테스트 라이브러리인가 봅니다.<br>
<br>
repositories 블럭은 라이브러리를 다운받는 경로입니다. mavenCentral()도 경로 중 하나입니다.<br>
<br>
이번엔 src를 살펴봅니다.<br>
src를 누르면 main과 test로 나뉘는데, test는 테스트코드와 관련된 폴더라고 합니다.<br>
main으로 들어가면 java와 resources로 나뉩니다. resources는 java외 모든 파일들이 포함됩니다.<br>

-------------------------------------------------------------------
대충 main을 실행하면 콘솔창에서 tomcat이 실행된걸 볼 수 있다는 내용
localhost:8080 으로 웹접속이 가능하다는 내용 이말인 즉 웹서버가 열렸다는 뜻
스프링 에 기본적으로 웹서버가 내장(임베디드)되어 있다는걸 알 수 있음
에러 내용은 웰컴페이지가 없다는 의미

## 라이브러리 둘러보기
파일을 처음 오픈했을 때 우측하단에서 엄청나게 라이브러리를 다운받는 모습을 볼 수 있었음
오른쪽에 gradle - dependencies - compile class path 를 누르면 thymeleaf 와 web을 볼 수 있음
의존에 의존에 의존관계를 볼 수 있고, 웹이 톰캣을 의존하고 있는것을 볼 수 있음.

## 뷰 동작환경 학습
웰컴페이지의 기본 경로는 resources/static/index.html 이다
```
<!DOCTYPE HTML>
<html>
<head>
 <title>Hello</title>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
Hello
<a href="/hello">hello</a>
</body>
</html>
```
복붙하기

java -> hello.hellospring -> controller 에 new java class
클래스명은 HelloController
컨트롤러 : 웹 어플리케이션의 첫번째 진입점
```
@Controller
public class HelloController {
 @GetMapping("hello")
 public String hello(Model model) {
 model.addAttribute("data", "hello!!");
 return "hello";
 }
}
```

resources/templates/hello.html
```
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head>
 <title>Hello</title>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
<p th:text="'안녕하세요. ' + ${data}" >안녕하세요. 손님</p>
</body>
</html>
```
data키에 대한 값을 model에서 찾아서 가져옴.

웰컴 페이지 출력 -> hello 링크 클릭 ->
get hello 전송 -> controller에서 get hello에 반응하는 함수 호출 ->
뷰 리졸버에게 hello 리턴 -> 뷰 리졸버는 templates 에서 hello 라는 이름을 가진 파일을 서치 ->
웹 브라우저에게 전송

## 콘솔에서 빌드하고 실행하기 (윈도우)

```
C:hello-spring> gradle 
C:hello-spring> gradle build  <- 빌드 완료

C:hello-spring> cd build/libs
C:hello-spring\build\libs> dir  <- hello-spring-0.0.1-SNAPSHOT.jar 파일여부 확인
C:hello-spring\build\libs> java -jar hello-spring-0.0.1-SNAPSHOT.jar <- 실행

localhost:8080 접속해서 실행여부 확인하기
control c 눌러서 종료
```

-끝-