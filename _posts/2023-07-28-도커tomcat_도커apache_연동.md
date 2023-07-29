---
title: 도커 톰캣 아파치 연동
date: 2023-07-28 14:28:00 +09:00
categories: [가상환경, Docker]
tags:
  [
    가상환경,
    Docker,
    Tomcat
  ]
---


<details>
<summary>주저리주저리</summary>

처음엔 그냥 apache에 db를 연결할 수 있는줄 알았다.  <br>
그 생각이 이 설치를 완료 하는데 8시간을 걸리게 했다.  <br>
  <br>
검색을 하다보니 동적 페이지는 WAS에서 담당한다는 것을 알게되었다.  <br>
그래서 (이미 설치한)apache - WAS - (이미 설치한)mariadb 형태로 구성하려고 했다.  <br>
하지만 아무리 검색해도 나와 동일한 혹은 비슷한 환경으로 셋팅된 것을 찾을수가 없었다.  <br>
나는 host - vm(아파치) - vm(WAS) - wm(mariaDB) 즉 4대의 컴퓨터로 된 환경이다.  <br>
검색해서 나오는 결과들은 호스트 컴퓨터에 아파치와 WAS를 같이 설치해서 따라할 수 없는 경우,  <br>
스프링부트를 이용해서 세팅 방법이 달라 따라할 수 없는 경우, 환경은 나와 비슷했지만 계획까지만 하고 이후 포스팅이 없는 경우,  <br>
dockerfile로 한번에 세팅하는 경우가 있었다.  <br>
dockerfile로 한번에 세팅하는 경우는 이미 세팅한 apache와 mariaDB를 필요없어질 뿐더러 앞서 작성한 글들이 의미가 없어지게 되기 때문에  <br>
그렇게 하고싶진 않았다.  <br>
  <br>
첫번째 문제는 mod_jk를 설치하는 위치였다. 다른 포스팅들은 linux에 apache 와 WAS 를 설치하거나, 윈도우에 아파치와 WAS를 설치되어 있는 환경에서  <br>
mod_jk를 설치하고 경로 설정을 해주었다. 이경우 하나의 C드라이브에 apache 와 WAS(tomcat 등) 설치파일이 같이 공존한다.  <br>
그래서 그냥 mod_jk를 설치하고, 경로를 제약없이 줄 수 있다.  <br>
문제는 이게 원래 같은 저장장치에 존재해야만 가능한건지, 아니면 물리적으로 분리된 저장장치에서도 가능한건지 알 방법이 없었다.  <br>
그러다가 거듭된 검색 끝에 tier 2, tier 3 라는 개념을 발견하게 되었고 분리된 저장장치에서도 가능하다는 것을 알게되었다. 여기까지 3시간 걸렸다.  <br>
일단 mod_jk를 apache에 먼저 설치하겠다는 생각으로 진행하였다.  <br>
  <br>
두번째 문제는 tomcat 컨테이너 생성에 실패하는 문제였다.  <br>
도커를 이론부터 공부한 것이 아니라 필요한 부분만 습득하다보니 도커 볼륨을 설정할 때 빈 폴더여야 한다는 것을 몰랐다.  <br>
손쉽게 파일을 조작하기위해 tomcat의 공유폴더 경로를 /usr/local/tomcat 으로 지정하여 계속 실패하였다.  <br>
  <br>
세번째 문제는 내가 참고한 블로그의 글들에서 세팅하는 방법이 다 조금씩 달랐다는 점과, mod_jk 를 설치후에 생성되는 파일이 엉뚱한 곳에 생성된다는 것을 몰랐다.  <br>
내가 참고한 글들에서는 파일을 옮겨줘야 된다는 말도 없고, 심지어 어떤 글에서는 자동으로 맞는 경로에 생성된다고 했다. 당연히 여기서 문제가 생길거란 생각을 못했다.  <br>
  <br>
네번째 문제는 세팅을 하고난 이후 적용되려면 종료 후 다시 실행해야 된다는 사실을 몰랐다.  <br>
그것도 모르고 계속 의미없이 설정값만 바꿔가면서 왜 안되지?만 반복했다.  <br>
  <br>
다섯번째 문제는 설정파일의 의미를 알기가 어려운 것이었다. 솔직히 포스팅들이 대부분이 아래 코드를 해당 파일에 어디에 집어 넣어라는 식으로 써져있어서  <br>
실제 어떤 로직을 가지는지 알기(그리고 찾기)가 어려웠다. 그래도 다행히 코드가 10줄 남짓이라 원인을 찾을 수 있었다. 만약 50줄이 넘어갔다면 영영 찾지 못했을수도 있다.  <br>
그래도 원인 - 결과의 인과관계를 통해 로직을 알게 되었다.  <br>
  <br>
이후에도 몇 가지 문제사항이 있었지만 로직을 알게되어 금방 해결하였다.  <br>
tomcat의 기본 포트는 8080 인데 이것을 몰랐다. 그래서 컨테이너 바인딩할 때 80으로 바인딩 했다. server.xml에서 tomcat 포트를 80으로 변경해주었다.  <br>
이 이전까지 404 에러 페이지가 안나왔는데 정상인줄 알았다.  <br>
secret require = fasle (8009 가 listen으로 출력되지만 log에는 error가 뜬다)   <br>
127.0.0.1:8009 에 도달할 수 없는 문제. 다른 포스팅들은 하나의 호스트 내에서 굴러가다보니 localhost:8009로 파일을 주고받았다.   <br>
그런데 나는 host, apache, tomcat 각각 ip가 달라서 틀린 셋팅이었다.  <br>
host 에서 container로 갈때만 loopback 주소로 통신(?) 하는거고, container 끼리는 각자 주소로 데이터를 주고 받아야 했다. <br>
<hr>
</details>

도커 컨테이너로 생성한 apache와 tomcat을 연동을 하겠습니다.<br>

## 톰캣 컨테이너 생성
톰캣 컨테이너를 생성하기 전에 공유폴더로 사용할 폴더를 생성합니다.<br>
저는 tomcat이라는 이름의 폴더를 만들었습니다.<br>
<br>
그 다음은 apache 컨테이너를 생성하였을 때와 동일한 방법으로 tomcat 컨테이너를 만들어줍니다.<br>
사진1{: .normal} <br>
```
docker run -d --name \<이름\> -p \<호스트포트\>:\<컨테이너포트\> -v \<호스트폴더\>:\<컨테이너폴더\> \<image이름\>:\<버전\>
docker run -d --name tomcat -p 8888:8080 -v \<호스트폴더\>:/usr/local/tomcat/webapps tomcat
```
사진에는 바인딩될 tomcat의 포트가 80으로 되어있지만, 기본세팅은 8080 이므로 8080으로 하셔야 합니다. 80으로 하면 나중에 파일을 수정해야 됩니다. <br>
<br>
```docker container start tomcat```을 입력하거나, GUI에서 시작버튼을 눌러 실행합니다.<br>
웹 브라우저에서 localhost:8888 접속합니다.<br>
404에러가 나오면 정상 작동입니다. 포트를 8888:8080 이 아닌 다른걸로 설정 했다면 일단 넘어가고 아래에서 해결합니다.<br>

## Apache 에 mod_jk 설치
<sup>[출처](https://출처)</sup>
```
docker container start <컨테이너이름>
```
도커에서 apache 를 실행합니다.<br>
사진2{: .normal}
터미널로 접속합니다.<br>
<br>
```
# apt-get update
# apt-get install wget
```
mod_jk 파일을 다운받기위해 wget을 설치합니다.<br>

```
# cd /usr/local/src
# wget http://www.apache.org/dist/tomcat/tomcat-connectors/jk/tomcat-connectors-1.2.48-src.tar.gz
# tar -xzf tomcat-connectors-1.2.48-src.tar.gz
# cd tomcat-connectors-1.2.48-src/native/
```
wget 명령어로 mod_jk(톰캣 커넥터)압축 파일을 다운받습니다.<br>
tar 명령어로 압축을 해제합니다.
이후 ```./configure --with-apxs=/usr/local/apache2/bin/apxs```를 실행하면 되는데 아마 안될것입니다.<br>
에러 메세지에는 apxs 의 경로가 잘못되었다고 출력되지만, 다른 원인인 경우에도 출력됩니다.<br>
```
find <찾고자하는위치> [옵션]
# find / -name apxs
```
일단 apxs의 경로를 검색해줍니다.<br>
/usr/local/apache2/bin/apxs 경로와 동일한지 확인합니다.<br>
만약 다르다면...모르갰습니다. 저는 같았습니다.<br>
경로가 동일한데 안된다면, 아래 명령어를 설치합니다.<br>
```
# apt-get install gcc
# apt-get install libaprutil1-dev
# apt-get install make
```
gcc와 libaprutill-dev를 설치합니다.<br>
make는 이후에 필요한 명령어지만 어차피 설치할거 지금 설치합니다.<br>
<br>
그리고 다시 ./configure 명령어를 실행합니다.<br>

```
# make
# make install
```
configure 명령어 수행 후 make 명령어까지 수행하면 mod_jk설치는 끝이납니다.<br>

## Apache 설정파일 수정
```# find / -name httpd.conf```<br>
httpd.conf 수정하기위해 경로를 검색합니다.<br>
```
# vi <경로>/httpd.conf
혹은
# cd <경로>
# vi httpd.conf
```
해당 파일을 열어줍니다.<br>
```
LoadModule jk_module modules/mod_jk.so

<IfModule jk_module>
    JkWorkersFile conf/workers.properties
    JkLogFile logs/mod_jk.log
    JkLogLevel info
    JkLogStampFormat "[%y %m %d %H:%M:%S] "
    JkShmFile logs/mod_jk.shm
	JkMount /*.jsp worker1
</IfModule>
```
httpd.conf 파일 제일 아래로 내려가 위 코드를 입력합니다.<br>
들여쓰기는 안해도 됩니다.<br>
각 코드의 의미는 아래와 같습니다.<br>
```
LoadModule <모듈이름> <모듈파일경로> 
<IfModule 모듈이름>
JkWorkersFile <설정파일경로>
JkLogFile <로그파일경로>
JkMount <apache가 요청받은 파일명> <해당 파일을 요청할 서버 이름>
</IfModule>
```
JkWorkersFile 모듈이 해당 파일을 참조하여 tomcat에게 요청합니다. <br>
<br>
JkLogFile 로그파일을 남길 경로를 지정합니다. 작동이 안되는데, 원인을 찾고싶다면 여기서 확인합니다.<br>
<br>
JkMount 파일명은 \*로 주고, 확장자는 jsp로 줍니다.<br>
이러면 jsp를 요청받는 apache는 해당 요청을 worker1에게 다시 요청합니다.<br>
서버이름은 임의로 정해도 되지만 여기서는 worker1로 합니다.<br>
worker1의 주소는 workers.properties에서 지정합니다.<br>
확장자를 안주면 모든 파일을 tomcat에게 요청하게 됩니다. 이는 선택사항입니다.<br>
<br>
LoadModule 에는 경로를 module/mod_jk.so 로 주었습니다.<br>
해당 경로에 파일이 있는지 확인하기위해 ```# fine / -name mod_jk.so```를 입력합니다.<br>
<br>
사진3{: .normal}<br>
만약 위 사진처럼 apache2/modules/ 위치에 없다면 옮겨줍니다.<br>
```
# cd 압축파일폴더/apache2/modules/
# cp mod_jk.so /usr/local/apache2/modules/
```

## mod_jk 설정파일 수정
위에서 지정한 workers.properties 파일의 경로를 conf로 주었으니 conf로 이동합니다.<br>
```
# cd /usr/local/apache2/conf
# vi workers.properties
```
```
worker.list=worker1
 
worker.worker1.port=8009
worker.worker1.host=127.0.0.1
worker.worker1.type=ajp13
```
같은 경로에 workers.properties 생성하여 위 내용을 입력하고 저장합니다.<br>
아파치를 재실행합니다.<br>
오타 발생 시 아파치가 켜지지 않습니다. 뒤에서 해결합니다.<br>
<br>
## tomcat AJP 프로토콜 포트열기
server.xml 파일을 수정해야합니다.<br>
```find / -name server.xml``` 입력해서 파일경로 검색, 해당 경로로 이동합니다<br>

```vi server.xml``` 으로 파일을 수정합니다.<br>
만약 vi 명령어가 없다고 나오면, 
```
apt-get update
apt-get install vim
```
vi 에디터 설치후 server.xml 파일로 열어서 AJP 프로토콜이 적혀있는 곳으로 이동합니다.<br>
vi 에디터에 검색 기능이 있으므로 AJP를 검색해서 이동합니다.<br>
```
<!--
<Connector protocol="AJP/1.3" 
address="0.0.0.0"
port="8009" 
redirectPort="8443" 
/>
-->
```
위 내용이 적힌 부분을 찾습니다. <br>
해당 부분이 주석처리 되어있습니다. 주석을 지웁니다<br>
address 부분이 아마 처음에는 {::1}로 적혀있을겁니다.<br>
0.0.0.0 으로 수정해줍니다.<br>

톰캣 재시작한 뒤 8009 포트 열렸는지 확인합니다.<br>
사진4{: .normal}<br>
위 사진처럼 8009가 listen 상태이면 됩니다.<br>
하지만 netstat 명령어가 없다고 나올 것 입니다.<br>
```
# apt-get install net-tools
# netstat -al
```
위 명령어를 입력하여 포트가 열렸는지 확인합니다.<br>
<br>
/usr/local/tomcat/webapps/ROOT 디렉터리를 생성 후 test.jsp 파일을 생성합니다.<br>
test.jsp 파일의 내용은 ```<% out.print("this is test"0; %>``` 으로 합니다.<br>
<br>
## 정상작동 확인
아파치가 켜지지 않는다면 docker 에서 apache의 log를 확인합니다.<br>
사진5{: .normal}
저는 httpd.conf 파일에서 JkMoudle 의 설정파일 경로를 <br>
conf/workers.properties 로 주고 실제론<br>
conf/worker.properties 로 주어 오류가 발생했습니다.<br>
<br>
일단 ```localhost:8888/test.jsp```으로 들어가봅니다.<br>
만약 서버에서 전송하는 데이터가 없다고 나오면 일단 넘어갑니다.<br>
서버 포트를 잘못 설정하면 발생하는 일인데, 어차피 tomcat에 직접 접근할 이유가 없으므로 수정하지 않아도 될것같습니다.<br>
수정하는 방법은 제일 아래에 작성했습니다.<br>
만약 연결거부가 나오면 tomcat이 켜져있는지, tomcat 컨테이너의 포트번호가 8888이 맞는지 확인합니다<br>
<br>
그 다음은 아파치에서 test.jsp을 요청합니다.<br>
```localhost:8080/test.jsp```에 접속합니다.<br>
this is test 가 나오면 성공입니다. 이 외에 다른 오류가 나오면 아래 사항을 체크합니다.<br>
<br>
도커에서 tomcat의 로그를 확인합니다.<br>
사진5{: .normal}
사진과 같이 SEVERE [main] org.apache.catalina.util.LifecycleBase.handleSubClassException Failed to start component [Connetor[AJP/1.3-8009] 오류가 나온다면,<br>
tomcat의 server.xml 파일에서 AJP 부분으로 이동한 뒤 ```secretRequired="false"```를 추가해준다.<sup>[출처](https://oingdaddy.tistory.com/398)</sup><br>
<br>
apache 의 /usr/local/apache2/log/mod_jk.log 파일을 확인합니다.<br>
사진6{: .normal}
위 사진처럼 127.0.0.1:8009 에 도달하지 못할수도 있습니다.<br>
저처럼 하나의 컴퓨터에 apache와 tomcat을 설치한게 아닌, 각각의 가상머신으로 설치했다면 해당 가상머신의 주소를 주어야 합니다.<br>
다행히 컨테이너끼리는 같은 네트워크에 속해있으므로 간단하게 해결할 수 있습니다.<br>
tomcat 에서 ifconfig를 입력하여, 172.17.0.x 주소를 기억합니다.<br>
apache의 workers.properties 파일에서 worker1의 주소를 172.17.0.x로 바꿔줍니다.<br>
<br>
## tomcat 에 직접 접속이 안되는경우
저의 경우에는 컨테이너를 생성할 때 포트 바인딩을 8888:80으로 설정한게 문제였습니다.<br>
따라서 localhost:8888 로 접속을하면 tomcat의 80 port로 접근을 하게 되는데, tomcat에서는 아무런 데이터를 보내주지 않습니다.<br>
왜냐하면 톰캣은 8080 포트를 사용하여 httpd 통신을 하기 때문이었습니다.<br>
따라서 해결방법은 컨테이너를 재생성하는 방법과 8080 대신 80으로 통신하는 방법이 있습니다.<br>
저는 tomcat의 server.xml 파일에서 port가 8080 이라 적혀있는 부분으로 가서 80 으로 변경하여 해결했습니다.<br>
변경 후 재실행해줍니다.<br>

-끝-