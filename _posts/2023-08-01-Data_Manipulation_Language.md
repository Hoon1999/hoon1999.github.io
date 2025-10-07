---
title: DML 이란
date: 2023-08-01 09:23:00 +09:00
categories: [Database, 데이터베이스 이론]
tags:
  [
    DB,
	DML
  ]
---

## DML(Data Manipulation Language)
데이터를 조작하는 언어.<br>
앞서 DDL 에서 데이터를 담는 틀을 만들었습니다.<br>
해당 틀에 데이터를 담는 것이 데이터 조작의 일종입니다.<br>
<br>
데이터 조작(DM)은 다음과 같습니다.<br>
- 데이터베이스 내에 저장된 정보를 검색
- DB 에 새로운 정보를 삽입
- DB 로부터 정보를 삭제
- DB 내에 저장된 정보를 수정
<br>

DML은 두 종류로 분류됩니다.
- 절차적(proceduarl) DML
- 비절차적 DML, 선언적(declartive) DML

절차적 DML은 데이터를 구하는 방법을 직접 작성해주어야 한다고 합니다.<br>
선언적 DML은 반대로 무슨 데이터만 필요한지 작성하면 됩니다.<br>
<br>
저는 처음 공부할 때, 정의만 읽고 SQL DML 이 절차적 DML 이라고 생각했습니다.(즉, SQL DML은 선언적 DML 입니다.)<br>
예를들어 SQL DML은 ooo에서 x 조건을 만족하는 a 데이터를 보여줘 라는 방식으로 작성합니다.<br>

<br>
하지만 절차적 언어는 다음과 같습니다.<sup>[출처](https://medium.com/@su_bak/sql%EC%9D%84-%EC%99%9C-%EA%B5%AC%EC%A1%B0%EC%A0%81-%EC%A7%91%ED%95%A9%EC%A0%81-%EC%84%A0%EC%96%B8%EC%A0%81%EC%9D%B4%EB%9D%BC%EA%B3%A0-%EC%A0%95%EC%9D%98%ED%95%A0%EA%B9%8C-9a1fa8532f40)</sup><br>
> t1 테이블에서 food 컬럼의 값이 rice인 집합을 뽑아내야한다고 가정하겠습니다.<br>
<br>
예시의 결과를 SQL로 조회할 때 이렇게 사용하신 적이 있으신가요?<br>
<br>
1. t1이란 테이블에서 반복문을 사용해서 t1의 row를 처음부터 끝까지 조회하면서<br>
2. 그 중 food 컬럼의 값이 rice인 row를 분리해서 별도의 배열 메모리에 담고<br>
3. 반복문이 끝나면 이 배열 집합을 보여준다.<br>

<br>
아무튼 사용자 입장에선 선언적 DML 이 좋습니다.<br>
그로인해 선언적 DML은 DB system이 스스로 데이터에 효율적으로 접근하는 방법을 찾아야 한다는 특징이 있습니다.<br>

## SQL DML
SQL DML 의 키워드로는 select, insert, delete, update 가 있습니다.<br>
차례대로 검색, 삽입, 삭제, 수정 이라는 의미입니다.<br>
데이터를 검색(select)하려면 다음과 같이 작성합니다.
```
select <속성명> from <table명> while <조건문>
select 학번 from 출석부 while 이름='홍길동'
```
출석부 table에서 홍길동이란 이름을 가진 행의 학번을 구하려면 위처럼 작성합니다.<br>