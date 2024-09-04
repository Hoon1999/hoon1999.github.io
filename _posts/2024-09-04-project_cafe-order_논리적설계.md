---
title: "[DB] 논리적 설계"
date: 2024-09-04 19:03:00 +09:00
categories: [프로젝트, 카페오더]
tags:
  [
    프로젝트 회고,
    Database,
    DB,
    논리적설계,
    Cafe Order
  ]
use_math: true
---

## 논리적 설계
**개념적 데이터 스키마**를 목표 DBMS가 처리할 수 있는 ==논리적 데이터 스키마==를 설계하는 단계<br>
<br>
*개념적 데이터 스키마: 개념적 설계에서 나온 산출물<br>
*논리적 데이터 스키마: 목표 DBMS에 맞는 스키마<br>
<br>
논리적 데이터 스키마가 만족시켜야할 요구사항<br>

* 요구사항 명세서 만족
* 무결성, 일관성 등 제약조건 만족

수행단계<br>
1. 논리적 데이터 모델 변환
2. 트랜젝션 인터페이스 설계
3. 스키마의 평가 및 정제

### 논리적 데이터 모델 변환
개념적 데이터 스키마를 목표 DBMS가 처리할 수 있는 논리적 데이터 모델로 변환한다.<br>
<br>
*개념적 데이터 스키마: 개념적 설계에서 얻은 E-R 다이어그램<br>
*목표 DBMS: 관계형 DBMS<br>
*논리적 데이터 모델: DDL로 기술된 스키마 <br>
<br>
최종 산출물이 관계형 DBMS DDL 로 기술된 스키마 이지만, 물리적 설계 단계에서 결정될 변수들 때문에 물리적 설계 단계까지 보류하는 것이 일반적이라고 한다.<br>
따라서 릴레이션 스키마까지만 작성한다.<br>
<br>
*릴레이션 스키마란?<br>

![릴레이션스키마](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/project_cafe-order/0.png?raw=true)<br>
위 사진에서 표시한 부분을 릴레이션 스키마라고 한다.<br>

### 트랜잭션 인터페이스 설계

릴레이션 스키마로 변환하는 [규칙](https://wonsjung.tistory.com/404)에 맞춰 릴레이션 스키마를 작성해준다.<br>

![사진0](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-01/project_cafe_order/1.png?raw=true)<br>

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/project_cafe-order/1.png?raw=true)<br>
'회원'과 '상품'으로 '개체 릴레이션'을 작성하고<br>
'주문'으로 릴레이션을 '관계 릴레이션'을 작성한다.<br>
상품 릴레이션을 작성하면서 기본키로 사용할 속성이 없어 '상품번호' 속성을 추가하였다.<br>
관계 릴레이션을 작성할 때는 관계를 구성하는 개체의 기본키를 외래키로 사용해야 한다. 따라서 주문 릴레이션에 '회원번호', '상품번호' 두 속성을 외래키로 추가하였다.<br>
<br>

![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/project_cafe-order/2.png?raw=true)<br>
옵션 릴레이션을 작성한다. '보유' 관계를 릴레이션으로 작성하지 않는 이유는 1:N 관계이기 때문이다.<br>
<br>

![사진3](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/project_cafe-order/3.png?raw=true)<br>
작성한 주문 릴레이션을 시뮬레이션 해보니 '상품번호', '금액' 속성을 제외한 나머지 속성이 반복해서 중복되었다.<br>

![사진4](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/project_cafe-order/4.png?raw=true)<br>
'상품번호', '금액' 속성을 새로운 릴레이션으로 만들고 다시 시뮬레이션 했다.<br>
이번에는 다중값을 가지는 속성이 생겼다.<br>

![사진5](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/project_cafe-order/5.png?raw=true)<br>
몇 번의 수정을 거쳐 최종적으로 위와 같은 릴레이션 스키마를 얻었다.<br>
<br>
상품 릴레이션과 옵션 릴레이션을 시뮬레이션 해보니 1:N 관계가 아니라 N:M 관계임을 알 수 있었다.<br>
개념적 스키마를 작성할 때 잘못 생각하고 작성한 것 같다.<br>

![사진6](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/project_cafe-order/6.png?raw=true)<br>
1:N 관계이면 1 쪽(상품 쪽)의 기본키를 N 쪽(옵션 쪽)의 외래키로 설정해야하는데, N:M 관계이므로 관계 릴레이션을 새로 추가해준다.<br>

![사진7](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/project_cafe-order/7.png?raw=true)<br> 
최종적으로 얻은 릴레이션 스키마들이다.<br>

### 스키마의 평가 및 정제
성능평가를 하는 단계<br>
다음 두 가지 기준을 가지고 평가한다.<br>
- 정량적 정보: 데이터의 크기, 처리 빈도수, 처리 작업량 등
- 성능평가 기준: 논리적 레코드의 접근, 데이터 전송량, DB의 크기 등

## References
[데이터베이스 설계](https://trillium.tistory.com/110)<br>
[데이터베이스 설계2](https://dhalsdl12.tistory.com/192)<br>
[논리적 설계 / 물리적 설계와 구현](https://wonsjung.tistory.com/404)<br>