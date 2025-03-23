---
title: "[M1 Mac] oracle 설치"
date: 2025-01-07 19:20:00 +09:00
categories: [가상환경, Docker]
tags:
  [
    가상환경,
    Docker,
    Oracle
  ]
use_math: true
---
M1 Mac 에 Oracle 을 설치할 경우 주의할 점
>현재 기준으로 Oracle 은 arm 환경에서 실행되지 않습니다. 따라서 Docker 에 Oracle 를 바로 설치해도 실행되지 않습니다. 이것도 모르고 몇 시간 동안 오류와 씨름했습니다. 부디 다른 분들은 이런 시행착오를 겪지 않길 바랍니다.
>출처: https://stackoverflow.com/questions/69069927/oracle-docker-container-not-working-properly-on-mac-m1-bigsur

Apple silicon Mac 에서 Oracle 을 설치하려면 x86/64가상 환경을 통해 설치해야합니다.

일단 도커 홈페이지에 들어가서 Docker 를 다운받고 설치해줍니다.
그리고 아래 명령어를 따라가면 됩니다.

```bash
brew install colima
```

```bash
colima start --memory 4 --arch x86_64
```

만약 다음과 같은 오류가 나온다면
```
FATA[0002] error starting vm: error at 'creating and starting': qemu is required to emulate x86_64: qemu-img not found, run 'brew install qemu' to install
```

```
brew install qemu
```
brew install qemu 를 합니다. 

> QEMU는 Quick EMUlator의 약자로 _x86, PowerPC, ARM 등을 지원하는 에뮬레이터 또는 하이퍼바이저, 버추얼라이저_이다
> (출처: 나무위키) 

설치하고 다시 colima start --memory 4 --arch x86_64 를 하면 오류없이 설치가 됩니다.
done 이 출력될 때까지 기다립니다.

```bash
docker run --restart unless-stopped --name oracle-xe -e ORACLE_PASSWORD=pass -p 1521:1521 -d gvenzl/oracle-xe
```

위 명령을 실행하면 gvenzl/oracle-xe 이미지를 pull 하기 시작합니다. 다운로드가 끝나면 해당 이미지로 컨테이너를 생성합니다.
ORACLE_PASSWORD 환경변수에 사용할 oracle 패스워드를 입력합니다.
컨테이너 생성이 끝나면 아래 명령어를 입력합니다.

```bash
docker logs -f oracle-xe
```

oracle-xe 컨테이너 로그를 볼 수 있습니다. 컨테이너가 생성되자마자 로그를 보면 oracle 이 실행되는 모습을 볼 수 있습니다. 기다리다 보면 
```
#########################
DATABASE IS READY TO USE!
#########################
```
DATABASE IS READY TO USE! 가 출력됩니다.

control + c 를 눌러 빠져나옵니다.

```bash
docker exec -it oracle-xe sqlplus
```

docker exec -it oracle-xe 로 oracle-xe 컨테이너의 터미널에 접근한 뒤 sqlplus 를 통해 Oracle db 에 접근합니다. 한줄로 작성하면 위 명령어가 됩니다.

> sqlplus 란 사용자가 SQL과 PL/SQL 을 실행하고 상호작용할 수 있도록 하는 오라클에서 개발한 Tool 입니다. 
> (출처: https://wookshin.github.io/2021/03/27/sql-plus.html)

위 명령어를 입력하면 로그인을 하게됩니다.
user-name: system
password: pass 
비밀번호는 컨테이너 생성할 때 환경변수로 준 pass 를 입력하면 됩니다. 만약 다르게 작성하였으면 그것을 넣어주시고 생략했다면 비밀번호로 oracle 을 입력해보세요.

참고자료
https://velog.io/@devsaza/M1-M2-Mac-OS%EC%97%90%EC%84%9C-Oracle-DB-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
