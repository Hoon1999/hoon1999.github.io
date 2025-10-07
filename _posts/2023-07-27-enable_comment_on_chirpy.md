---
title: chirpy comments 활성화 하는 방법
date: 2023-07-27 06:53:00 +09:00
categories: [블로그, 블로그 관련]
tags:
  [
    Chirpy,
	comments
  ]
---

## _config.yml 파일에서 comments 찾기

![2023-07-27_1](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/1a6f521f-356d-4256-901b-91978a1e0982){: .normal}
_config.yml 파일에서 comments 항목으로 가면, active 라는 항목이 있습니다.<br>
여기에 disqus | utterances | giscus 중 하나를 작성하고, 아래에 해당 항목에 대한 추가정보를 입력하면 됩니다.<br>
추가정보를 입력하는 방법은 주석에 있습니다. 저는 giscus로 했습니다.<br>
<br>

## giscus 설정하기

![2023-07-27_2](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/c03ca46d-28d4-4654-b616-fac6f9bd34e3){: .normal}
링크를 따라 들어가면 친절하게 한국어로 다 써져 있어서 읽어가면서 하면 됩니다.<br>
여기까지만 읽으셔도 충분합니다.<br>
<br>

## discussions 활성화

![2023-07-27_3](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/a7f53a05-4fb0-4774-ae6a-aade64b33bd0){: .normal}
![2023-07-27_4](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/b4ebb39d-3b6f-498d-8b45-3d3567e9c1b2){: .normal}
기본적으로 discussions은 비활성화 되어 있습니다. 설정으로 들어가 스크롤을 아래로 쭉 내리면 discussions 옵션이 있습니다. 활성화합니다.<br>

## giscus 설치

![2023-07-27_5](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/b4df9815-a924-4676-a8b0-42d70d464993){: .normal}
<https://github.com/apps/giscus> 링크로 들어가서 giscus를 설치해줍니다.<br>

![2023-07-27_6](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/11f5cdcf-3d02-484a-a932-044704430376){: .normal}

## 남은 항목 채우기
![2023-07-27_7](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/0b6da4f7-36e9-4558-9c28-c368b3158482){: .normal}
이 항목은 자동으로 설정이 안되어 있습니다. 저는 추천해주는 항목으로 설정했습니다.<br>
모든 항목을 결정하고 아래로 내려가면, script 태그가 선택한 항목에 맞게 수정되어 있습니다.<br>

## _config.yml 수정하기

![2023-07-27_8](https://github.com/Hoon1999/hoon1999.github.io/assets/100833901/46e10fd7-9cb5-40d6-8f39-95517c13a429){: .normal}
active 에 giscus를 입력하고 아래 optional이 아닌 항목들을 채워줍니다.<br>
<br>
-끝-