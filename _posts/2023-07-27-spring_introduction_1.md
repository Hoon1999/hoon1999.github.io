---
title: 스프링 입문 1강
date: 2023-07-27 12:36:00 +09:00
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
![2023-07-31_1](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/99922be9-724c-4487-972b-3305f206d700){: .normal}<br>
스프링 부트 스타터에서 다운받은 파일을 압축해제합니다.<br>
intelliJ IDE 에서 open 을 누르고 압축해제한 폴더로 갑니다.<br>
build.gradle 파일을 선택하고 open 합니다.<br>

## 자동으로 설정된 파일들 둘러보기
![2023-07-31_2](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/83ab6e5f-ba8d-468f-9ab3-a79e6cd1711b){: .normal}<br>
가장 처음으로 볼 파일은 bundle.gradle 입니다.<br>
스프링 부트 스타터에서 설정한 값들이 보입니다.<br>
dependencies 블럭을 보면 thymeleaf, spring web, test 가 있습니다.<br>
test 는 자동으로 들어가는 라이브러리라고 합니다. JUnit 설명을 하시는걸보니 유닛테스트 라이브러리인가 봅니다.<br>
<br>
repositories 블럭은 라이브러리를 다운받는 경로입니다. mavenCentral()도 경로 중 하나입니다.<br>
<br>
![2023-07-31_3](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/730490c0-c032-4ee9-8e4f-bed093452d88){: .normal}<br>
이번엔 src를 살펴봅니다.<br>
src를 누르면 main과 test로 나뉘는데, test는 테스트코드와 관련된 폴더라고 합니다.<br>
main으로 들어가면 java와 resources로 나뉩니다. resources는 java외 모든 파일들이 포함됩니다.<br>
<br>
![2023-07-31_4](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/d5815080-2dbc-411c-aeb7-68891d7fd187){: .normal}<br>
![2023-07-31_5](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/09bc7342-d5ed-4915-8f43-f2b788cc00db){: .normal}<br>
main/그룹명.아티팩트명/아티팩트명Application.java 파일을 눌러보면 main 메소드를 볼 수 있습니다. <br>
main 메소드의 왼쪽에 실행을 눌러 실행합니다.<br>
이후 콘솔창을 보면 tomcat이 실행되는 것을 확인할 수 있고, 8080포트를 사용하는것을 볼 수 있습니다.<br>
웹 브라우저 주소창에 localhost:8080 을 입력하면, 웹서버에 접근할 수 있습니다.<br>
이는 스프링에 웹서버가 내장되어(embedded)있음을 알 수 있습니다.<br>
지금은 welcome page(기본 웹페이지)가 없어서 에러가 나옵니다.<br>

## 라이브러리 둘러보기
![2023-07-31_6](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/9b4b160a-2b39-4167-9289-6502e23224c6){: .normal}<br>
라이브러리는 좌측의 external libraries에서 볼 수 있고, 의존관계는 우측상단 gradle에서 볼 수 있습니다.<br>
우측 상단에 gradle - dependencies - compile class path 를 누르면 thymeleaf 와 web을 볼 수 있습니다.<br>
![2023-07-31_7](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/2b2015a6-fe5d-4b8c-ab96-dc7b5deca3dc){: .normal}<br>
의존에 의존에 의존관계 등을 볼 수 있고, web이 톰캣을 의존하고 있는것을 볼 수 있습니다.<br>

## 뷰 동작환경 학습
![2023-07-31_8](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/09f3d754-dc61-461b-a9f9-8e1b4afc997b){: .normal}<br>
welcome page의 기본 경로는 resources/static/index.html 입니다.<br>
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
static 에 우클릭으로 새 파일(index.html)을 만들고, 위 코드를 붙여넣습니다.<br>
코드를 읽어보면 ```Hello hello``` 가 출력되고 hello에 링크가 걸려있는것을 볼 수 있습니다.<br>
![2023-07-31_9](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/9b3df09d-011b-49b9-951b-8c41a4732313){: .normal}<br>
hello를 클릭하면 get 방식으로 서버에 hello를 요청하게 됩니다.<br>
<br>
![2023-07-31_10](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/6ac5c876-b1fd-4e41-bec5-8460b511cdb9){: .normal}<br>
java -> 그룹명.아티팩트명 -> controller 에 new java class를 만듭니다.<br>
클래스명은 HelloController 로 합니다.<br>
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
새로만든 클래스에 위 내용을 붙여 넣습니다.<br>
controller는 웹 어플리케이션의 첫번째 진입점이라고 합니다.<br>
따라서 컨트롤러가 hello를 받습니다. <br>
컨트롤러에서 hello 요청을 수행할 메소드를 찾습니다.<br>
@GetMapping("hello") 는 get으로 hello를 받을때 매칭됩니다.<br>
@GetMapping("hello")에 해당되는 메소드는 "data":"hello!!" 라는 키:값 쌍을 model에 추가하고 "hello"를 리턴합니다.<br>
리턴값을 받는 대상은 viewResolver 입니다.<br>
veiwResolver는 hello 받았으므로, hello.html을 resources/templates/에서 찾은 뒤 사용자에게 전송합니다.<br>
<br>
resources/templates/hello.html 파일을 생성합니다.<br>
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
data에 대한 값을 model에서 찾아서 가져옵니다. <br>
컨트롤러에서 data:hello!! 를 추가하였으므로 '안녕하세요. hello!!'가 출력됩니다.<br>
<br>
<br>
요약<br>
웰컴 페이지 출력 -> hello 링크 클릭 ->
get hello 전송 -> controller에서 get hello에 반응하는 메소드 호출 ->
뷰 리졸버에게 hello 리턴 -> 뷰 리졸버는 templates 에서 hello.html 파일을 서치 ->
요청자에게 hello.html을 전송

## 콘솔에서 빌드하고 실행하기 (윈도우)

```
C:hello-spring> gradle 
C:hello-spring> gradle build  // 빌드 완료

C:hello-spring> cd build/libs
C:hello-spring\build\libs> dir  // hello-spring-0.0.1-SNAPSHOT.jar 파일여부 확인
C:hello-spring\build\libs> java -jar hello-spring-0.0.1-SNAPSHOT.jar // 실행

//localhost:8080 접속해서 실행여부 확인하기
//control c 눌러서 종료
```
배포할 때는 hello-spring.0.0.1-SNAPSHOT.jar 파일만 배포하면 된다고 한다.<br>
근데 왜 그런지는 모르겠음. hello.html 같은 resource 파일들도 다 포함이 되어있나??<br>

-끝-