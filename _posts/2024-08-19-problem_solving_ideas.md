---
title: 문제해결 아이디어 
date: 2024-08-19 09:17:00 +09:00
categories: [알고리즘, 공통]
tags:
  [
    코딩테스트,
    알고리즘,
    아이디어
  ]
use_math: true
---

## 문제의 입력을 회전시켜 해결방법 생각해내기

> 문제 출처 [BOJ 3986 - 좋은 단어](https://www.acmicpc.net/problem/3986)

![문제설명](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-08-19/problem_solving/1.png?raw=true)<br>

위 사진에서 교차하는 선이 없다면 '좋은 단어'로 정한다. 그리고 좋은 단어의 개수를 찾아내는게 문제다.<br>
<br>
이 문제를 해결하는 아주 쉬운 아이디어를 얻기 위해서는 입력값을 '회전'해보는 방법이 있다.<br>
<br>

![회전](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-08-19/problem_solving/2.png?raw=true)<br>

입력을 회전하면 기본적으로 Stack 의 모양이된다.(꼭 Stack 의 모양이 생각난다고 단정할 수는 없지만 가장 기초적인 자료구조가 떠오른다고 가정한다.)<br>
Stack 자료구조를 사용한다고 가정하고 문제를 해결할 방법을 떠올려보면, 뿌요뿌요처럼 같은 문자가 붙으면 사라지게 만들어 좋은 단어임을 판별할 수 있다.<br>
<br>
문제마다 사용해야하는 자료구조가 다를 수 있다. 그렇기 때문에 다양한 자료구조에 **대입**해보며 가장 적절한 자료구조를 선택하여 문제를 해결하면 된다.<br>

<hr>
**References** <br>
입력을 회전시켜 해결방법 생각하기 ([10주완성 C++ 코딩테스트; 1-N](https://www.inflearn.com/course/10%EC%A3%BC%EC%99%84%EC%84%B1-%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%81%B0%EB%8F%8C))<br>