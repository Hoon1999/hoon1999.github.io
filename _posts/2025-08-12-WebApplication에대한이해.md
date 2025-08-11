---
title: "Web Application 에 대한 이해"
date: 2025-08-12 03:15:00 +09:00
categories: [개발, Spring 2_MVC 핵심]
tags:
  [
    Spring,
    MVC,
    inflearn,
    WAS,
    Thread
  ]
---

> 이 게시글은 인프런의 유료 강의 [스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/스프링-mvc-1)을 수강하며 공부한 내용을 담고있습니다.<br>
> 저작권에 의해 강의내용에 해당하는 전체 코드는 공개할 수 없습니다. <br>
> 저작권에 의해 모든 내용을 담을 수 없습니다. 중복 및 반복되는 내용은 생략했습니다.<br>

## Web Server 와 WAS

### HTTP
요즘은 웹에서 전송하는 것(HTML, TEXT, JSON, Image, 음성, 영상, 파일 등) 대부분을 HTTP 프로토콜을 사용하여 전송한다.<br>

### Web Server
정적 리소스(HTML, CSS, JS, Image 등) 을 가지고 있다가 전송하는 서버를 말한다.<br>
예시. Apache, NGINX<br>

### WAS(Web Application Server)
정적 리소스도 전달할 수 있고, 애플리케이션 로직을 수행하는 서버를 말한다.<br>
애플리케이션 로직 예시. 서블릿, JSP, 스프링 MVC<br>
WAS 예시. Tomcat, Jetty
<br>
WAS 가 웹 서버 기능을 포함하고 있기 때문에 WAS + DB 형태로 운영이 가능하지만, WAS 는 코드를 수행하기 때문에 웹 서버보다 부하가 높고, 죽을 가능성이 있다.<br>
그래서 역할을 분담해 정적 리소스를 응답하는 웹 서버와 애플리케이션 로직을 전담하는 WAS 로 나누어 운영한다.<br>

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-12-WebApplication에대한이해/1.png?raw=true)<br>

그림의 아래처럼 구성하면 다음과 같은 장점이 있다.<br> 
1. 정적 리소스 전송량이 많으면 웹서버만 증설하면되고 반대의 경우엔 WAS 만 증설하면 된다.
2. WAS 또는 DB 에서 장애시 웹 서버에서 사용자에게 장애 화면을 보여줄 수 있다.

WAS 하나로 구성했을때, WAS 장애가 발생하면 사용자는 서버로부터 응답이 없다는 문구가 띄워질 것이다.<br>
사용자는 영문을 알 수 없기 때문에 웹 서버를 따로 구성해서 서버쪽에서 전달하고자 하는 오류 메세지를 사용자에게 보여주는게 좋다.<br>

## Servlet
Server + Applet 을 합친 단어. 웹 서버에서 실행되는 작은 자바 프로그램이라는 의미이다.<br>
웹 서버에서 통신을 할 때 HTTP 를 주고받고 한다. 이를 하기위해서는 http 버전, date, Content-Type, Content-Length, Host, GET/POST 혹은 status code 등등.. 을 전부 작성하고 body 부분을 직접 작성해서 주고받아야한다.<br>
이러한 반복되고 고된 코드 작성을 자동으로 해주는 코드를 만들었고 그것을 servlet 이라고 이름을 붙였다.<br>

```java
@WebServlet(name = "helloServlet", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response){
        //애플리케이션 로직
        String id = request.getLoginId();
        String pw = request.getPassword();

        System.out.println("사용자가 보낸 id : " + id);
    }
}
```

이렇게 이미 만들어진 HttpServlet 을 상속받아 구현할 수 있다.<br>
브라우저에서 /hello 로 요청을 하면 HelloServlet 의 service 메서드가 수행된다.<br>
내가 직접 HTTP request 를 parsing 할 필요 없이 Servlet 컨테이너가 parsing 하여 request 에 담아서 건네준다.<br>
개발자는 service 메서드에 필요한 로직을 작성하고 필요하다면 request 객체에서 값을 꺼내서 사용할 수도 있다.<br>

![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-08-12-WebApplication에대한이해/2.png?raw=true) <br>
그림에 보이는 HTTP request 의 header 와 body 를 Servlet 컨테이너가 알아서 request 객체에 잘 보관해준다.<br>
LoginServlet 의 로직이 끝나면 응답에 필요한 메타 정보들을 알아서 만들어서 response 객체에 보관한 후 client 에게 응답해준다. 물론 개발자가 원하면 response.serXXX() 로 직접 설정할 수도 있다.<br>
이렇게 해서 개발자는 비즈니스 로직에만 집중할 수 있게된다.<br>
<br>

- Servlet 컨테이너는 Servlet 의 생성, 초기화, 호출, 종료 생명주기를 관리한다.
- Servlet 객체는 싱글톤으로 관리된다.
    - 모든 사용자는 동일한 LoginServlet 을 사용할텐데, 똑같은걸 여러개 만들필요가 없다.
    - 최초 로딩 시점에 서블릿 객체가 생성된다.
    - 공유 변수를 사용시 잘못하면 문제가 발생할 수 있다.
    - 서블릿 컨테이너 종료시 같이 종료된다.
- JSP 도 서블릿으로 변환된다.
- multi thread 를 지원한다.
    - 동시 요청이 들어오면 각각 응답을 해줄 수 있다.

## 동시 요청 - multi thread

스케줄링 개념을 안다는 가정 하에 thread 에 대한 간략한 설명<br>
- os 입장에서 process 는 자원을 가진 독립적인 실행 단위이다.
- process 를 cpu 에 할당해서 수행한다.
- 초기에는 process 당 하나의 실행 흐름을 가졌다.(process 당 하나의 thread 를 가진셈)
- thread 의 개념이 생기면서 process 하나에 여러 실행 흐름을 가지게 됐다.
- 다시 말해 process 내부에 여러 thread 가 존재할 수 있으며 서로 다른 작업을 동시에 수행할 수 있다.
- 최근 os 는 process 단위 대신 thread 단위로 스케줄링 한다고도 한다.

client 가 server 에 request 를 하면 어떻게 sevlet 을 호출할까?<br>
바로 thread 가 servlet 을 호출한다.<br>
single thread 환경에서 여러 client 가 server 에 요청을 하면 client 들은 순서를 차례대로 기다려야할 것이다.<br>
multi thread 환경이라면 바로 응답이 가능하다. 근데 다음과 같은 단점이 있다.<br>

**단점**<br>
- thread 의 생성 비용은 저렴하지 않다. 사용자가 많아지면, 속도가 느려진다.
- thread 는 컨텍스트 스위칭 비용이 발생한다. thread 를 번갈아가며 수행하니 당연하다.
- thread 직접 관리하면 무제한으로 생성될 수 있다. 그럼 자원 고갈로 서버가 죽을 수 있다.

**thread pool**<br>
pool 은 공용 자원을 모아둔 곳을 의미한다. 예를 들어 pool(수영장, 물 웅덩이) 은 공용자원(물) 을 모아둔 것이다.<br>
thread pool 은 thread 를 모아둔 웅덩이라고 생각하면 된다.<br>
client 요청 시 thread 가 생성되도록 하면 비용도 발생하고 다수의 client 가 몰릴 경우 자원 고갈로 서버가 죽을 가능성도 있다.<br>
그래서 미리 thread 를 200개 정도 만들어서 thread pool 에 보관하는 것이다.<br>
client 요청이 오면 thread pool 에서 thread 를 하나 꺼내어 client 에게 할당하고 사용이 끝나면 회수하여 thread pool 에 보관한다.<br>
이렇게 하면 서버가 죽을 일도 없고 thread 생성으로 인한 속도 저하도 예방할 수 있다.<br>
thread 가 모자라면 요청을 거부하거나 대기시킬 수 있고 기존에 할당 받은 client 는 안전하게 처리할 수 있다.<br>
<br>
중요한 것은 max thread 의 수를 얼마로 설정할 것인지가 중요하다.<br>
max thread 를 너무 작게 설정하면 서버 자원은 넘치는데 client 의 접속이 지연되고,
max thread 를 너무 크게 설정하면 서버가 죽을 수 있다.<br>
적당한 지점을 찾아야 하는데, 이는 서버 스펙에 따라 천차만별이므로 성능 테스트를 통해 적정 숫자를 찾아야 한다.<br>
성능 테스트 툴 : nGrinder, 제이미터, 아파치 ab<br>

## HTML, HTTP API, CSR, SSR 차이

### HTML
Hyper Text Markup Language<br>
말 그대로 Hyper Text 기능이 있는 Markup Language 를 말한다.<br>
Markup : 표시를 달다. (h1, p 등의 태그로 표시를 함)<br>

### 정적 리소스
변함 없는 자원(여기서는 client 와 server 가 주고 받는 자원에 해당)을 말한다.<br>
즉 html, css, js, image 등 서로 다른 사용자가 요청해도 서버는 동일한 리소스를 제공한다.<br>

### 동적 리소스
변동이 있는 자원. 예를 들어 사용자마다 다른 회원정보 페이지를 제공받는다.<br>
server 는 직접 html 등을 작성해서 사용자에게 넘긴다.<br>

### HTTP API
client 가 요청시 응답을 HTML 이 아닌 데이터만 넘기는 것을 의미한다.<br>
HTTP 상에서 데이터를 주고 받아서 HTTP API 이다.<br>
예를 들어 아무 커뮤니티 게시판을 떠올려 보자.<br>
게시판 목록 아래의 페이지 번호가 바뀔 때 마다 페이지 전체가 바뀌도록 만든 사이트도 있지만 화면은 그대로 둔채 페이지 목록만 바뀌도록 만든 사이트도 있다.<br>
후자가 필요한 HTML 이 아닌 데이터만 전달받은 경우이다.<br>
보통 JSON 형식으로 데이터를 주고 받는다.<br>

### CSR (Client Side Rendering)
클라이언트 측에서 화면을 렌더링한다는 뜻이다.<br>
화면의 일부 혹은 전체를 client 에서 그리기 위해 필요한 데이터를 server 에게 요청한다.<br>
서버는 요청받은 데이터를 JSON 형식으로 보내준다.<br>
client 는 받은 데이터로 화면을 렌더링한다.<br>
위에서 언급했던 HTTP API 기술을 사용한다.<br>
<br>
CSR 의 예시로는 React, Vue.js 등이 있다.<br>

### SSR (Server Side Rendering)
html 을 server 에서 작성하여 client 에게 전달한다는 의미이다.<br>
동적 리소스 방식을 사용한다.<br>
물론 동적 리소스로 생성한 html 내부에 js 를 넣을 수 있으므로 화면 일부는 client 에서 동적으로 변경할 수 있다.<br>
예시로는 JSP, Thymeleaf 등이 있다.<br>

### 백엔드 개발자가 서비스 개발할 때 고민해야 하는 것
1. 정적 리소스 어떻게 제공할 것인지?
2. 동적으로 제공되는 HTML 페이지를 어떻게 제공할 것인지?
3. HTTP API 를 어떻게 제공할 것인지?

## Java 백엔드 웹 기술의 역사

- 1997년, Servlet<br>
  Java 코드로 작성하기 때문에 HTML 생성이 어려움

- 1999년, JSP<br>
  HTML 생성은 편리하지만, 비즈니스 로직까지 너무 많은 역할 담당<br>
  JSP 를 가볍게 코딩해본적이 있으면 무슨의미인지 안다. 페이지 하나에 계속 코딩을 할 수 있다. 

- Servlet, JSP 를 조합한 MVC 패턴 사용<br>
  Model, View, Controller 로 역할을 나누어 개발

- MVC 프레임워크 등장<br>
  MVC 패턴이 자리잡으면서 여러 프로젝트들의 공통사항이 발생 <br>
  MVC 패턴을 프레임워크로 만들어 자동화하기 시작<br>
  예시) 스트럿츠, 웹워크, 스프링 MVC 등

- 애노테이션 기반의 스프링 MVC 등장<br>
  애노테이션을 이용해 간편하게 MVC 패턴을 구현하고 이외 기능들을 구현할 수 있게 됨.<br>
  다양한 MVC 프레임워크들 중 가장 많이 사용하게 되었다.<br>

- Spring Boot<br>
  Spring 의 여러 불편한 점을 해결해줌<br>
  WAS 서버 내장 하고 War 를 그 서버에 자동 배포한다. <br>
  즉 Jar 를 실행하면 자동으로 WAS 를 실행하고 War 를 배포해준다.<br>

## Java View Template 역사
View(즉 HTML) 을 동적으로 생성하는 기능의 역사<br>

- JSP<br>
  속도 느림, 기능 부족

- Freemarker, Velocity<br>
  속도 문제 해결, 다양한 기능

- Thymeleaf<br>
  스프링 MVC 와 강력한 기능 통합을 하고 있다.<br>
  네추럴 템플릿 : HTML 의 모양을 유지하면서 View 템플릿 적용가능<br>
  JSP 는 if 문과 같이 Java 코드가 섞여있지만 Thymeleaf 는 HTML 형태를 최대한 유지하고 있다.<br>