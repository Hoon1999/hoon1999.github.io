---
title: "HttpServletRequest 객체 기초"
date: 2025-08-18 00:22:00 +09:00
categories: [Framework, Spring-3 MVC 핵심]
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
HttpServletRequest 객체의 기초적인 학습을 한다.<br>

## HttpServletRequest
client 의 HTTP 요청을 서블릿이 parsing 하여 request 객체에 이쁘게 담아주기 때문에 우리는 손쉽게 사용할 수 있다.<br>
다시말해 HTTP 요청을 parsing 하는 코드를 직접 작성할 필요가 없다는 의미다.<br>

HTTP 는 아래와 같은 구조이다.

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-18-HttpServletRequest객체기초/1.png?raw=true)<br>
![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-18-HttpServletRequest객체기초/2.png?raw=true)<br>

- Start Line
  - HTTP 메서드 (GET, POST)
  - Path 및 Query String
  - 스키마, 프로토콜

- Header
  - Cookie 등

- Body
  - form data
  - message body (예를 들면 JSON)

## HttpServletRequest 기본 사용법
hello.servlet > basic > request (패키지 생성) > RequestHeaderServlet (클래스 생성) <br>

```java
@WebServlet(name = "requestHeaderServlet", urlPatterns = "/request-header")
public class RequestHeaderServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 아래 메서드들은 직접 코딩해야한다.
//        printStartLine(request); // Http request 의 start line 을 콘솔에 출력
//        printHeaders(request); // Http request 의 header 정보를 콘솔에 출력
//        printHeaderUtils(request); // Http request 의 header 정보를 간편하게 콘솔에 출력
//        printEtc(request); // 이외에 알아둬야할 것들
    }
    private void printStartLine(HttpServletRequest request) {
          // 생략
    }
    // 이하 생략
```

위 코드를 참고하여 기본적인 세팅을 해준다.<br>
주석처리된 메서드들을 직접 작성하며 HttpServletRequest 객체에 어떤 값이 있는지, 값을 꺼내는 방법이 무엇인지 학습한다.<br>


## Start Line 조회

```java
private void printStartLine(HttpServletRequest request) {
        System.out.println("--- Http Request 의 start line 입니다. ---");

        System.out.println("request.getMethod() = " + request.getMethod());
        System.out.println("request.getProtocol() = " + request.getProtocol());
        System.out.println("request.getScheme() = " + request.getScheme());
        System.out.println("request.getRequestURL() = " + request.getRequestURL());
        System.out.println("request.getRequestURI() = " + request.getRequestURI());
        System.out.println("request.getQueryString() = " + request.getQueryString());
        System.out.println("request.isSecure() = " + request.isSecure());

        System.out.println("--- Http Request 의 start line 입니다. ---");
        System.out.println();
    }
```

![사진3](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-18-HttpServletRequest객체기초/3.png?raw=true)<br>

start line 의 값들을 꺼내는 메서드를 작성하고 실행한 결과다.<br>

```localhost:8080/request-header``` 로 요청을 보내면 RequestHeaderServlet 클래스에서 캐치해 service() 메서드가 호출, 그리고 다시 printStartLine() 이 호출된다.<br>

Getter 문법으로 작성되어 있어 이해하기 쉽다.<br>
QueryString 에 아무것도 주지 않아서 null 로 출력되는 것을 확인할 수 있다.<br>
isSecure() 는 http 이면 false, https 면 true 를 출력한다.<br>



## Header 조회

```java
private void printHeaders(HttpServletRequest request) {
        System.out.println("--- Http Request 의 Header 정보를 모두 출력합니다. ---");

        // 반복문을 사용하는 방식
//        Enumeration<String> headerNames = request.getHeaderNames();
//        while (headerNames.hasMoreElements()) {
//            String headerName = headerNames.nextElement();
//            System.out.println(headerName + " = " + request.getHeader(headerName));
//        }

        // 스트림을 사용하는 방식
        request.getHeaderNames()
                .asIterator()
                .forEachRemaining((headerName) -> System.out.println(headerName + " = " + request.getHeader(headerName)));

        System.out.println("--- Http Request 의 Header 정보를 모두 출력했습니다. ---");
        System.out.println();
    }
}
```

![사진4](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-18-HttpServletRequest객체기초/4.png?raw=true)<br>

반복문을 사용하는 방법과 스트림을 사용하는 방법 두 개 중 편한 것을 사용하면 된다.<br>
일단 ```request.getHeaderNames()``` 를 사용해 header 에 포함된 모든 항목을 가져온다.<br>
반복문(혹은 이터레이터)에서 ```request.getHeader(헤더이름)``` 을 사용해 각 항목의 값을 출력한다.<br>
만약 header 의 모든 내역이 필요한 경우가 아니라면 다음 방법을 사용할 수 있다.<br>

## Header 간편 조회

```java
private void printHeaderUtils(HttpServletRequest request) {
        System.out.println("--- Http Request Header 의 정보를 출력합니다. ---");

        System.out.println("[Host 조회]");
        System.out.println("request.getServerName() = " + request.getServerName()); 
        System.out.println("request.getServerPort() = " + request.getServerPort()); 
        System.out.println();
        System.out.println("[Accept-Language 조회]");
        request.getLocales().asIterator()
                .forEachRemaining(locale -> System.out.println("locale = " + locale));
        System.out.println("request.getLocale() = " + request.getLocale());
        System.out.println();
        System.out.println("[cookie 조회]");
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                System.out.println(cookie.getName() + ": " + cookie.getValue());
            }
        }
        System.out.println();
        System.out.println("[Content 조회]");
        System.out.println("request.getContentType() = " + request.getContentType());
        System.out.println("request.getContentLength() = " + request.getContentLength());
        System.out.println("request.getCharacterEncoding() = " + request.getCharacterEncoding());

        System.out.println("--- Http Request Header 의 정보를 출력을 완료했습니다. ---");
        System.out.println();
    }
```

![사진5](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-18-HttpServletRequest객체기초/5.png?raw=true)<br>

마찬가지로 Getter 문법으로 구현된 메서드가 있으므로 필요한 정보만 꺼내 사용할 수 있다.<br>
Accept-Language 는 브라우저에서 보낸 값으로 어떤 언어를 선호(?) 하는지 나타낸다.<br>
1순위가 한국어이므로 개발한 서비스에서 한국어 페이지를 응답해주고, 만약 한국어를 지원하지 않는 서비스이면 2순위인 영어로 페이지를 응답해주는 방식에 사용하면 될것 같다.<br>


## 기타 조회

```java
private void printEtc(HttpServletRequest request) {
        System.out.println("--- 기타 정보 출력 --- ");

        System.out.println("[Remote 정보]");
        System.out.println("request.getRemoteHost() = " + request.getRemoteHost());
        System.out.println("request.getRemoteAddr() = " + request.getRemoteAddr());
        System.out.println("request.getRemotePort() = " + request.getRemotePort()); 
        System.out.println();
        System.out.println("[Local 정보]");
        System.out.println("request.getLocalName() = " + request.getLocalName()); 
        System.out.println("request.getLocalAddr() = " + request.getLocalAddr()); 
        System.out.println("request.getLocalPort() = " + request.getLocalPort());
        
        System.out.println("--- 기타 정보 출력 끝 --- ");
        System.out.println();
    }
```

요청을 보낸 곳의 주소와 포트번호, 서버의 주소와 포트번호를 확인할 수 있다.<br>


