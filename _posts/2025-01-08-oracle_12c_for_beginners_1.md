---
title: "오라클 메모리 구조"
date: 2025-01-02 11:17:00 +09:00
categories: [Database, 오라클입문]
tags:
  [
    Database,
    oracle
  ]
use_math: true
---

> 이 글은 초보자를 위한 오라클 12C 를 바탕으로 작성되었습니다.

## 오라클 메모리
오라클이 사용하는 메모리는 크게 두 가지 존재합니다.<br>
- SGA (System Global Area)
- PGA (Program Global Area, Private Global Area)

SGA 는 모든 사용자가 공유하는 메모리이고, PGA 는 각각의 사용자가 개별적으로 사용하는 메모리입니다.<br>
둘 중 하나만 사용하는 개념이 아닙니다. 10명의 사용자가 접속하면 PGA 10개, SGA 1개가 오라클에 존재하게 됩니다.<br>

## PGA(Program Global Area) 의 개념
(사진1)
사용자는 SQLPLUS 또는 다양한 응용프로그램을 통해 DB에 접속하게 됩니다. 이때 사용자쪽에서 실행시킨 SQLPLUS 와 같은 프로세스를 User Process 라고 합니다. <br>
User Process 가 서버에 접속하게 되면 서버는 Server Process 를 할당하게 됩니다.<br>
- Server Process 는 User Process 에게 요청 받은 내용을 수행하기 위해 필요한 모든 작업을 수행합니다. 이때, Server Process 가 사용하는 메모리를 PGA 라고 하며 Server Process 마다 각각의 PGA 를 가지고 있습니다.

Dedicated 서버 방식에서는 위 그림에서와 같이 User Process 하나 당 Server Process 하나가 할당됩니다.<br>
<br>

## PGA 의 관리
PGA 의 크기를 잘 관리해야 Oracle 이 좋은 성능을 내게됩니다.<br>
PGA 의 크기를 수동으로 관리하는 방법과 자동으로 관리하는 방법이 있습니다.<br>
여기서는 자동으로 관리하는 방법만 설명합니다.<br>
PGA 자동관리는 Oracle 9i 부터 지원합니다.<br>
<br>
PGA 의 크기를 관리하는 파라미터중 자동관리랑 관련된 파라미터는 다음과 같습니다.<br>

| 파라미터 | 설정값 | 내용 |
|---|---|---|
|WORKAREA_SIZE_POLICY|AUTO(Default)| 수동관리를 하려면 파라미터 값에 MANUAL 을 줍니다. 따로 설정하지 않으면 Auto 값으로 되어있습니다.  자동관리인 경우 PGA_AGGREGATE_TARGER 파라미터를 이용하여 PGA 크기를 설정합니다.|
|PGA_AGGREGATE_TARGER|메모리의 10% ~ 20%|모든 세션의 PGA 크기의 합을 설정하는 파라미터이며 지정한 크기까지 PGA를 자동관리합니다.|
|PGA_AGGREGATE_LIMIT|Default| PGA_AGGREGATE_TARGER 은 실제 PGA 사용량을 제한하지 못합니다. PGA_AGGREGATE_LIMIT 파라미터를 사용하여 PGA 크기를 제한합니다.|

이게 TARGET 파라미터와 LIMIT 파라미터가 잘 이해가 안될수도 있습니다. 다른 말로 풀어서 설명하자면 이렇습니다.<br>
TARGET 은 말 그대로 목표입니다. TARGET 파라미터 값이 512MB 이면, PGA 크기가 512MB가 되도록 목표를 설정한 것입니다. 예를 들어 시험점수 목표가 90점이면 반드시 90점을 맞는게 아니라 90점이 안될수도 있고 반대로 90점을 넘을수도 있습니다. 그런 개념으로 이해하면 됩니다.<br>
LIMIT 는 말 그대로 제한을 걸어버리는 것입니다. LIMIT 파라미터 값이 2GB 이면, PGA 크기는 2GB를 넘을 수 없습니다.<br>

직접 파라미터를 변경해봅시다.
(사진2)
```
SQL> show parameter workarea_size

NAME				     TYPE	 VALUE
------------------------------------ ----------- ------------------------------
workarea_size_policy		     string	 AUTO
```

따로 설정하지 않았지만 workarea_size_policy 의 값이 AUTO 인 것을 확인할 수 있습니다. 현재 PGA 를 자동으로 관리하고 있다는 의미입니다.<br>

(사진3)

```
SQL> show parameter pga

NAME				     TYPE	 VALUE
------------------------------------ ----------- ------------------------------
pga_aggregate_limit		     big integer 2G
pga_aggregate_target		     big integer 512M
```
PGA 자동관리에 필요한 두 파라미터를 확인할 수 있습니다.<br>

사진4
사진5
```
SQL> alter system set pga_aggregate_target = 80m;

System altered.

SQL> show parameter pga

NAME				     TYPE	 VALUE
------------------------------------ ----------- ------------------------------
pga_aggregate_limit		     big integer 2G
pga_aggregate_target		     big integer 80M
```
target 의 값이 80M 으로 변경되었습니다.<br>

## SGA(System Global Area) 의 개념
SGA 는 어떤 값을 보관하길래 모든 사용자가 공유를 할까요.
SGA 의 구조는 다음과 같습니다.<br>

- Shared Pool
- Data Buffer Cache
- Redo Log Buffer
- Large Pool
- Java Pool
- Streams Pool

위 구성요소들에 대한 내용들은 다음 포스팅에 작성하겠습니다.

## SGA 의 관리
SGA 또한 PGA 처럼 수동관리 또는 자동관리를 할 수 있습니다.<br>
다만 위에서 나온 SGA 의 구성요소들에 대해 공부하고 다시 다룹니다.<br>

## 레퍼런스
초보자를 위한 오라클 12C <br>
PGA, SGA 자동관리 (https://bae9086.tistory.com/76)