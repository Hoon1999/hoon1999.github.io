---
title: "[mac] Java 설치 경로(JavaVirtualMachines 없는 경우)"
date: 2024-08-19 09:46:00 +09:00
categories: [개발환경, 기타]
tags:
  [
    mac,
    jdk,
    path
  ]
use_math: true
---

mac 자바 설치경로를 구글에 검색하면 /Library/Java/JavaVirtualMachines/ 에 있다는 글을 많이 찾을 수 있다.<br>
하지만 해당 디렉토리가 찾을 수 없는 경우 터미널에 echo 없이 ``` /usr/libexec/java_home ``` 만 입력하면 된다.<br>
<hr>
**References**

[Where is Java Installed on Mac OS X?](https://stackoverflow.com/questions/15826202/where-is-java-installed-on-mac-os-x)<br>