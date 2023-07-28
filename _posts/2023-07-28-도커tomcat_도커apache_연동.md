---
title: Docker Apache 컨테이너 생성
date: 2023-06-30 12:36:00 +09:00
categories: [가상환경, Docker]
tags:
  [
    가상환경,
    Docker,
    Apache
  ]
---

톰캣 컨테이너와 공유폴더로 사용할 폴더를 만들어 줍니다.
docker run -d --name <이름> -p <호스트포트>:<컨테이너포트> -v <호스트폴더>:<컨테이너폴더> <image이름>:<버전>
docker run -d --name tomcat -p 8888:8080 -v <호스트폴더>:/usr/local/tomcat/webapps tomcat

웹 브라우저에서 localhost:8888 접속합니다.
404에러 혹은 localhost 에서 데이터를 전송하지 않았으면 정상작동 입니다.

전송할 데이터가 없어서 이렇게 나오는게 정상입니다.

## Apache 에 mod_jk 설치
도커에서 apache 를 실행한다.
터미널로 접근한다.

```
apache2# apt-get update
apache2# apt-get install wget
```
apt-get 을 업데이트 하고, wget을 설치한다.

```
apache2# cd /usr/local/src
apache2# wget http://www.apache.org/dist/tomcat/tomcat-connectors/jk/tomcat-connectors-1.2.48-src.tar.gz
apache2# tar -xzf tomcat-connectors-1.2.48-src.tar.gz
apache2# cd tomcat-connectors-1.2.48-src/native/
```

이후 ```./configure --with-apxs=/usr/local/apache2/bin/apxs```를 실행하면 되는데 아마 안될것임.
```
apt-get install gcc
apt-get install libaprutil1-dev
apt-get install make
```
그리고 다시 configure 실행하면 잘 됨

이후 
```
make
make install
```

httpd.conf 수정
```
(중략)
```
같은 경로에 workers.properties 추가
```
(중략)
```
mod_jk.so의 위치 검색
만약 apache2/modules/ 위치에 없다면 옮겨준다.
# cd 압축파일폴더/apache2/modules/
# cp mod_jk.so /usr/local/apache2/modules/



## tomcat AJP 프로토콜 포트열기
server.xml 파일을 수정해야된다.
```find / -name server.xml``` 입력해서 파일경로 검색, 해당 경로로 이동
```vi server.xml``` 으로 파일을 수정함
만약 vi 명령어가 없다고 나오면, 
```
apt-get update
apt-get install vim
```
해당 파일로 들어가서
<Connector protocol="AJP/1.3" address="0.0.0.0" secretRequired="false" port="8009" redirectPort="8443" />
을 찾는다.
해당 부분이 주석처리 되어있다. 주석처리 삭제한다.

톰캣 재부팅한 뒤 8009 포트 열렸는지 확인한다.

netstat 설치한다
apt install net-tools

netstat -al 

localhost:8080/test.jsp 접속

끝