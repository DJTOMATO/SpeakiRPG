# 스피키 RPG 데스크톱 클라이언트

[English](README.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

# [다운로드](https://github.com/DJTOMATO/SpeakiRPG/releases)

**Speaki RPG Desktop**은 브라우저 기반 MMORPG 게임인 **Speaki RPG**를 위한 맞춤형 데스크톱 앱이자 런처입니다. 브라우저 탭에서 게임을 꺼내 데스크톱에서 즐길 수 있도록 해주며, 멋진 Discord 연동 기능과 친구들이 실시간으로 게임 진행 상황을 확인할 수 있는 다양한 재미있는 기능들을 제공합니다!

<h2 id="table-of-contents">목차</h2>

- [1. 무엇이 이 제품을 멋지게 만드는 걸까요?](#1-what-makes-it-awesome)
- [2. 추가 기능](#2-additional-features)
- [3. SpeakiMod+ 구현!](#3-speakimod)
- [4. 공식 개발자 입장 및 사용 정책](#4-official-developer-reaction--usage-policy)
- [5. 다운로드](#5-download)
- [6. 자체 컴파일 빠른 시작 가이드](#6-self-compile-quick-start-guide)
- [7. 사용 방법](#7-how-to-use-it)
- [8. 알아두어야 할 사항](#8-good-to-know)
- [9. 기여하고 싶으신가요?](#9-want-to-collaborate)
- [10. 자주 묻는 질문](#faq)
- [11. 크레딧](#credits)

![Alt Text for Image](https://github.com/user-attachments/assets/162507e2-68d6-4299-b847-beab0580ef47)
---

<h2 id="1-what-makes-it-awesome">1. 무엇이 이 제품을 멋지게 만드는 걸까요?</h2>

[⬆ 맨 위로](#table-of-contents)

<img width="1255" height="649" alt="image" src="https://github.com/user-attachments/assets/94de28f6-c3bb-46ef-abb5-0fd1b055986f" />

* **Discord 풍부한 존재감:** Discord 프로필에 현재 캐릭터 이름, 레벨, 경험치를 자동으로 표시합니다.
* **부드러운 경험:** 더욱 깔끔하고 부드러운 세션을 위해 전용 데스크톱 래퍼를 제공합니다.
* **GPU 성능 향상:** 3D 렌더링을 최적화하도록 GPU 설정을 자동으로 조정합니다.
* **풍부한 게임플레이 기능:** SpeakiMod+(아래 참조) 덕분에 다양한 편의성 기능이 추가되었습니다!
* **실시간 채팅 번역**: MyMemory API를 사용하여 게임 내 채팅 메시지를 즉시 번역합니다.
* **욕설 필터**: 채팅에서 노골적이거나 부적절한 언어를 자동으로 검열하여 게임 내 소통을 깨끗하고 건전하게 유지합니다.

<h2 id="2-additional-features">2. 추가 기능</h2>

[⬆ 맨 위로](#table-of-contents)

<img width="456" height="461" alt="image" src="https://github.com/user-attachments/assets/f51d57d9-2632-4a18-960e-f641133cbd9e" />

- 주변 플레이어 수 표시
- 경험치 추적기 (분당 경험치 및 다음 레벨까지 예상 시간 표시)
- 채널 추적기
- 어디서든 춤추기
- 어디서든 "초와요!" 외치기
- 하트 이모트 및 하트 반복 모드 (단발 또는 연속 루프로 주변에 하트 생성)
- 카메라 고정 (옛날 PS1 게임처럼)
- 뷰클립 (카메라가 벽을 통과하게 함)
- 매우 빠르게 회전하세요 (모바일 독점을 무너뜨리세요)
- 방향 고정 문워크 (바라보는 시선 방향을 유지한 채 모든 방향으로 자유롭게 이동)
- 쉐이크 및 슈퍼 쉐이크 (카메라 방향 떨림 및 고속 진동 모드)
- 의식 댄스 (점프 및 하트 이모트와 연동되는 원형 궤도 댄스)
- 턴테이블 포토 모드 (스크린샷 및 영상 촬영을 위한 360도 카메라 자동 회전)
- 다른 플레이어의 시점에서 게임 보기
- 플레이어 따라가기 (원클릭으로 타겟팅한 친구나 주변 플레이어 자동 추적)
- 주변 유저 레이더 (버튼 또는 `!players` 명령어로 주변 유저의 레벨, 거리, ID 스캔)
- 게임패드 / 컨트롤러 완벽 지원 (Xbox, PlayStation, Switch 컨트롤러로 이동, 카메라 조작, 공격 및 포탈 진입)
- 인터랙티브 컨트롤러 배치도 및 키 매핑 (실시간 입력 표시 기능이 포함된 시각적 배치도 및 자유로운 키 재할당)
- 다른 플레이어의 이름표 숨기기
- 스피키를 카메라 쪽으로 돌리기 (포즈를 취할 때 유용)
- 퀘스트 고정
- 포털로 자동 이동 (자동으로 음식을 먹거나 장애물을 피하지 못하므로 플레이어가 직접 조작해야 함)
- 모드 제목을 클릭하여 HUD 접기 (최대 3회 클릭)
- 카메라 확대/축소 (채팅창에 !zoom 명령어 입력)
- 언어 전환 기능 (English / 日本語 / 한국어 중 선택 가능)
- 욕설 필터
- 설정에 대상 언어 선택기와 켜기/끄기 토글 기능을 갖춘 실시간 채팅 번역 기능(MyMemory API)을 추가했습니다.
- 게임마스터(GM) 채팅 강조 (채팅창에서 GM/개발자 메시지를 골드 및 굵은 글씨로 강조 표시 / 설정에서 토글 가능)
- 채팅 멘션 알림 (채팅창에서 내 캐릭터 이름이 언급되었을 때 알림 수신 / 설정에서 토글 가능)
- 채팅 명령어 바로가기 (`!dance`, `!hearts`, `!pat`, `!chowayo`, `!follow`, `!players`, `!zoom`, `!fppitch`)
- **[NEW]** 채팅 타임스탬프 (채팅에 `[HH:MM:SS]` 표시/숨김 기능)
- **[NEW]** 프리캠 / 드론 사진 모드 (게임패드 전용, 카메라를 분리하여 영화 같은 촬영 가능)
- **[NEW]** 1인칭 시점(FPS) 모드 (수평으로 고정된 눈높이 카메라, 각도 조절 가능)
- **[NEW]** HUD 커스터마이징: UI 크기 조절 슬라이더(80% - 130%), 글래스모피즘/불투명도 조절, 포인트 컬러 선택기
- **[NEW]** HUD 배경 이미지 (레벨 10부터 50까지 순차적 잠금 해제)
- **[NEW]** 세션 골드 & 엘리프 트래커 (현재 세션에서 획득한 재화 실시간 추적)
- **[NEW]** FPS 및 네트워크 지연(Ping) 카운터
- **[NEW]** 일일 초기화 타이머 (한국 시간 자정(00:00 KST)까지 남은 시간 표시)
- **[NEW]** 낮은 HP 경고 (화면 가장자리 붉은색 점멸 효과)
- **[NEW]** 게임패드 진동 기능 (피격 시 컨트롤러 진동)
- **[NEW]** 설정 내보내기/불러오기 (JSON 포맷)

<img width="320" height="130" alt="image" src="https://github.com/user-attachments/assets/baef0617-c9df-4ff9-a294-78d914c67e93" />

---

<img width="535" height="590" alt="image" src="https://github.com/user-attachments/assets/1e7c0c60-9576-4b3d-9828-8aeac29d0936" />

<h2 id="3-speakimod">3. SpeakiMod+ 구현!</h2>

[⬆ 맨 위로](#table-of-contents)

SpeakiMod+는 원본 SpeakiMod를 대대적으로 수정하고 완전히 개편한 포크(Fork) 프로젝트입니다. 사용자에게 안전하고 투명하며 신뢰할 수 있는 환경을 제공하기 위해 코드베이스를 철저히 정리하고자 처음 이 프로젝트를 포크했습니다. 이후 수많은 맞춤형 기능을 추가하여 완전히 새로운 프로젝트로 확장했습니다.

*법적 고지: [BSD 3-Clause 라이선스](https://opensource.org/licenses/BSD-3-Clause)에 따라 [Alluseri의 SpeakiMod](https://github.com/Alluseri/SpeakiMod)에서 파생되었습니다.*

---

<h2 id="4-official-developer-reaction--usage-policy">4. 공식 개발자 입장 및 사용 정책</h2>

[⬆ 맨 위로](#table-of-contents)

* [공식 개발자의 성명에 대하여]
* SpeakiMMODeveloper의 공식 성명에 대한 한국어 번역은 다음과 같습니다:

---

<img width="462" height="259" alt="devresponse" src="https://github.com/user-attachments/assets/3e96eae6-845a-43ba-9af2-18e51f038a89" />

---

* "다른 유저들에게 피해가 가지 않는 선의 클라이언트 조작을 허용하였습니다."
* "이 툴을 사용/개조하셔도됩니다."
* "여전히 다른 유저들에게 피해가 가는(자동 사냥 등)은 제재 대상입니다."
* "제재 기준은 완전히 주관적이라(나, 즉 운영자) 유저들이 알아서 판단해야합니다."
* "다른 유저들에게 피해가 가지 않는것이 확실하면, 아무래도 좋습니다."

---

개발자 공식 발표에 따르면 다음과 같습니다:
* **허용:** 클라이언트 수정 및 도구 사용/맞춤 설정은 **다른 사용자에게 피해를 주거나** 공정한 게임 플레이를 방해하지 않는 한 허용됩니다.
* **금지:** 다른 플레이어에게 부정적인 영향을 미치는 모든 행위(예: 자동 사냥, 봇 사용, 부정 행위).
* **시행:** 금지 기준은 전적으로 개발자의 주관적인 판단에 달려 있습니다. 사용자는 스스로 판단해야 하며, 다른 사용자에게 피해를 주지 않는다고 확신하는 경우 일반적으로 허용됩니다. 사용에 따른 책임은 사용자에게 있습니다.

---

<h2 id="5-download">5. 다운로드</h2>

[⬆ 맨 위로](#table-of-contents)

<img width="264" height="213" alt="1778253476070028" src="https://github.com/user-attachments/assets/caaa2f1c-b522-4cf6-8fa2-f44677b8db7a" />

[Releases](https://github.com/DJTOMATO/SpeakiRPG/releases)로 이동하여 최신 버전 설치 파일을 다운로드하세요.

<h2 id="6-self-compile-quick-start-guide">6. 자체 컴파일 빠른 시작 가이드</h2>

[⬆ 맨 위로](#table-of-contents)

직접 실행하고 싶으신가요? 다음 단계를 따르세요:

1. **복제:**

```bash
git clone https://github.com/DJTOMATO/SpeakiRPG.git
cd SpeakiRPG
```

2. **설치:**

```bash
npm install
```

3. **실행:**

```bash
npm start
```

---

*독립형 설치 프로그램은 `npm run build` (electron-builder)를 실행하세요!*

---

<h2 id="7-how-to-use-it">7. 사용 방법</h2>

[⬆ 맨 위로](#table-of-contents)

<img width="203" height="124" alt="HHUUUaybIAA5i4g" src="https://github.com/user-attachments/assets/4ba2eb21-8e70-4605-8b5d-cd6031229b29" />

1. 데스크톱 클라이언트를 열고 Speaki RPG에 로그인합니다.
2. 앱이 플레이어 이름, 레벨, 경험치를 자동으로 감지합니다.
3. 여러분의 노력을 뽐낼 수 있도록 Discord 상태가 즉시 업데이트됩니다! (CTRL+SHIFT+D로 강제 업데이트할 수도 있습니다)
4. [추가 기능](#2-additional-features)이 왼쪽에 표시됩니다.

---

<h2 id="8-good-to-know">8. 알아두어야 할 사항</h2>

[⬆ 맨 위로](#table-of-contents)

<img width="125" height="113" alt="DONT" src="https://github.com/user-attachments/assets/c76b1d40-e0a7-4904-b250-38b73f02db54" />

* **비공식:** 이 프로젝트는 팬이 만든 프로젝트이며 Speaki RPG 크리에이터와 공식적으로 제휴되어 있지 않습니다. 게임 에셋은 포함되어 있지 않습니다.
* **기여하고 싶으신가요?** 기여, 버그 리포트, 풀 리퀘스트는 GitHub에서 언제든지 환영합니다!
* **라이센스:** GNU 라이센스에 따라 라이센스가 부여됩니다.
* **모드 기능 가시성:** 모드 제목을 최대 3번 클릭하여 HUD를 접을 수 있다는 점을 잊지 마세요!
* **공식 입장 요약:** 다른 사용자에게 피해를 주지 않고 공정한 플레이를 방해하지 않는 한 클라이언트 수정 및 도구 사용이 허용됩니다 (단, 제재 기준은 전적으로 개발자의 주관적 판단에 따릅니다).

---

<h2 id="9-want-to-collaborate">9. 기여하고 싶으신가요?</h2>

[⬆ 맨 위로](#table-of-contents)

<img width="235" height="236" alt="1765896114857749" src="https://github.com/user-attachments/assets/08d51e52-7f46-4a24-97d1-d4e4bfc5d114" />

협업하고 싶으신가요? 저희에게 연락하거나 GitHub에 [풀 리퀘스트를 보내고](https://github.com/DJTOMATO/SpeakiRPG/pulls) [이슈를 등록](https://github.com/DJTOMATO/SpeakiRPG/issues)해 주세요! 한국어가 모국어인 분들의 문서 수정 및 번역도 언제나 환영합니다!

<h2 id="faq">10. 자주 묻는 질문</h2>

[⬆ 맨 위로](#table-of-contents)

**사용해도 안전한가요? / 밴을 당하나요?**
- 개발자의 공식 성명에 따르면 다른 플레이어에게 피해를 주지 않는 클라이언트 수정은 허용됩니다. 자동 사냥 등 다른 플레이어에게 불공정한 이점을 주는 기능은 여기에 해당되지 않으며, 밴의 대상이 될 수 있습니다. 스스로 판단하여 사용하시기 바랍니다.

**Mac / Linux에서도 사용할 수 있나요?**
- 배포되는 빌드 버전은 Windows용입니다. Mac/Linux 사용자는 [자체 컴파일 빠른 시작 가이드](#6-self-compile-quick-start-guide)를 참고하여 직접 빌드할 수 있지만, 해당 환경에서는 공식적으로 테스트되지 않았습니다.

**무료인가요?**
- 네, 완전 무료이며 GNU 라이센스로 오픈소스입니다.

**게임 파일을 수정하거나 게임 에셋을 포함하나요?**
- 아니요. 이 프로그램은 독립형 데스크톱 래퍼/런처이며, 게임 에셋은 포함되어 있지 않고 게임 파일을 수정하지도 않습니다.

**Discord 상태가 업데이트되지 않아요.**
- Speaki RPG Desktop을 실행하기 전에 Discord가 열려 있고 실행 중인지 확인하세요. CTRL+SHIFT+D로 강제 업데이트할 수도 있습니다.

**바이러스에 걸리거나 해킹당하지 않나요?**
- 아니요 — 소스 코드가 완전히 공개되어 있어 이 저장소에서 누구나 실제 동작 내용을 직접 확인할 수 있습니다. 빌드된 릴리스 버전을 신뢰할 수 없다면 [자체 컴파일 빠른 시작 가이드](#6-self-compile-quick-start-guide)를 참고하여 소스에서 직접 빌드하세요.

**기부를 받으시나요?**
- 아니요, 이 프로젝트는 무료 프로젝트이며 앞으로도 무료로 유지됩니다.

**최고의 사도는 누구입니까?**
- Lupo입니다. 더 이상의 질문은 받지 않습니다.

**이걸 사용하면 공식 개발자에게 밴당하나요?**
- 아니요 — 자세한 내용은 위의 [공식 개발자 입장 및 사용 정책](#4-official-developer-reaction--usage-policy) 섹션을 확인하세요.

**공식 Speaki RPG 팀과 제휴되어 있나요?**
- 아니요, 이 프로젝트는 비공식 팬메이드 프로젝트입니다.

---

<h2 id="credits">11. 크레딧</h2>

[⬆ 맨 위로](#table-of-contents)

* **원작 게임 (Original Game):** EPID Games
* **Speaki MMO 개발:** GMDT
* **클라이언트 및 SpeakiMod+ 코딩:** Glas
* **SpeakiMod 원작자:** Alluseri
* **일본어 번역:** JPN_건전한엘프명15T

---

## 서드파티 구성요소

* **speakimod.js** – [BSD 3-Clause 라이선스](https://opensource.org/licenses/BSD-3-Clause)에 따라 [Alluseri의 SpeakiMod](https://github.com/Alluseri/SpeakiMod)에서 파생되었습니다.

---

<img src="https://cdn.nest.rip/uploads/96578d20-4e61-4cab-9978-d01789edebbb.png">

