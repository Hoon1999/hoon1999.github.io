---
title: "actions/upload-artifact: v3 오류 해결"
date: 2025-02-04 01:18:00 +09:00
categories: [블로그 히스토리]
tags:
  [
    Chirpy,
	error
  ]
use_math: true
---

## 오류명
오류명<br>
Error: This request has been automatically failed because it uses a deprecated version of actions/upload-artifact: v3.<br>
<br>

> 로컬저장소경로/.github/workflows
위 경로로 들어가 yml 파일들을 찾는다. 모든 yml 파일을 수정해야하는지 어쩐지는 모르지만 내 경우에는 단 하나의 파일만 존재해서 해당 파일만 수정하면 해결되었다.<br>
파일을 열고 다음 사진을 참고하여 수정하면 된다.<br>

![사진1](https://github.com/Hoon1999/hoon1999.github.io/blob/main/assets/img/2025-02-04-upload-artifact_v3_오류해결/1.png?raw=true)<br>
내 경우에는 yml파일에 actions/configure-pages, actions/deploy-pages, actions/upload-pages-artifact 만 존재했기 때문에 해당 값의 버전을 최신 버전으로 수정하고 커밋해주었다. actions/cache 와 peaceiris/actions-hugo 는 yml 에 작성되어있지 않아서 따로 작성하지는 않았다.<br>
<br>
이후 더이상 오류가 발생하지 않았다. 휴~<br>

## References 
https://discourse.gohugo.io/t/build-failed-because-it-uses-a-deprecated-version-of-actions-upload-artifact-v3/53335