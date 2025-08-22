---
title: "HttpServletRequest 객체 - 요청 데이터"
date: 2025-08-22 21:55:00 +09:00
categories: [개발, Spring 2_MVC 핵심]
tags:
  [
    Spring,
    inflearn,
    WAS,
    Servlet,
    HttpServletRequest
  ]
---

> 이 게시글은 인프런의 유료 강의 [스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/스프링-mvc-1)을 수강하며 공부한 내용을 담고있습니다.<br>
> 저작권에 의해 강의내용에 해당하는 전체 코드는 공개할 수 없습니다. <br>
> 저작권에 의해 모든 내용을 담을 수 없습니다. 중복 및 반복되는 내용은 생략했습니다.<br>

## 개요
HttpServletRequest 객체를 이용해 Client 에서 전송한 데이터를 받는 방법에 대해 공부한다.

## 전송 방식

- GET - 쿼리 파라미터
  - 쿼리 파라미터에 값을 포함시켜 전달하는 방식
  - http://url.com/path?username=kim&age=20

- POST - Form
  - Form 을 이용해 데이터를 전달하는 방식
  - Form 데이터는 body 에 보관되지만 형식은 쿼리 파라미터와 동일하다.
  - username=kim&age=20 값이 그대로 body 에 보관되기 때문에 쿼리 파라미터와 동일한 방법으로 데이터를 꺼낼 수 있다.
  - content-type 이 application/x-www-form-urlencoded 이다.

- HTTP message body
  - JSON, XML, TEXT 같은 데이터를 전송할 때 사용한다.
  - POST, PUT, PATCH 방식을 사용하며 데이터는 body 에 보관하여 전송한다.

## GET - 쿼리 파라미터

- username = kim
- age = 20

위 값을 전송하려면 url 에 ```?username=kim&age=20``` 을 붙여서 보낸다.<br>
해당 요청을 받는 서블릿을 작성하자.<br>

```java
@WebServlet(name = "requestParamServlet", urlPatterns = "/request-param")
public class RequestParamServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Step 1
        System.out.println("--- 파라미터 전체 출력 ---");

        request.getParameterNames()
                .asIterator()
                .forEachRemaining(requestName -> System.out.println(requestName + " = " + request.getParameter(requestName)));

        System.out.println("--- 파라미터 전체 출력 끝 ---");
        System.out.println();

        // Step 2
        System.out.println("--- 파라미터 하나씩 출력 ---");
        String age = request.getParameter("age");
        System.out.println("username = " + request.getParameter("username"));
        System.out.println("age = " + request.getParameter("age"));
        System.out.println("--- 파라미터 하나씩 출력 끝 ---");
        System.out.println();

        // Step 3
        System.out.println("--- 중복되는 파라미터 출력 ---");
        String[] usernames = request.getParameterValues("username");
        for(String username : usernames) {
            System.out.println("username = " + username);
        }
        System.out.println("--- 중복되는 파라미터 출력 끝 ---");
        System.out.println();

        response.getWriter().write("ok");
    }
}
```

우선 ```http://localhost:8080/request-param``` 으로 보낸 요청을 받을 수 있게 서블릿의 ```urlpatterns="request-param"``` 으로 작성한다.<br>
이후 Step 1 부분을 작성 후 ```http://localhost:8080/request-param?username=kim&age=20``` 를 주소창에 입력한다.<br>

```
--- 파라미터 전체 출력 ---
username = kim
age = 20
--- 파라미터 전체 출력 끝 ---
```

그럼 위와 같은 결과를 콘솔창에서 확인할 수 있다.<br>
코드를 읽어보면 유추할 수 있듯이 ```request.getParameterNames()``` 는 모든 parameter 이름을 가져온다. 여기서는 username, age 가 되겠다.<br>
가져온 username 과 age 를 ```request.getParameter()``` 에 넣어 값을 꺼낸다.<br>

Step 2 도 동일한 방식이다.<br>
전체 파라미터를 가져올 필요가 없고, GET 요청에 포함된 parameter 이름을 직접 ```request.getParameter()``` 에 입력하여 출력하는 방식이다.<br>

Step 3 이 조금 다르다.<br>
Step 3 에서는 요청이 ```http://localhost:8080/request-param?username=kim&age=20&username=hong``` 라고 가정한다.<br>

- username = kim
- username = hong

그럼 username 이 두 개가 된다.<br>
이 때 ```request.getParameter("username")``` 을 사용하면 앞에 있는 kim 만 출력되기 때문에 ```request.getParameterValues("username")``` 을 사용해야 한다.<br>

## Post - From 데이터

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form action="/request-param" method="post">
    username: <input type="text" name="username" />
    age: <input type="text" name="age" />
    <button type="submit">전송</button>
</form>
</body>
</html>
```

우선 form 데이터를 전송할 수 있게 위 html 파일을 추가한다.<br>
경로 : ``` webapp > basic (디렉토리 생성) > hello-form.html (생성) ``` <br>
귀찮으면 Postman 을 사용해도 된다.<br>

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-22-HttpServletRequest객체요청데이터/1.png?raw=true)<br>
![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-22-HttpServletRequest객체요청데이터/2.png?raw=true)<br>


그리고 ```localhost:8080/basic/hello-form.html``` 로 들어가서 값을 넣어 전송하면 개발자 도구에서 전송한 값을 확인할 수 있다.<br>
Header 에서 content-type 이 application/x-www-form-urlencoded 인 것을 확인할 수 있고, Payload 에서 내가 보낸 값을 확인할 수 있다.<br>
Payload 를 확인하면 내가 전송한 값의 형식이 쿼리 파라미터와 동일한 형식인 것을 확인할 수 있다.<br>
따라서 서버에서 ```request.getParameter("username")``` 을 사용하여 값을 꺼낼 수 있고, 콘솔에서도 제대로 출력되는 모습을 확인할 수 있다.<br>
쉽게말해 GET - 쿼리 파라미터 방식과 Form 방식은 동일한 메서드를 사용해 값을 가져올 수 있어 간편하다.<br>

## body 에 단순 텍스트 담아서 전송

![사진3](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-22-HttpServletRequest객체요청데이터/3.png?raw=true)<br>
위 이미지와 같이 Body 에 단순한 텍스트만 담아서 전달하려고 한다.<br>

```java
@WebServlet(name = "requestBodyStringServlet", urlPatterns = "/request-body-string")
public class RequestBodyStringServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ServletInputStream inputStream = request.getInputStream();
        String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

        System.out.println("message body : " + messageBody);

        response.getWriter().write("ok");

    }
}
```

실습을 위한 Servlet 을 작성한다.<br>
body 에 담겨있는 값을 그대로 가져오려면 ```request.getInputStream()``` 을 사용한다.<br>
가져온 값은 ServletInputStream 형태이므로 String 으로 형변환 한다.<br>

![사진4](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-22-HttpServletRequest객체요청데이터/4.png?raw=true)<br>

Postman 을 사용해 테스트 한다.<br>
콘솔창에 Hello, World! 가 출력되는 것을 확인할 수 있다.<br>

```request.getInputStream()``` 은 body 에 담겨있는 값을 그대로 가져오기 때문에 form 으로 전송한 값도 읽을 수 있다.<br>
Postman 을 사용해 form 데이터를 전송하면 콘솔창에 출력되는 것을 확인할 수 있다.<br>

## body 에 JSON 형식을 담아서 전송

JSON 도 단순 문자열이기 때문에 기본적인 방법은 텍스트와 동일하다.<br>
차이점은 Content-type 을 자동으로 application/json 으로 잡아주고, 서블릿에 따라 JSON 을 자동으로 인식해 파싱까지 해줄 수 있다.<br>
여기서는 JSON 문자열을 그대로 가져와서 직접 파싱한다.<br>

```java
@WebServlet(name = "requestBodyJsonServlet", urlPatterns = "/request-body-json")
public class RequestBodyJsonServlet extends HttpServlet {
    ObjectMapper objectMapper = new ObjectMapper();
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ServletInputStream inputStream = request.getInputStream();
        String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

        System.out.println(messageBody);

        HelloData helloData = objectMapper.readValue(messageBody, HelloData.class);
        System.out.println("helloData.getUsername() = " + helloData.getUsername());
        System.out.println("helloData.getAge() = " + helloData.getAge());

        response.getWriter().write("ok");
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

스프링 MVC 에 JSON 라이브러리인 Jackson 이 포함되어 있어 바로 가져다 쓰면된다.<br>
Jackson 라이브러리로 변환시킬 때 JSON 이랑 동일한 형식을 가진 Class 를 만들자.<br>

![사진5](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-22-HttpServletRequest객체요청데이터/5.png?raw=true)<br>

```
// 콘솔창에 출력되는 결과
{
    "username": "kim",
    "age": 20
}
helloData.getUsername() = kim
helloData.getAge() = 20
```

어차피 스프링 사용하면 JSON 을 자동으로 파싱해주는데 굳이 공부해야 싶을 수도 있지만, 서블릿에 대한 학습을 통해 스프링의 내부 동작에 대해 더 쉽게 이해할 수 있도록 한다.<br>
그리고 서블릿의 불편한 점을 좀 더 개선해서 지금의 스프링이 JSON 을 파싱해준다고 생각하면 된다.<br>
