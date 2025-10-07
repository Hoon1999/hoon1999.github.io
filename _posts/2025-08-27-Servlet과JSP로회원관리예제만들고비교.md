---
title: Servlet 과 JSP 로 회원 관리 예제 만들고 비교
date: 2025-08-27 11:00:00 +09:00
categories: [Framework, Spring-3 MVC 핵심]
tags:
  - Spring
  - inflearn
  - WAS
  - Servlet
  - JSP
---

> 이 게시글은 인프런의 유료 강의 [스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술](https://www.inflearn.com/course/스프링-mvc-1)을 수강하며 공부한 내용을 담고있습니다.<br>
> 저작권에 의해 강의내용에 해당하는 전체 코드는 공개할 수 없습니다. <br>
> 저작권에 의해 모든 내용을 담을 수 없습니다. 중복 및 반복되는 내용은 생략했습니다.<br>

## 개요
회원 정보를 관리하는 웹 애플리케이션을 Servlet 과 JSP 를 사용해 각각 만들어보고 발전과정에 대해 이해한다.<br>

## 기본세팅

회원 정보 Entity 와 Repository 를 만든다.<br>

```java
@Getter @Setter
public class Member {
    private Long id;
    private String username;
    private int age;

    public Member(String username, int age) {
        this.username = username;
        this.age = age;
    }
}
```

```java
public class MemberRepository {
    private static Map<Long, Member> store = new HashMap<>();
    private static long sequence = 0L;

    private static MemberRepository instance = new MemberRepository();

    public static MemberRepository getInstance() {
        return instance;
    }

    public Member save(Member member) {
        member.setId(++sequence);
        return store.put(member.getId(), member);
    }

    public Member findById(int id) {
        return store.get(id);
    }

    public List<Member> findAll() {
        return new ArrayList<>(store.values());
    }

    public void clearStore() {
        store.clear();
    }

}
```

## 기본세팅 테스트 코드

```java
class MemberRepositoryTest {
    MemberRepository repository = MemberRepository.getInstance();

    @AfterEach
    void afterEach() {
        repository.clearStore();
    }

    @Test
    void save() {
        // given
        Member member = new Member("hello", 20);

        // when
        Member savedMember = repository.save(member);

        // then
        Member findMember = repository.findById(1);

        Assertions.assertThat(savedMember).isSameAs(findMember);
    }

    @Test
    void findByAll() {
        // given
        Member member1 = new Member("hello", 20);
        Member member2 = new Member("hello2", 20);

        repository.save(member1);
        repository.save(member2);

        // when
        List<Member> byAll = repository.findAll();

        // then
        Assertions.assertThat(byAll.size()).isEqualTo(2);
        Assertions.assertThat(byAll).contains(member1, member2);

    }
}
```

MemberRepository 에서 CMD + Shift + t (윈도우는 아마도 ctrl + shift + t) 단축키를 입력하여 Test 클래스 생성 후 위 코드를 작성하여 테스트한다.<br>
테스트 코드에 대한 설명은 생략한다.<br>

## 동적 HTML - 회원가입 Form 만들기

username 과 age 를 입력받는 간단한 회원 가입 Form 을 만든다.<br>
Java 코드를 통해 동적으로 HTML 을 생성하여 Client 에게 전달한다.<br>

## Servlet 을 이용해 만들기

```java
@WebServlet(name = "MemberFormServlet", urlPatterns = "/servlet/members/new-form")
public class MemberFormServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        response.setCharacterEncoding("utf-8");

        PrintWriter w = response.getWriter();
        w.write("<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "   <meta charset=\"UTF-8\">\n" +
                "   <title>Title</title>\n" +
                "</head>\n" +
                "<body>\n" +
                "<form action=\"/servlet/members/save\" method=\"post\">\n" +
                "   username: <input type=\"text\" name=\"username\" />\n" +
                "   age:      <input type=\"text\" name=\"age\" />\n" +
                "   <button type=\"submit\">전송</button>\n" +
                "</form>\n" +
                "</body>\n" +
                "</html>\n");
    }
}
```

```java
@WebServlet(name = "memberSaveServlet", urlPatterns = "/servlet/members/save")
public class MemberSaveServlet extends HttpServlet {
    MemberRepository memberRepository = MemberRepository.getInstance();
    
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        int age = Integer.parseInt(request.getParameter("age"));
        
        Member member = new Member(username, age);
        memberRepository.save(member);
        
        response.setContentType("text/html");
        response.setCharacterEncoding("utf-8");
        
        PrintWriter w = response.getWriter();
        w.write("<html>\n" +
                "<head>\n" +
                "   <meta charset=\"UTF-8\">\n" +
                "</head>\n" +
                "<body>\n" +
                "성공\n" +
                "<ul>\n" +
                "   <li>id="+member.getId()+"</li>\n" +
                "   <li>username="+member.getUsername()+"</li>\n" +
                "   <li>age="+member.getAge()+"</li>\n" +
                "</ul>\n" +
                "<a href=\"/index.html\">메인</a>\n" +
                "</body>\n" +
                "</html>");
    }
}
```

```java
@WebServlet(name = "memberListServlet", urlPatterns = "/servlet/members")
public class MemberListServlet extends HttpServlet {
    MemberRepository memberRepository = MemberRepository.getInstance();
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        response.setCharacterEncoding("utf-8");
        List<Member> members = memberRepository.findAll();
        PrintWriter w = response.getWriter();
        w.write("<html>\n");
        w.write("<head>\n");
        w.write("   <meta charset=\"UTF-8\">\n");
        w.write("   <title>Title</title>\n");
        w.write("</head>\n");
        w.write("<body>\n");
        w.write("<a href=\"/index.html\">메인</a>\n");
        w.write("<table>\n");
        w.write("<thead>\n");
        w.write("   <th>id</th>\n");
        w.write("   <th>username</th>\n");
        w.write("   <th>age</th>\n");
        w.write("</thead>\n");
        w.write("<tbody>\n");
        for (Member member : members) {
            w.write("   <tr>\n");
            w.write("       <td>" +member.getId()+ "</td>\n");
            w.write("       <td>" +member.getUsername()+ "</td>\n");
            w.write("       <td>" +member.getAge()+ "</td>\n");
            w.write("   </tr>\n");
        }
        w.write("</tbody>\n");
        w.write("</table>\n");
        w.write("</body>\n");
        w.write("</html>\n");
    }
}
```

위 코드를 작성해보면 바로 알 수 있듯 Servlet 에서 HTML 코드를 생성후 반환해주면 HTML 코드를 직접 작성해야한다는 번거로움도 있고 오타로 인해 오류가 발생할 수도 있다.<br>
물론 JSP 를 이미 배운 상태라면 JSP 를 쓰면 되지 않나? 라는 생각이 든다.<br>
맞는 말이다. 왜냐하면 Servlet 을 보완해서 나온 방식 중 하나가 JSP 이기 때문이다.<br>

## 템플릿 엔진

동적으로 HTML 을 만들어서 Client 에게 반환해주는건 좋지만 매우 번거롭고 오타가 발생할 위험이있다.<br>
이때 HTML 위에 Java 코드를 추가하자는 아이디어가 떠오르고 이것을 구현한게 템플릿 엔진이다.<br>
템플릿 엔진의 예시로는 JSP, Thymeleaf, Freemarker, Velocity등이 있다.

## 웰컴 페이지 수정

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<ul>
    <li><a href="basic.html">서블릿 basic</a></li>
    <li>서블릿
        <ul>
            <li><a href="/servlet/members/new-form">회원가입(/servlet/members/new-form)</a></li>
            <li><a href="/servlet/members">회원목록(/servlet/members)</a></li>
        </ul>
    </li>
    <li>JSP
        <ul>
            <li><a href="/jsp/members/new-form.jsp">회원가입(/jsp/members/new-form.jsp)</a></li>
            <li><a href="/jsp/members.jsp">회원목록(/jsp/members.jsp)</a></li>
        </ul>
    </li>
    <li>서블릿 MVC
        <ul>
            <li><a href="/servlet-mvc/members/new-form">회원가입(/servlet-mvc/members/new-form)</a></li>
            <li><a href="/servlet-mvc/members">회원목록(/servlet-mvc/members)</a></li>
        </ul>
    </li>
    <li>FrontController - v1
        <ul>
            <li><a href="/front-controller/v1/members/new-form">회원가입(/front-controller/v1/members/new-form)</a></li>
            <li><a href="/front-controller/v1/members">회원목록(/front-controller/v1/members)</a></li>
        </ul>
    </li>
    <li>FrontController - v2
        <ul>
            <li><a href="/front-controller/v2/members/new-form">회원가입(/front-controller/v2/members/new-form)</a></li>
            <li><a href="/front-controller/v2/members">회원목록(/front-controller/v2/members)</a></li>
        </ul>
    </li>
    <li>FrontController - v3
        <ul>
            <li><a href="/front-controller/v3/members/new-form">회원가입(/front-controller/v3/members/new-form)</a></li>
            <li><a href="/front-controller/v3/members">회원목록(/front-controller/v3/members)</a></li>
        </ul>
    </li>
    <li>FrontController - v4
        <ul>
            <li><a href="/front-controller/v4/members/new-form">회원가입(/front-controller/v4/members/new-form)</a></li>
            <li><a href="/front-controller/v4/members">회원목록(/front-controller/v4/members)</a></li>
        </ul>
    </li>
    <li>FrontController - v5 - v3
        <ul>
            <li><a href="/front-controller/v5/v3/members/new-form">회원가입(/front-controller/v5/v3/members/new-form)</a></li>
            <li><a href="/front-controller/v5/v3/members">회원목록(/front-controller/v5/v3/members)</a></li>
        </ul>
    </li>
    <li>FrontController - v5 - v4
        <ul>
            <li><a href="/front-controller/v5/v4/members/new-form">회원가입(/front-controller/v5/v4/members/new-form)</a></li>
            <li><a href="/front-controller/v5/v4/members">회원목록(/front-controller/v5/v4/members)</a></li>
        </ul>
    </li>
    <li>SpringMVC - v1
        <ul>
            <li><a href="/springmvc/v1/members/new-form">회원가입(/springmvc/v1/members/new-form)</a></li>
            <li><a href="/springmvc/v1/members">회원목록(/springmvc/v1/members)</a></li>
        </ul>
    </li>
    <li>SpringMVC - v2
        <ul>
            <li><a href="/springmvc/v2/members/new-form">회원가입(/springmvc/v2/members/new-form)</a></li>
            <li><a href="/springmvc/v2/members">회원목록(/springmvc/v2/members)</a></li>
        </ul>
    </li>
    <li>SpringMVC - v3
        <ul>
            <li><a href="/springmvc/v3/members/new-form">회원가입(/springmvc/v3/members/new-form)</a></li>
            <li><a href="/springmvc/v3/members">회원목록(/springmvc/v3/members)</a></li>
        </ul>
    </li>
</ul>
</body>
</html>
```

실습에 사용되는 urlPatterns 에 쉽게 접근할 수 있도록 웰컴 페이지를 수정한다.<br>
만들지 않았다면 새로 만든다.<br>

## JSP 라이브러리 추가

```
// JSP 추가
implementation 'org.apache.tomcat.embed:tomcat-embed-jasper'
implementation 'jakarta.servlet:jakarta.servlet-api'
implementation 'jakarta.servlet.jsp.jstl:jakarta.servlet.jsp.jstl-api'
implementation 'org.glassfish.web:jakarta.servlet.jsp.jstl'
```

## JSP 를 이용해 만들기

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>new-form</title>
</head>
<body>
    <form action="/jsp/members/save.jsp" method="post">
        username: <input type="text" name="username" />
        age: <input type="text" name="age" />
        <button type="submit">전송</button>
    </form>
</body>
</html>
```

```jsp
<%@ page import="hello.servlet.member.MemberRepository" %>
<%@ page import="hello.servlet.member.Member" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    // request, response 사용 가능
    MemberRepository memberRepository = MemberRepository.getInstance();
    System.out.println("save.jsp");
    String username = request.getParameter("username");
    int age = Integer.parseInt(request.getParameter("age"));
    Member member = new Member(username, age);
    System.out.println("member = " + member);
    memberRepository.save(member);
%>
<html>
<head>
    <meta charset="UTF-8">
    <title>save</title>
</head>
<body>
성공
    <ul>
        <li>id=<%=member.getId()%></li>
        <li>username=<%=member.getUsername()%></li>
        <li>age=<%=member.getAge()%></li>
    </ul>
    <a href="/index.html">메인</a>
</body>
</html>
```

```jsp
<%@ page import="java.util.List" %>
<%@ page import="hello.servlet.member.MemberRepository" %>
<%@ page import="hello.servlet.member.Member" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    MemberRepository memberRepository = MemberRepository.getInstance();
    List<Member> members = memberRepository.findAll();
%>
<html>
<head>
    <meta charset="UTF-8">
    <title>members</title>
</head>
<body>
    <a href="/index.html">메인</a>
    <table>
        <thead>
            <th>id</th>
            <th>username</th>
            <th>age</th>
        </thead>
        <tbody>
            <%
                for (Member member : members) {
                    out.write("<tr>");
                    out.write("<td>" + member.getId() + "</td>");
                    out.write("<td>" + member.getUsername() + "</td>");
                    out.write("<td>" + member.getAge() + "</td>");
                    out.write("</tr>");
                }
            %>
        </tbody>
    </table>
</body>
</html>
```

각 파일의 경로는 다음과 같다.<br>
- webapp > jsp > members > new-form.jsp
- webapp > jsp > members > save.jsp
- webapp > jsp > members.jsp

JSP 는 이미 알고 있다고 가정하고 설명은 생략한다.<br>

Servlet 으로 동적 HTML 을 만드는 것을 보다 편리하게 하기 위해 JSP 를 쓴다고 했다.<br>
JSP 가 HTML 코드와 Java 코드를 섞어 사용할 수 있어 편리하지만 코딩하다보면 JSP 는 하나의 파일에 몇 백, 몇 천줄이나 되어버린다.<br>
그 원인 중 하나가 JSP 파일 하나에 View 와 Logic 이 혼재해있기 때문이다.<br>
이를 해결하기 위해 MVC 패턴이 등장하여 View 와 Logic 을 분리하게된다.<br>
