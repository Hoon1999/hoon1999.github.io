---
title: assets/js/dist/*.min.js not found 오류
date: 2023-07-25 16:09:00 +09:00
categories: [블로그, 블로그 관련]
tags:
  [
    Chirpy,
	Error,
	Windows
  ]
---
assets/js/dist/commons.min.js not found <br>
assets/js/dist/home.min.js not found<br>
assets/js/dist/categories.min.js not found<br>
assets/js/dist/page.min.js not found<br>
assets/js/dist/post.min.js not found<br>
assets/js/dist/misc.min.js not found<br>
<br>
윈도우에선 tools/init.sh 였었나 아무튼 리눅스 명령어를 대체할 수단이 없어서
수동으로 초기화하는 과정을 수행했다.<br>
그러면 위 파일이 부족하다.<br>
그땐 방법을 도저히 몰라서 이름만 같은 더미파일을 넣어 오류를 회피했다.<br>
그렇게하면 ToC, 댓글, theme 기능 등 여러가지를 사용할 수 없었다.<br>
<br>
다음 명령어를 입력하면 위 파일들을 추가할 수 있다.<br>
```
npm install
npm run build 
```

만약 npm 명령어가 없다면 구글에 다음을 검색해서 Node.js를 설치하자<br>
```윈도우에서 NPM을 사용하기 위한 Node.js 설치하는 방법```
<br>
<br>
나만 그런건지 몰라도 에러가 발생한다.<br>
![2023-07-25_1](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/2b19f5b4-1e64-498b-a6a8-492e30883ca1){: .normal}
<br>
대충 훑어보면 차례대로 명령어를 수행하는데, 
```NODE_ENV=production npx rollup -c --bundleConfigAsCjs``` 
명령어가 동작하지 않는 것 처럼 보인다.<br>
다음 명령어를 입력한다.<br>
```
set NODE_ENV=production
npx rollup -c --bundleConfigAsCjs
```
<br>
![2023-07-25_2](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/6550d150-80bb-4b88-a211-f391ffaff865){: .normal}
<br>
정상적으로 파일이 생성된다.<br>
<br>
하지만 나만 그런걸까 ToC, theme 기능은 정상 작동하나,
댓글 기능이 안되고 mobile page에서 사이드바가 펼쳐진 상태로 나온다.<br>
```NODE_ENV=production npx rollup -c --bundleConfigAsCjs``` 에러 이후에 더 실행되는 명령어가 있는게 아닐까 생각이 든다.
<br>
정말 리눅스에서 셋팅을 하는게 백배천배낫다는 생각이 든다.