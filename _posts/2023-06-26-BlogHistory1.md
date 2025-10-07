---
title: Chirpy 템플릿 적용하면서 만난 오류들
date: 2023-06-26 09:28:00 +09:00
categories: [블로그, 블로그 관련]
tags:
  [
    Jekyll,
	Chirpy
  ]
---

우선 나는 프론트엔드에 대해 99%는 모르는 채로 템플릿을 적용하기 시작했다.  
1학년? 2학년?때 html에 대해 딱 한번 공부해봤다. 대충 태그 구조로 돌아가는 것만 기억한다.  
처음에는 따라만 하면 당연히 되겠지 하는 마음으로 시작 했지만, 내가 만난 에러들에 대해선 어떻게 해결해야 되는지 알려주지 않았다.  
해결하기 위해 굉장히 다양한 방법을 시도하였고, 결과적으로는 성공하긴 했지만 100% 무지식상태에서 해결한 방법이다.  
즉 야매로 해결한 것이기 때문에 잘 아는 사람 입장에서 보면 방법이 이상해 보일수도 있고, 다른 사람들은 해결이 되지 않을 수 있다.  

## 1. 깃허브랑 연결된 로컬폴더 안의 모든 파일 삭제
![2023-06-26_1](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/a6b6539c-7baa-450f-8d3d-d03f063b9e21)  
모든 파일을 삭제하라길래 냅다 삭제했더니 .git 폴더까지 같이 삭제했다.<br>
.git 폴더를 삭제하면 깃허브 원격디렉토리와 로털 디렉토리의 참조 관계가 사라진다.<br>
.git 폴더가 뭔지 몰랐던 나는 나중에서야 푸시할때 문제가 있다는 것을 알아차렸다.<br>
git을 잘 알고 있다면 명령어를 사용해 만들면 되지만, 나같이 잘 모르는 초보자는 명령어로 생성해도 괜히 찝집함이 있다.<br>

## 2. assets/js/dist/*.min.js not found
bundle exec jekyll serve 명령어를 사용해서 테스트를 해보면 아래와같은 오류를 발견할 수 있다.<br>
![2023-06-26_2](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/8ad22535-f455-4436-9b28-5e7b751ef5b4)  
home 을 누르면 home.min.js를 찾을 수 없다하고<br>
categories 를 누르면 마찬가지로 categories.min.js 를 찾을 수 없다고 한다.<br>
글을 포스팅하고 테스트 했을때 에러는 여전히 발생하지만 동작에는 영향이 없어서 상관 없는 줄 알았다.<br><br>
문제는 깃허브에 push 했을떄 Run failed: Build and Deploy 를 출력하면서 실행이 안되는게 문제였다.<br>
![2023-06-26_3](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/80f494c7-c00d-45d4-be80-df38ddafe1c6)  
<span style="color: #808080">어차피 assets/dist/js 폴더 안쓰고, _javascript 폴더에 있는 home.js 등을 참조해서 동작하는데 왜 에러가 나오냐구요 ㅠㅠ...</span><br>
_config 파일에 assets/js를 참조하는 곳을 전부 공백으로도 바꿔보고 _javascript로 바꿔도 여전히 에러가 사라지지 않았다.<span style="color: #808080">어디서 호출하는거야...</span><br>
![2023-06-26_4](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/15d6949c-295d-4c85-83a0-b7933918221a)  
결국 내가 한 해결방법은 dist폴더를 생성하고 그 안에 파일을 만들어서 에러만 회피하게 했다.<br>
혹시 몰라서 _javascript 폴더에 있는 파일 복사 붙여넣기 한 다음 이름을 min.js로 전부 바꿨다.<br>
<span style="color: #808080">덕분에 min.js파일이 뭔지도 알게되었다...</span><br>
![2023-06-26_11](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/02ae9248-23c0-454d-a3b0-a7a9ed069072)  
<span style="color: #808080">에러좀 무시하고 넘어가주면 안되겠니</span><br>
## 3. 커밋이 안되는 문제
![2023-06-26_6](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/0cb9b53d-7716-4e1c-8e44-9e33960adec9)  
2번 까지 하고 커밋을 하려고하면 변동사항이 없다고 커밋이 안된다.<br>
깃허브를 기존에 사용하는 사람이라면 이유를 알겠지만 난 처음이었기에 여기서도 매우 해맸다.<br>
<span style="color: #808080">파일이 왜 원격에 안올라가는 거야 ㅠㅠ...</span><br>
해결방법은 .gitignore 파일을 열어서 목록에서 삭제해주면 된다.<br>
![2023-06-26_5](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/566b5685-1e23-4742-8493-18f79a4dfd22)  
<span style="color: #808080">#이 주석처리인줄 알고 한거였는데 알고보니 다른 문법이었다. 결과적으론 목록에서 빠지니 문제없이 작동은 된다..</span><br>

## 4. 미래로 설정된 파일이 열리지 않는 문제
분명 포스트를 작성했음에도 불구하고 home에서 보이지 않는다.<br>
그런 상황에서 cmd 창을 보면 skiped : 미래로 설정된 파일... 이 출력된다.<br>
<span style="color: #808080">분명 오늘 날짜인데..</span><br>
![2023-06-26_7](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/3e35f483-af22-4620-9f09-bca074a70468)  
구글에서 찾아보니 _config.yml 파일에 future: true 를 넣으면 된다고 한다. future: 와 true 사이에 띄어쓰기를 반드시 해줘야 한다고 함.<br>
그런데 당췌 어디에 넣어야 되는지 몰라서 제일 위 line에 넣었더니 잘 작동된다^^.<br>

## 5. --- layout: home #index page ---
![2023-06-26_8](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/5426e63c-bbee-4843-b8da-6178e513a35f)  
이건 [여기](https://jooheekim0713.github.io/posts/%EA%B9%83%EB%B8%94%EB%A1%9C%EA%B7%B8-chirpy-theme-%EC%98%A4%EB%A5%98%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0/)를 참고했다.<br>
시키는 대로 bundle lock --add-platform x86_64-linux 를 한다.<br>
![2023-06-26_9](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/71d66114-5221-41eb-ad2e-f6b81899074b)  
그럼 Gemfile.lock 파일이 생긴다.<br>
그다음 커밋을 하려고 하면 변동사항이 없다며 안된다. 출처 블로그에서 말하는 현상과 동일하다.<br>
3번과 동일한 문제이다. .gitignore 파일을 열어서 gemfile.lock 부분을 삭제해주자. 그럼 커밋후 푸시가 가능해진다.<br>
그리고 다시 들어가면<br>
![2023-06-26_10](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/aacf8378-fc77-496b-898f-7bb831ee6bcf)  
짠!