---
title: 스프링 입문 2강
date: 2023-08-02 14:46:00 +09:00
categories: [Framework, Spring-1 입문]
tags:
  [
    Spring,
	입문,
	inflearn
  ]
---

> 이 글은 인프런 무료 강의인 [스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%EC%9E%85%EB%AC%B8-%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8) 을 바탕으로 작성되었습니다.<br>

## 정적컨텐츠
정적 컨텐츠는 서버에 저장되어 있는 파일을 그대로 보내주는 것을 말합니다.<br>
이전 시간에 서버에서 웹브라우저로 hello.html 을 그대로 보내주었습니다. 이러한 것을 정적컨텐츠라고 합니다.<br>

## MVC 와 템플릿 엔진
템플릿 엔진은 JSP, PHP, thymeleaf 등을 말합니다.<br>
<br>
MVC 는 Model, View, Controller 의 첫글자를 딴 것입니다.<br>
View 는 눈으로 보여주는 화면 구성을,<br>
Controller 는 로직에 대한 부분을,<br>
Model 은 화면에 필요한 요소들을 담는 공간입니다.<br>
<br>
```
@GetMapping("hello-mvc")
public String helloMvc(@RequestParam("name") String name, Model model) {
	model.addAttribute("name", name);
	return "hello-template";
}
```
컨트롤러에 위 코드를 추가합니다.<br>
![2023-08-03_1](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/349103cb-0a48-4d05-bfba-d822e4aadaba){: .normal}<br>
get메소드로 hello-mvc 가 들어오면 helloMvc 메소드가 호출됩니다.<br>
@RequestParam("name")은 파라미터로 name 이 들어오면 호출(실행(?))되어 뒤에 적힌 name 변수에 저장됩니다.<br>
![2023-08-03_2](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/68ba66a9-d720-4c35-9193-d8bd0f073ae3){: .normal}<br>
따라서 파라미터로 spring 을 주면, name 변수에 spring이 저장되고,<br>
model 의 key:value 에 name:spring이 추가됩니다.<br>
그리고 viewResolver 에게 hello-template 을 줍니다.<br>
<br>
<br>
viewResolver가 hello-template.html 을 찾을 수 있게,<br>
resources/templates/ 경로에 hello-template.html 을 생성해줍니다.<br>
```
<html xmlns:th="http://www.thymeleaf.org">
<body>
<p th:text="'hello ' + ${name}">hello! empty</p>
</body>
</html>
```
그리고 위 코드를 작성해줍니다.<br>
서버를 실행합니다.<br>
```
localhost:8080/hello-mvc?name=spring
```
주소로 입력한 후 웹페이지의 소스코드를 보면, hello-template.html 의 소스코드와 다른것을 알 수 있습니다.<br>
이는 viewResolver가 hello-template.html 을 변환 후 웹브라우저에게 전달하였기 때문입니다.<br>
![2023-08-03_3](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/5bb39ece-fee2-41da-a508-87d8406c090a){: .normal}<br>

## thymeleaf 의 장점
백엔드 서버가 존재 하지않아도 디자이너가 웹페이지를 디자인 할 수 있습니다.<br>

```
<p th:text="'hello ' + ${name}">hello empty</p>
```

소스코드를 보면 기본적으로 hello empty가 출력되는 것을 볼 수 있습니다.<br>
그리고 서버가 가동중이면 hello empty 대신 hello + ${name} 이 출력됩니다.<br>
과거에는 hello empty 같은 것을 출력하는 기능이 없고, 무조건 hello + {name} 을 출력해야 되서
서버를 운영하지 않는 상태에서 디자인하기가 불편했다고 합니다.<br>
<br>
사실 (name이 존재한다면)반드시 hello + ${name} 이 출력되는데 왜 hello empty와 같은 문장을 넣는지 이해가 안됐었는데,
이제 이해를 할 수 있게되었습니다.<br>

## API
API 방식은 객체를 리턴할 때 사용하는 방식이라고 합니다.<br>
여태까지 학습한 내용은 전부 xml을 리턴하는 방식이었습니다.<br>
```
@Controller
public class HelloController {
 @GetMapping("hello-string")
 @ResponseBody
 public String helloString(@RequestParam("name") String name) {
	return "hello " + name;
 }
}
```
위 코드를 controller에 작성합니다.<br>
![2023-08-03_4](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/2a5bbe72-84e0-4c8f-b959-8a60885499b8){: .normal}<br>
@ResponseBody 어노테이션을 작성하면, return 값을 viewResolver 말고 HttpMessageConverter 로 넘겨줍니다.<br>
HttpMessageConverter 는 리턴값이 객체면 JsonConverter 로 처리하고, 문자열이면 StringConverter로 처리합니다.<br>
<br>
JsonConverter 는  MappingJackson2HttpMessageConverter 를 사용한다고 합니다.<br>
StringConverter 는 StringHttpMessageConverter 를 사용한다고 합니다.<br>
이외에도 상황에 맞는 여러 컨버터가 존재한다고 합니다.<br>
<br>
위 사항들은 모두 spring에서 기본값으로 설정되어 있는것 뿐이므로 모두 수정이 가능하다고 합니다.<br>
@ResponseBody 어노테이션을 사용했을 때, HttpMessageConverter 가 아닌 다른 대상에게 넘겨준다거나 할 수 있다고 합니다.<br>
JsonConverter 에 사용되는 Jackson2 라이브러리 대신 다른 Json 라이브러리를 사용하여 컨버터로 등록할 수 도 있다고 합니다.<br>
<br>
HTTP Accept 헤더에는 반환받을 확장자(?)를 지정하는 부분이 있다고 합니다.<br>
만약에 @ResponseBody 어노테이션에 해당되어도 클라이언트(웹브라우저 등)가 xml 형식만 받겠다고 되어있으면, <br>
JsonConverter 나 StringConverter 가 아닌 HtmlConverter(?) 정확한 명칭은 모르겠지만 <br>
아무튼 xml 형식으로 만들어서 되돌려줍니다.<br>

```
@GetMapping("hello-api")
@ResponseBody
public Hello helloApi(@RequestParam("name") String name) {
 Hello hello = new Hello();
 hello.setName(name);
 return hello;
}

static class Hello {
 private String name;
 public String getName() {
  return name;
 }
 public void setName(String name) {
  this.name = name;
 }
}
```
위 코드는 리턴값이 객체(Hello 클래스)인 예제입니다.<br>
코드를 작성 후 실행을 한 뒤 웹브라우저에서 보면 Json 형식으로 출력되는 것을 볼 수 있습니다.<br>
이것을 통해 리턴값(hello)이 JsonConverter로 가서 처리된 후 클라이언트(웹브라우저)로 전달된 것을 확인할 수 있습니다.<br>