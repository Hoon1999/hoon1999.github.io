---
title: "인접행렬"
date: 2024-09-04 11:27:00 +09:00
categories: [알고리즘, 공통]
tags:
  [
    자료구조,
    DataStructure,
    그래프,
    Graph
  ]
use_math: true
---

## 인접 행렬
인접 : 연결되어있다. <br>

인접 행렬은 그래프의 정점과 정점이 연결되어 있는지 없는지 나타내는 행렬이다.<br>

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/adjacency_matrix/1.png?raw=true)<br>
인접행렬로 나타낼 무방향(양방향) 그래프를 준비한다.<br>

![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/adjacency_matrix/2.png?raw=true)<br>
행렬을 하나 그린다.<br>

![사진3](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/adjacency_matrix/3.png?raw=true)<br>
A 와 B 가 연결되어 있으므로 True 로 표시한다. (1 : True, 0 : False);

![사진4](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/adjacency_matrix/4.png?raw=true)<br>
자기 자신을 향하는 간선이 있기 때문에 1행 1열에 True 를 넣는다.<br>

![사진5](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/adjacency_matrix/5.png?raw=true)<br>
반복해서 채워준다. 빈 곳(간선이 없는 곳)은 False 로 채워준다.<br>

![사진6](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-04/adjacency_matrix/6.png?raw=true)<br>

```cpp
int a[4][4] = {
  {1, 1, 1, 0},
  {1, 0, 1, 1},
  {1, 1, 0, 0},
  {0, 1, 0, 0}
}
```

행렬의 이름을 a 라고 하면 a[from][to]라는 2차원 배열로 표현할 수 있음을 알 수 있다.<br>

위 예시는 무방향 그래프를 예로 들었지만 단방향 그래프와 적용방법이 동일하다.<br>
from 과 to 가 표시되어 있으므로 규칙에 맞게 단방향 그래프의 간선의 값을 행렬에 채워넣으면 된다.<br>


**Reference** <br>
[10주완성 C++ 코딩테스트; 2-4](https://www.inflearn.com/course/10%EC%A3%BC%EC%99%84%EC%84%B1-%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%81%B0%EB%8F%8C) <br>
[Graph (그래프)](https://sophia2730.tistory.com/entry/Data-Structure-Graph-%EA%B7%B8%EB%9E%98%ED%94%84)
