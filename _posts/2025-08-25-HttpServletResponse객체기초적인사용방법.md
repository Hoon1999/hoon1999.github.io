---
title: "HttpServletResponse 객체 기초적인 사용방법"
date: 2025-08-25 19:34:00 +09:00
categories: [개발, Spring 2_MVC 핵심]
tags:
  [
    Spring,
    inflearn,
    WAS,
    Servlet,
    HttpServletResponse
  ]
---

> 이 게시글은 인프런의 유료 강의 [스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/스프링-mvc-1)을 수강하며 공부한 내용을 담고있습니다.<br>
> 저작권에 의해 강의내용에 해당하는 전체 코드는 공개할 수 없습니다. <br>
> 저작권에 의해 모든 내용을 담을 수 없습니다. 중복 및 반복되는 내용은 생략했습니다.<br>

## 개요
HttpServletResponse 객체의 기초적인 내용을 공부한다.
HTTP Response 의 header 와 body 를 작성하는 방법에 대해 공부한다.

## response header 에 값 추가

header 는 status-line 과 header 로 구분된다.
request 요청이 start-line 과 header 로 구분되는 것처럼 말이다.

```java
@WebServlet(name = "responseHeaderServlet", urlPatterns = "/response-header")
public class ResponseHeaderServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // status-line : 응답 코드 200
//        response.setStatus(200); // 또는
        response.setStatus(HttpServletResponse.SC_OK); // 이것 사용

        // header
        response.setHeader("Content-Type", "text/plain;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Set-Cookie", "myCookie=good; Max-Age=600");
        response.setHeader("my-header", "hello");
        
//        response.setStatus(HttpServletResponse.SC_FOUND); // Redirect
//        response.setHeader("Location", "/basic/hello-form.html");

        PrintWriter writer = response.getWriter();
        writer.println("ok");
    }
}
```

![사진1]()<br>

response 헤더를 살펴보면 직접 넣은 값들을 확인할 수 있다.(사진의 cookie 는 새로고침해야 볼 수 있음)<br>
응답 코드는 직접 숫자를 집어넣을 수도 있지만 미리 정의된 값을 사용하는게 좋고, ```response.setHeader()``` 를 사용하면 범용적으로 사용할 수 있지만 오타가 발생하면 의도하지 않은 결과가 발생할 수 있다.<br>

## response header 에 값 추가. 다른 방법

```java
@WebServlet(name = "responseHeaderServlet", urlPatterns = "/response-header")
public class ResponseHeaderServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // status-line : 응답 코드 200
//        response.setStatus(200); // 또는
        response.setStatus(HttpServletResponse.SC_OK); // 이것 사용

        // header
//        response.setHeader("Content-Type", "text/plain;charset=utf-8");
        response.setContentType("text/plain");
        response.setCharacterEncoding("utf-8");
//        response.setContentLength(3); // 생략시 자동으로 계산된다

        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");

//        response.setHeader("Set-Cookie", "myCookie=good; Max-Age=600");
        Cookie cookie = new Cookie("myCookie", "good");
        cookie.setMaxAge(600);
        response.addCookie(cookie);

        response.setHeader("my-header", "hello");

//        response.setStatus(HttpServletResponse.SC_FOUND); // 응답코드 302, Redirect
//        response.setHeader("Location", "/basic/hello-form.html");
        // Rediect 는 위 방법 대신 아래 메서드를 사용할 수 있다.
//        response.sendRedirect("/basic/hello-form.html");

        PrintWriter writer = response.getWriter();
        writer.println("ok");
    }
}
```

```response.setHeader()``` 말고 다른 방법을 사용하여 header 에 값을 추가할 수 있다.<br>
자주 사용되는 몇몇 header 필드들은 미리 정의된 메서드를 사용하는 방법도 존재한다.<br>
결과는 주석처리한 코드와 동일하다. Content-Length 가 3 인 이유는 출력되는 content 가 ```ok\n``` 3Byte 이므로 3 을 계산해서 자동으로 넣어준다.<br>
Redirect 는 직접 해보면 된다.<br>

## body 에 값 넣어 보내기

## 단순 텍스트 넣어 보내기

```java
response.getWriter().write("ok"); // 또는

PrintWriter writer = response.getWriter();
writer.println("ok");
```
설명은 안했지만 앞서 계속 ok 메시지를 넣어 보낸것을 알 수 있다.<br>

## HTML 넣어 보내기

```java
@WebServlet(name = "responseBodyHtmlServlet", urlPatterns = "/response-body-html")
public class ResponseBodyHtmlServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        response.setCharacterEncoding("utf-8");
        
        PrintWriter writer = response.getWriter();

        writer.println("<html>");
        writer.println("<body>");
        writer.println("    <div>Hello, Servlet!</div>");
        writer.println("</body>");
        writer.println("</html>");
    }
}
```

코드 작성 후 실행해서 페이지 소스를 확인해보면 그대로 출력되는 것을 확인할 수 있다.<br>

## JSON 넣어 보내기

```java
@WebServlet(name = "responseBodyJsonServlet", urlPatterns = "/response-body-json")
public class ResponseBodyJsonServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8"); // 안해도 됨.

        HelloData data = new HelloData();
        data.setUsername("kim");
        data.setAge(20);

        // 객체를 JSON 형식으로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        String result = objectMapper.writeValueAsString(data);

        response.getWriter().write(result);
    }
}
```

```java
@Getter
@Setter
public class HelloData {
    String username;
    int age;
}
```

```
http://localhost:8080//response-body-json 접속결과

{"username":"kim","age":20}
```

마찬가지 방법으로 JSON 을 보낼 수 있다. JSON 은 Spring MVC 에 포함되어 있는 Jackson 라이브러리를 사용하여 보내면 쉽게 JSON 을 작성할 수 있다.<br>

**참고**<br>
application/json 은 기본적으로 utf-8 을 사용하도록 정의되어 있어 별도로 utf-8 을 지정할 필요가 없다.<br>
```response.getWriter()``` 를 사용하면 자동으로 utf-8 을 추가한다. 이때는 ```response.getOutPutStream()``` 을 사용하면 그런 문제가 없다.<br>
