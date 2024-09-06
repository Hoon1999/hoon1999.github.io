---
title: "[자료구조]인접 리스트"
date: 2024-09-06 11:17:00 +09:00
categories: [알고리즘, 공통]
tags:
  [
    자료구조,
    DataStructure,
    그래프,
    Graph,
    인접리스트,
    AdjacencyList
  ]
use_math: true
---

## 인접 리스트

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-06/adjacency_list/1.png?raw=true)<br>
인접 리스트의 개념은 위 그림과 같다.<br>
0번 노드는 1, 2, 3 번 노드와 연결되어 있다.<br>
1번 노드는 0, 2 번 노드와 연결되어 있다.(이하 생략)<br>
<br>
인접 리스트를 구현할 때는 나와 연결된 정점이 어떤 정점인지 알려주는 정보를 저장한다.<br>
예를 들어 위 그림에 나오는 0번 노드는 1, 2, 3 번 노드와 연결되어 있기 때문에 1, 2, 3 이라는 값을 연결 리스트로 구현한 것이다.<br>
0번 노드에서 1번 노드로갈 수 있고, 1번노드에서 2번 노드로 갈 수 있고, 2번 노드에서 3번 노드로 갈 수 있다는 의미가 아니다.<br>
다시 말하면 0번 노드는 1번 노드, 2번 노드, 3번 노드와 연결되어있다(인접해있다). 를 나타낸 것이다.<br>
인접 행렬과 비교하면 다음과 같다. <br>

![사진2](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2024-09-06/adjacency_list/2.png?raw=true)<br>
위 그림에 나온 인접 행렬과 인접 리스트는 거의 동일한 의미를 가지고 있다. 단지 구현 방식만 다를 뿐이다.<br>

## 뭔가 좀 이상한데..
위에서 배운대로라면 굳이 연결 리스트로 구현할 필요가 없어보인다.<br>
array 로도 표현이 가능하고 array가 되면 당연히 vector 도 가능해보인다.<br>

```cpp
int arr[4][4];
vector<int> adj[4];

int main() {
    // 작성해보니 arr 로 구현하면 낭비가 심할 듯 하다.
    arr[0][0] = 1;
    arr[0][1] = 2;
    arr[0][2] = 3;
    arr[0][3] = null; // null 개념을 따로 구현해줘야 하고 공간 낭비가 심할듯.

    adj[0].push_back(1);
    adj[0].push_back(2);
    adj[0].push_back(3);

    return 0;
}
```

실제로도 가능하다. 다만 연결리스트가 유리한 경우 리스트로 구현하고 벡터가 유리한 경우 벡터로 구현한다.<br>

## References 
[10주 완성 c++ 코딩테스트, 2-5](https://www.inflearn.com/course/10%EC%A3%BC%EC%99%84%EC%84%B1-%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%81%B0%EB%8F%8C)<br>