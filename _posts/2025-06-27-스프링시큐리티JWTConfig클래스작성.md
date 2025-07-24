---
title: "[Spring Security JWT] Config 클래스 작성"
date: 2025-06-27 14:10:00 +09:00
categories: [개발, Spring Security JWT]
tags:
  [
    Spring,
    Security,
    JWT
  ]
---

> 이 게시글은 개발자 유미님의 유튜브 무료강의 [스프링 시큐리티 JWT 3 : Security Config 클래스](https://www.youtube.com/watch?v=A3YsWHGbeZQ&list=PLJkjrxxiBSFCcOjy0AAVGNtIa08VLk1EJ&index=3)을 수강하며 공부한 내용을 담고있습니다.<br>
> 이 게시글은 공부한 내용을 제가 보기 편하게 정리한 내용이므로 정확한 정보는 위 영상을 시청해주세요.<br>

이 게시글은 기본적인 Spring 기본 실습을 해봤다는 가정하에 기초적인 설명은 생략되어 있습니다.<br>
또한 실습을 따라가며 기본적인 JWT 사용방법을 학습하기에 상세한 원리와 설명은 없는 경우가 있습니다.<br>

## Config 클래스 생성

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
}
```

Spring Security 에 대해 설정을 담당하는 Config 클래스를 위와같이 작성한다.<br>
Config 클래스들에 공통적으로 작성하는 @Configuration 어노테이션을 작성하고 Spring Security 활성화 할 수 있게 @EnableWebSecurity 를 작성해준다.<br>

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // csrf, authorize, session 등 설정
        return http.build();
    }
}
```

csrf, 인가, 세션 등을 설정하기 위해 SecurityConfig 내부에 위 메서드를 작성한다.<br>
HttpSecurity 를 매개변수로 받고 SecurityFilterChain 을 return 한다.<br>
return 하는 값은 매개변수 http 를 build() 해주면된다.<br>


```java
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // 1. csrf disable
        http.csrf((auth) -> auth.disable());

        // 2. form 로그인 방식 disable
        http.formLogin((auth) -> auth.disable());

        // 3. http basic 인증 방식 disable
        http.httpBasic((auth) -> auth.disable());

        // 4. 요청 경로별 인가 작업
        http.authorizeHttpRequests((auth) -> auth
                .requestMatchers("/login", "/", "/join").permitAll()
                .requestMatchers("/admin").hasRole("ADMIN")
                .anyRequest().authenticated());

        // 5. session 을 stateless 로 설정
        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
```

1. csrf disable <br>
    JWT 은 session 을 stateless 방식을 사용하기 때문에 csrf 공격으로부터 안전하다.<br>
    csrf 가 enable 되어있으면 여러 보안 요구사항을 만족해야하는데, 실습에선 귀찮기 때문에 disable 해준다.<br>
2. form 로그인 방식 disable
3. http basic 인증 방식 disable <br>
    JWT 로그인 방식을 이용하기 때문에 form 로그인 방식, http basic 인증 방식을 disable 한다.<br>
    form 로그인 방식은 session 기반이라 JWT 에서는 사용하지 않는다. 따라서 비활성화한다.<br>
    http basic 은 HTTP 헤더에 ID/PW 를 보내는 방식이라 보안상 취약하다. 사용도 안하는거 비활성화한다.<br>
4. 요청 경로별 인가 작업 <br>
    사용자 요청별로 어떻게 인가를 해줄건지 작성하는 부분이다.<br>
    /login, /, /join 경로에 접근하면 permitAll (모든 권한을 허용)하고<br>
    /admin 에 접근하면 hasRole ADMIN(ADMIN 권한을 가진자만 허용)하고<br>
    anyRequest(이외의 요청)에는 authenticated (인가된 사용자 즉 로그인된 사용자)만 허용한다.<br>
5. session 을 stateless 로 설정 <br>
    JWT 는 session 을 stateless 로 관리하므로 바꿔준다.<br>

<br>
그 다음 bCryptPasswordEncoder 을 빈으로 작성해준다. <br>

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // csrf, authorize, session 등 설정
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

사용자 비밀번호를 암호화 하기위해 위의 단방향 해시 함수를 SecurityConfig 에 등록해줄것이다.<br>
Spring Security 에는 암호화 함수를 주입받는 ``` @Autowired PasswordEncoder ``` 코드가 있다.<br>
따라서 PasswordEncoder 에 주입할 Bean 을 작성해준다.<br>
PasswordEncoder 을 상속받는 여러 암호화 함수중 BCryptPasswordEncoder 를 선택한다.<br>
이제 PasswordEncoder 가 생성될 때 BCryptPasswordEncoder 를 주입하게 된다.<br>

<br>
<hr>
이전 포스팅 : [기본세팅](https://hoon1999.github.io/posts/스프링시큐리티JWT기본세팅/)<br>
다음 포스팅 : [회원정보 테이블 작성](https://hoon1999.github.io/posts/스프링시큐리티JWT회원정보테이블작성/)<br>