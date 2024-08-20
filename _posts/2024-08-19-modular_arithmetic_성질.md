---
title: 모듈러 산술(Modular Arithmetic) 성질
date: 2024-08-19 14:02:00 +09:00
categories: [알고리즘, 공통]
tags:
  [
    정수론,
    modular
  ]
use_math: true
---

## Modular 합동의 정의와 표기법
$ a - b = kn $ 일 때, a 와 b 는 합동이고 <br>
$ a \equiv b\ mod\ n $ 으로 표기한다. <br>
$ a \equiv b $ 가 아니다.<br>
<br>
예시) <br>
11 과 19 는 mod 4 일 때 합동이다.($ 11 - 19 = -2 * 4 $) <br>
$ 11 \equiv 19\ mod\ 4 $ 로 작성한다.<br>
<br>
예시2) <br>
5 와 -1 과 -7 은 mod 6 일 때 합동이다.<br>
($ 5 - (-1) = 1 * 6 $) → ($-1$ 을 $6$ 으로 나눈 나머지는 5이다.)<br>
($ 5 - (-7) = 2 * 6 $) → ($-7$ 을 $6$ 으로 나눈 나머지는 5이다.)<br>
$ 5 \equiv -1 \equiv -7 \ mod \ 6 $ 로 작성한다.<br>

## Modular 산술의 성질
$a\ mod\ n = (a\ mod\ n)\ mod\ n$ <br>
$(a + b)\ mod\ n = ((a\ mod\ n) + (b\ mod\ n))\ mod\ n$ <br>
$(a - b)\ mod\ n = ((a\ mod\ n) - (b\ mod\ n))\ mod\ n$ <br>
$(a * b)\ mod\ n = ((a\ mod\ n) * (b\ mod\ n))\ mod\ n$ <br>
나눗셈은 위 성질을 따르지 않는다.<br>

## Modular 나눗셈
추후보완

<hr>
**Reference**<br>
[모듈러 연산 (Modular arithmetic)](https://developer-mac.tistory.com/84)<br>
[유튜브 경희수학 정수론 강의](https://www.youtube.com/watch?v=-XgWE7ltDgs)<br>