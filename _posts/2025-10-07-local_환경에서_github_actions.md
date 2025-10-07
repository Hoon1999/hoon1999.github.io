---
title: "로컬 환경에서 Github Actions 테스트하기"
date: 2025-10-07 18:27:00 +09:00
categories: [Infra, AWS]
tags:
  [
    GithubActions
  ]
use_math: true
published: true
---

## 개요
매번 push 하여 Github Actions 를 테스트하고 디버깅했는데 그러다보니 커밋창이 더러워지고 시간도 오래걸렸다.<br>
이번에는 로컬환경에서 Github Actions 를 사용하는 방법을 알아본다.<br>
act 라는 소프트웨어를 사용할건데 docker 도 추가로 필요하다.<br>
Github Actions 자체가 runner 를 필요로 하는데, 이 역할을 docker 가 해줄것이다.<br>

## 설치
설치 과정은 mac 을 기준으로 한다.<br>
난 이미 docker 가 설치되어 있어 docker 설치과정은 생략한다.<br>

```
brew install act

cd 프로젝트의 루트 경로
act --list

act <- list 의 모든 workflow 가 수행된다.
```

설치 후 프로젝트의 루트 경로로 이동해 ```act --list``` 를 입력하면 ```.github/workflows``` 경로의 파일을 인식하여 목록을 출력해준다.<br>

```act``` 를 입력하면 리스트에 있는 모든 workflow 를 수행한다.<br>
만약 일부만 수행하고 싶으면 -W 옵션을 사용해서 특정 workflow 만 수행할 수 있다.<br>
```act -W 경로/워크플로명.yml ```

## 변수
당연히 github secret 같은 변수는 사용할 수 없다.<br>

{% raw %}
```
${{ secrets.PASSWORD }}
```
{% endraw %}

이런식으로 되어있을텐데 프로젝트 루트 경로에 .secrets 파일을 만들어 주고 아래와 같이 변수를 만들어주면 인식할 수 있다.<br>

```
// sercets 파일

PASSWORD="abcd"
```

물론 secrets 말고 다른 파일명도 사용할 수 있다.<br>

## 경로 
경로가 헷갈리면 아래 그림을 참고바란다.<br>

```
프로젝트/
├── .github/
    └── workflow/
        └── my_workflow.yml
└── secrets
```

## 테스트 후
로컬 테스트가 끝나면 docker 에 컨테이너가 생긴다.<br>
필요 없으면 삭제한다.<br>

<hr>

**References**<br>
[유튜브: 로컬에서 github action을 실행하는 방법](https://www.youtube.com/watch?v=qQdUFjayxYA)