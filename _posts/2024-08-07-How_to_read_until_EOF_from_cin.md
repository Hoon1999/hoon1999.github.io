---
title: cin 을 통해 EOF 를 받는 방법
date: 2024-08-07 23:04:00 +09:00
categories: [개발언어, Cpp]
tags:
  [
    Cpp,
    EOF
  ]
---

자주 사용하지만 자주 잊어버려서 블로그에 기록한다.<br>
windows 터미널 환경에서 EOF 는 ctrl + z 를 입력하면 된다고 한다(안해봄)<br>
mac 터미널 환경에서 EOF 를 입력하는 단축키는 ctrl + d 이다.<br>

```cpp
int main() {
    // 숫자를 입력받는 경우
    int n;
    while(cin >> n) {
        // 숫자대신 EOF 를 받으면 반복문을 탈출한다.
    }

    // char 를 입력받는 경우
    char c;
    while(cin.get(c)) {
        // character 대신 EOF 를 받으면 반복문을 탈출한다.
    }

    // line 을 입력받는 경우
    string str;
    while(getline(cin, line)) {
        // 생략
    }
    return 0;
}
```

<hr>
**Reference**<br>
[How to read until EOF from cin in C++](https://stackoverflow.com/questions/201992/how-to-read-until-eof-from-cin-in-c)