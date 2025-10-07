---
title: 스프링 입문 3강
date: 2023-08-06 09:01:00 +09:00
categories: [Framework, Spring-1 입문]
tags:
  [
    Spring,
	입문,
	inflearn
  ]
---

> 이 글은 인프런 무료 강의인 [스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%EC%9E%85%EB%AC%B8-%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8) 을 바탕으로 작성되었습니다.<br>

## 요구사항 정의
비즈니스 요구사항<br>
데이터 : 회원ID, 이름<br>
기능 : 회원 등록, 조회<br>
저장소 : 어떤걸 사용할 지 정해지지 않음(RDB, NoSQL 등)<br>
<br>
저장소가 선정되지 않은 상태에서 개발을 해야하는 경우라면, <br>
interface를 가지고 구현을 해야한다고 합니다.<br>
추후 저장소가 정해졌을 때, 변경을 용이하게 하기 위해서입니다.<br>
또한 개발에 필요한 데이터는 '메모리 기반의 데이터 저장소'에 저장한다고 합니다.<br>

## 도메인과 리포지토리 만들기
![2023-08-04_1](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/84c89d84-9ed0-44bc-9c23-682843cd1558)<br>
도메인 패키지를 만들고, 그 안에 Member 클래스를 작성합니다.<br>
멤버 변수를 private 으로 해주고 프로퍼티(get, set)를 작성합니다.<br>
윈도우 기준으로 Alt + Insert 단축키를 누르고 'getter and setter' 선택하면<br>
자동으로 프로퍼티가 작성됩니다.<br>
<br>
![2023-08-04_2](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/8a6dbd8d-2e10-44a1-aedf-f8c1daf3ae00){: .normal}<br>
리포지토리 패키지를 만들고, 그 안에 회원등록, 조회 기능의 interface를 작성합니다.<br>
```
public interface MemberRepository {
	Member save(Member member); // 회원등록
	Optional<Member> findById(Long id); //id로 회원 조회
	Optional<Member> findByName(String Name);
	List<Member> findAll(); //모든 회원 조회
}
```
조회 기능의 리턴자료형이 Member가 아니라 Optional\<Member\>인 것을 볼 수 있습니다.<br>
\<Member\>는 그냥 generic 입니다.<br>
Optional은 리턴값이 Null 인 경우가 발생할 수도 있으면 사용한다고 합니다.<br>
<br>
윈도우 기준으로 Alt + Enter가 import 단축키 입니다.<br>

![2023-08-04_3](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/7e45d468-6db2-4505-916d-80f28f515f91){: .normal}<br>
interface를 구현합니다.<br>
눈여겨 볼만한 것은 findById 메소드의 리턴값 Optional.ofNullable(store.get(id)) 입니다.<br>
store.get(id) 리턴값은 Member 자료형입니다. <br>
이를 Optional<Member>로 바꿔주어야 하기도 하고, Null 인지 검사하기위해 Optional.ofNullable을 사용합니다.<br>
정확한 개념은 Optional 검색하면 나옵니다. 이건 그냥 대략적으로 설명한 것이고 정확한 개념이 아닙니다.<br>
<br>
```
return store.values() // store.values() 는 member 들을 말함.
		.stream() // store.values().stream() 은 member들을 Stream 객체로 만듬
		.filter(member -> member.getName().equals(name)) // Stream의 member 의 이름과 매개변수로 받은 name의 이름이 동일한 것들을 filter(걸러냄)
		.findAny();
```
그 다음은 findByName의 리턴값 입니다.<br>
store.values().stream().filter() 에서 filter의 매개변수로 람다함수가 사용되었습니다.<br>
위 코드에 작성된 람다함수는 기초적으로(?) 작성되어 있습니다. 검색하여 약간의 개념만 학습하면 이해할 수 있습니다.<br>

## 테스트 케이스 작성
테스트를 하는 방법에는 main 메소드나 컨트롤러를 통해 테스트 하는 방법이 있습니다.<br>
이 방법들은 느리고, 반복실행이 어렵고, 여러 테스트 케이스를 한번에 하기 어렵습니다.<br>
간단한 코딩을 할때만 해도 테스트하려고 main메소드를 실행했다 종료했다 하는 일을 경험한 사람들이 많을 것이라고 생각합니다.<br>
굉장히 번거롭고 실행도 오래걸린다는 것을 알 수 있습니다.<br>
JUnit 프레임워크는 위 문제들을 해결해줍니다.<br>
<br>
![2023-08-04_4](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/fa1a6ed0-c4dd-463f-8c22-62cb3ca409dc){: .normal}<br>
테스트 하려는 클래스의 경로와 동일하게 만들어 줍니다.<br>
딱히 강제성이 있는것이 아니라 알아보기 쉽게 하려고 그런것 같습니다.(추측)<br>
![2023-08-04_5](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/5dd17f01-9089-4ae2-a701-520480e6ad35){: .normal}<br>
1 : public 은 지워도 됩니다.
다른 곳에서 가져다 사용할 클래스가 아니므로 public은 지워도 무방합니다.<br>
<br>
2 : 테스트할 클래스를 생성합니다.<br>
MemroryMemberRepository 의 save, findById 등 <br>
메소드를 테스트를 하기위해 해당 클래스를 생성합니다.<br>
<br>
3 : Test 어노테이션을 작성합니다.<br>
4 : 메소드 이름은 테스트 될 메소드와 동일하게 작성합니다<br>
명명 규칙에 강제성이 있는것 같지는 않습니다.(아마도)<br>
그냥 무얼 테스트 하는지 쉽게 알 수 있도록 이름을 동일하게 주는것 같습니다<br>
![2023-08-04_6](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/deff0801-2b7c-448b-9c34-309f28ed77da){: .normal}<br>
1 : 리턴 값을 Member 로 받기
findById 의 리턴 자료형은 Optional\<Member\> 입니다.<br>
Member 자료형으로 받기 위해서 뒤에 .get() 을 사용합니다.<br>
2 : 검증하기
System.out.println(result == member) 로 결과를 확인해도 됩니다.<br>
여기서는 assertThat().isEqualTo() 를 사용했습니다.<br>
result 와 member 가 다르면, 콘솔창에 기대한 값과 실제 비교한 값이 출력이 됩니다.<br>
![2023-08-04_7](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/b75b7323-2375-4f20-859b-4203380bca8c){: .normal}<br>
Assertions 에 Alt + Enter 하면 import 되어 생략이 가능합니다.<br>

```
@Test
public void findByName() {
	Member member1 = new Member();
	member1.setName("spring1");
	repository.save(member1);
	
	Member member2 = new Member();
	member1.setName("spring2");
	repository.save(member2);
	
	Member result = repository.findByName("spring1").get();
	
	assertThat(result).isEqualTo(member1);
}

@Test
public void findAll() {
	Member member1 = new Member();
	member1.setName("spring1");
	repository.save(member1);
	
	Member member2 = new Member();
	member1.setName("spring2");
	repository.save(member2);
	
	List<Member> result = repository.findAll();
	
	assertThat(result.size()).isEqualto(2);
}
```
위 테스트 코드들은 특별한 점은 없습니다.<br>
다만 한번에 실행하면, repository 를 공유한다는 것을 알 수 있습니다.<br>
그래서 각각의 테스트가 끝나면 공유하는 자원을 초기화 시켜주어야 합니다.<br>
![2023-08-04_8](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/9b318335-5a77-4d76-a72c-f5978721baf6){: .normal}<br>
AfterEach 어노테이션은 @Test 가 끝날 때 마다 실행됩니다.<br>
AfterEach 를 작성하기 전과 작성한 후 각각 테스트를 실행하여 결과를 비교해 봅니다.<br>

## 서비스 로직 작성 
앞서 데이터 구조를 생성하고, 데이터를 저장하는 로직을 작성하였습니다.<br>
이제 서비스를 제공하는 로직을 작성합니다.<br>
매우 간단한 동작을 하기 때문에 서비스와 데이터 저장의 로직 차이는 없지만,<br>
비즈니스 서비스와 데이터 저장 등을 하나의 파일에 작성하는 것이 아닌,<br>
별개로 작성하고 관리하는 관점으로 학습하는 것이 목표인것 같습니다.<br>
![2023-08-05_9](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/11da5110-be4e-4aab-9a59-f6ad86eeba5b){: .normal}<br>
![2023-08-05_10](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/8c713a7f-8208-4afe-a5f3-a827e0fc999b){: .normal}<br>
회원가입 기능을 작성합니다. 회원가입을 할 때, 중복된 닉네임이 존재하면 예외를 발생하는 로직을 작성합니다.<br>

1 : 데이터를 저장할 객체를 생성합니다.<br>
<br>
2 : 중복된 닉네임을 검사하는 로직을 작성합니다.<br>
컨트롤 + 알트 + v 를 누르면 리턴값을 자동으로 작성해줍니다.<br>
findByName()의 리턴값이 존재하면 중복이란 뜻이므로 ifPresent 를 이용해 예외를 발생시킵니다.<br>
<br>
3 : 작성하고 보니 result 변수가 필요없습니다. 삭제합니다.<br>
<br>
4 : 중복 닉네임을 체크하는 로직을 하나의 메소드로 만듭니다.<br>
윈도우 기준 컨트롤 + 알트 + 쉬프트 + t 를 누르고 나오는 메뉴에서 Extract method 를 선택하여 새로운 메소드로 작성합니다.<br>
따로 강의에서 말씀은 안하셨지만, 제 생각엔 닉네임 중복 검사는 회원가입과 별개의 로직이므로 따로 작성한 것 같습니다.<br>
뒤에는 회원가입을 마무리합니다.<br>
<br>
![2023-08-05_11](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/951224dc-6d1e-462a-a57c-e79ca9f8bc10){: .normal}<br>
학습목표가 동작원리를 파악하는 것이므로 <br>
나머지 findMembers 와 findOne은 구색만 만들어줍니다.<br>

## 네이밍을 할 때 고려하는 것
데이터 저장 로직에서는 동작의 관점에서 네이밍을 했다면,<br>
비즈니스 로직에서는 비즈니스 관점의 네이밍을 해야합니다.<br>
예를들면 계정을 생성하는 로직의 이름을 정한다고 생각합시다.<br>
데이터 저장 로직에서는 추가(add), 저장(save) 등 의 명칭을 사용하고,<br>
비즈니스 로직에서는 회원가입(join, sign) 등의 명칭을 사용합니다.<br>

## 서비스 테스트 
![2023-08-05_12](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/06e9019d-9950-493d-a301-616fa7d1b939){: .normal}<br>
![2023-08-05_13](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/093553db-f907-48fb-9cd3-215c84101ba7){: .normal}<br>
서비스 로직을 테스트 하기위한 코드를 작성합니다.<br>
클래스 이름에 포커스를 두고 컨트롤 쉬프트 t를 누르면 테스트파일을 자동으로 생성해줍니다.<br>
테스트 파일의 경로를 보면 이전에 수동으로 만들었던 것과 동일합니다.<br>
![2023-08-05_14](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/450e5d46-6a47-4c0d-8f75-9d07717ce276){: .normal}<br>
테스트 코드를 작성할 때 Given, When, Then 세 부분으로 나누어서 작성하면 좋다고 합니다.<br>
각 부분의 의미는 단어의 뜻과 동일합니다.<br>
![2023-08-05_15](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/7f301997-fd8b-4c0f-a02e-ca89522799df){: .normal}<br>
회원가입의 기본흐름에 대한 테스트 코드는 특별한 점이 없습니다.<br>
![2023-08-05_16](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/4ec907a2-4e81-4e3d-b6ba-aa27140b0a4c){: .normal}<br>
Assertion.\* 이 기본적으로 import 되어 있지만 assertThat 을 사용할 수 없습니다.<br>
그 이유는 기본으로 import 되어있는 Assertion은 JUnit 이기 때문입니다.<br>
사용하고자 하는 assertThat 은 assertj 에 존재하기 때문에 import 해줍니다.<br>
<br>
중복 회원 테스트 <br>
테스트의 목적은 오류를 찾아 고치는 것입니다.<br>
정상흐름뿐만 아니라 비정상흐름 또한 테스트를 해야합니다.<br>
join 메소드에서 비정상 흐름에 대해 예외처리를 해두었으니,<br>
해당 예외처리가 정상 작동하는지 테스트합니다.<br>
![2023-08-05_17](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/25097b3d-2b03-4c7c-8cbc-b09ecb66da1a){: .normal}<br>
1 : 예외가 발생하는지 검사<br>
Given 에서 잘못된 값을 넘겨주었으므로 예외가 발생합니다.<br>
코드에 대해 공부하는 것이 아니라 테스트코드의 동작 과정을 공부하는 것이므로 자세한 설명은 없으셨습니다.<br>
assertThrow 에서 예외가 발생하면, 해당 예외를 리턴값으로 넘겨주는 것 같습니다.<br>
Then에서 해당 예외가 의도한 것이 맞는지 체크합니다.<br>
<br>
When 에서 try-catch 구문을 사용해도 된다고는 하셨습니다.<br>
하지만 위에 작성한 코드가 더 좋은 문법이라고 하셨습니다.<br>
이유는 따로 설명하지 않으셨습니다.<br>
try catch 단점, 문제점 을 검색하여 찾아보니 성능문제, 가독성 문제가 언급이 되었습니다.<br>
가독성은 확실히 나쁘긴합니다.<br>
성능 문제에 대한건 반복문에 try catch 문을 사용하는 경우와 그렇지 않은 경우로 나뉘는데,<br>
반복문이 아닌경우에도 성능문제가 발생할까? 라는 생각이 의문이 생깁니다. 아직은 왜 try catch 문을 사용하지 않는지 잘 모르겠습니다.<br>
<br>
![2023-08-05_18](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/a02e9274-135a-4676-8137-4d4345d4f38a){: .normal}<br>
저장소 초기화를 하려면 memberService 의 MemoryMemberRepository에 접근해야합니다.<br>
물론 그렇게 하지 않아도 가능합니다.<br>
값이 저장되는 변수인 store가 static 이므로 위 사진처럼 테스트코드에 별도의 MemoryMemberRepository를 만들어서 clearStore를 할 수 있습니다.<br>
하지만 결과적으로 보면 동일하지만, 의도와 맞지 않습니다.<br>
<br>
![2023-08-05_19](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/60b07d5a-e521-4a42-a48a-357382c2f627){: .normal}<br>
기존의 코드는 memberService 내부에 MemoryMemberRepository 객체를 생성했습니다.<br>
이를 삭제하고 대신 외부에서 매개변수로 받는 방법을 사용합니다.<br>
이렇게 작성하면 서비스로직과 데이터저장소도 분리가 되고 테스트코드에서 데이터저장소에 접근이 가능합니다.<br>

또한 이러한 방식을 DI(Dependency Injection)이라고 합니다.<br>


BeforeEach 어노테이션은 각 테스트가 실행되기 전마다 실행되는 부분입니다.<br>
코드를 읽어보면 딱히 객체가 새로 만들어져야 될 이유가 없어보입니다.<br>
그래서 사진에서와 같이 BeforeEach 밖으로 꺼내도 문제가 발생하지 않습니다.<br>

## BeforeEach에 넣는 이유
repository 의 경우 AfterEach에서 내용물을 매번 초기화 시켜주는데 왜 객체를 새로 만들까요?<br>
그것은 바로 테스트 코드에서 repository의 상태를 바꿀수도 있기 때문입니다.<br>
간단하게 예를들면 어떤 테스트에서 repository 변수에 NULL 값을 넣는다고 가정합니다.(불가능 하지만 이해하기 위해서.)<br>
그러면 해당 테스트가 종료된 후 AfterEach에서 repository의 store 변수를 초기화 한다고 해도 의미가 없습니다.<br>
