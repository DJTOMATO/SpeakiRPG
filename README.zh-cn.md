# Speaki RPG 桌面启动器

# ->  [English](README.md) | [日本语](README.ja.md) | [한국어](README.ko.md) | [繁体中文](README.zh-tw.md) <- 


<img width="1039" height="441" alt="image" src="https://github.com/user-attachments/assets/02184bea-65d8-4858-af07-895be0b11e77" />



#  -> [下载 / Download](https://github.com/DJTOMATO/SpeakiRPG/releases) | [加入 Discord](https://discord.gg/bruZhcwqRx) <- 

**Speaki RPG Desktop** 是一款专为网页 MMORPG **Speaki RPG** 设计的自订桌面应用程式与启动器。它能将游戏从浏览器分页中独立出来，并提供出色的 Discord 状态整合以及多种趣味功能，让你的好友能即时看到你的练等与冒险进度！

<h2 id="table-of-contents">目录</h2>

- [1. 特色亮点](#1-what-makes-it-awesome)
- [2. 附加功能](#2-additional-features)
- [3. SpeakiMod+ 实装！](#3-speakimod)
- [4. 官方开发者回应与使用规范](#4-official-developer-reaction--usage-policy)
- [5. 下载](#5-download)
- [6. 自行编译快速入门指南](#6-self-compile-quick-start-guide)
- [7. 如何使用](#7-how-to-use-it)
- [8. 注意事项](#8-good-to-know)
- [9. 想要一起协作？](#9-want-to-collaborate)
- [10. 常见问题 (FAQ)](#faq)
- [11. 致谢名单](#credits)

![Alt Text for Image](https://github.com/user-attachments/assets/162507e2-68d6-4299-b847-beab0580ef47)
---

<h2 id="1-what-makes-it-awesome">1. 特色亮点</h2>

[⬆ 返回顶部](#table-of-contents)

<img width="564" height="534" alt="image" src="https://github.com/user-attachments/assets/b4bf5c88-017e-49d5-8f75-109961c838c8" />

* **Discord Rich Presence（丰富个人状态）:** 自动在你的 Discord 个人档案中展示目前的角色名称、等级与经验值。
* **流畅体验:** 采用专用桌面外壳（Wrapper），提供更干净、更顺畅的游玩体验。
* **提升 GPU 效能:** 自动调整 GPU 设定，以获得更佳的 3D 渲染表现。
* **丰富的游戏玩法功能:** 透过 SpeakiMod+（详见下方说明）带来了多项大幅提升游戏体验的 QOL（便利性）功能！
* **即时聊天翻译:** 使用 MyMemory API 即时翻译游戏内的聊天讯息。
* **不雅字词过滤器 (Profanity Filter):** 自动屏蔽聊天中的露骨或不当用语，保持游戏内交流环境的干净友善。

<h2 id="2-additional-features">2. 附加功能</h2>

[⬆ 返回顶部](#table-of-contents)

<img width="450" height="537" alt="image" src="https://github.com/user-attachments/assets/6b5c5837-d2ca-488e-8d8c-5d0a8e63a0aa" />

- 显示附近斯皮奇数量
- 经验值追踪器（显示每分钟获得 EXP 及升至下一级的预估时间）
- 频道追踪器
- 在任何地点跳舞(不仅限于莫娜蒂姆的舞台上)
- 随处喊出「CUAYO!（啾哇唷！）」＆ 自动啾哇唷循环
- 疯狂摸头与无限疯狂摸头（单次或连续不断发射爱心光波传递心意）
- 锁定摄影机视角（重现早期 PS1 经典游戏视角）
- 穿墙视角 ViewClip（允许镜头视角穿透墙壁）
- 超高速原地旋转（打破手机才有的操作优势）
- 真·方向锁定月球漫步（锁定面向角度的同时向任意方向自由移动）
- 抽搐与超级抽搐 Shake & Super Shake（镜头跟随快速抖动以及充满活力的超狂摇摆反应）
- 神秘舞蹈 Dance Ritual（伴随节奏跳跃与爱心的同步环绕轨道舞蹈，新增逆向轨道功能）
- 旋转转盘拍照模式 Turntable photo mode（360° 连续环绕摄影机，适合截图与录影）
- 切换至其他斯皮奇的第一视角观看游戏
- 跟踪其他斯皮奇（一键自动跟随锁定的好友或附近玩家）
- 斯皮奇雷达（透过按钮或 `!players` 指令扫描附近斯皮奇的等级、距离与 ID）
- 原生游戏手把 / 控制器支援（支援 Xbox、PlayStation 与 Switch 手把，包含移动、镜头、攻击与进入传送门）
- 互动式控制器示意图与按键映射（具备即时按键发光反馈的视觉化布局与自订按键设定）
- 隐藏其他斯皮奇的名字标签
- 让斯皮奇面向镜头（方便摆 POSE 拍照）
- 钉选任务 (Quest pinning)
- 自动走向目的地（需要注意，移动期间你可能会被怪物攻击，所以你必须盯着斯皮奇）
- 点击 Mod 标题折叠 HUD（最多点击 3 次）或自由拖曳位置！
- 控制镜头缩放（`!zoom` 聊天指令）
- 语言切换（可于 English / 日本语 / 한국어 / 繁体中文 间切换）
- 不雅字词过滤器
- 即时聊天翻译（MyMemory API），设定中提供目标语言选择器与开关切换
- GMDT/开发者发言高亮（在聊天中以金色粗体视觉化突显 GMDT/开发者讯息；可在设定中开关）
- 聊天 Mention 提及通知（当有人在聊天中叫你的名字时收到可选通知）
- 聊天指令快捷键（`!dance`, `!hearts`, `!pat`, `!chowayo`, `!follow`, `!players`, `!zoom`, `!fppitch`）
- **[NEW]** 聊天时间戳记（可在聊天中切换显示 `[HH:MM:SS]` 前缀）
- **[NEW]** 自由视角 / 空拍机拍照模式（需手把控制器，可分离镜头进行电影级拍摄）
- **[NEW]** 真·第一人称视角 (POV) 模式（锁定水平视线高度的摄影机，支援自订仰俯角度）
- **[NEW]** HUD 自订：UI 缩放滑杆（80% - 130%）、毛玻璃 / 不透明度滑杆、以及重点配色选择器
- **[NEW]** HUD 背景图片（随斯皮奇等级 10 级至 50 级逐步解锁）
- **[NEW]** 单次游玩金币与水晶叶收益追踪器（即时追踪本次游戏连线期间获得的货币）
- **[NEW]** FPS 帧率与网路延迟 (Ping) 计数器
- **[NEW]** 每日重置倒数计时器（显示距离韩国时间 00:00 KST 重置的剩余时间）
- **[NEW]** 低血量危急警示（萤幕边缘红色脉冲暗角提示）
- **[NEW]** 手把触觉震动回馈（受到伤害时控制器震动）
- **[NEW]** 设定汇出 / 汇入为 JSON 档案

<img width="320" height="130" alt="image" src="https://github.com/user-attachments/assets/baef0617-c9df-4ff9-a294-78d914c67e93" />

---

<img width="254" height="177" alt="image" src="https://github.com/user-attachments/assets/8971e06c-c687-48ea-b309-8e4eaec74152" />

<h2 id="3-speakimod">3. SpeakiMod+ 实装！</h2>

[⬆ 返回顶部](#table-of-contents)

SpeakiMod+ 是基于原始 SpeakiMod 进行大幅修改与全面重构的分支版本（Fork）。我们最初分叉此专案是为了彻底清理程式码库，确保为使用者提供安全、透明且可靠的体验。自那之后，我们已将其扩展为一个拥有丰富自订功能的全新独立专案。

*法律声明：本专案依据 [BSD 3-Clause 授权条款](https://opensource.org/licenses/BSD-3-Clause) 衍生自 [Alluseri 开发的 SpeakiMod](https://github.com/Alluseri/SpeakiMod)。*

---

<h2 id="4-official-developer-reaction--usage-policy">4. 官方开发者回应与使用规范</h2>

[⬆ 返回顶部](#table-of-contents)

* 【关于官方开发者的回应】
* SpeakiMMODeveloper 的官方回应繁体中文翻译如下：

---

<img width="462" height="259" alt="devresponse" src="https://github.com/user-attachments/assets/3e96eae6-845a-43ba-9af2-18e51f038a89" />

---

* 「在不损害其他玩家权益的前提下，允许对客户端进行修改。」
* 「你可以自由使用或修改此工具。」
* 「任何会损害其他玩家权益的行为（例如自动打怪/外挂自动狩猎）仍属于惩罚对象。」
* 「处罚标准完全是主观的（也就是由我，营运者自行判断），因此玩家必须自行斟酌。」
* 「只要确定不会对其他玩家造成损害，就没有关系。」

---

因此，根据官方开发者的声明：
* **允许：** 在**不损害其他玩家或破坏游戏公平性**的前提下，允许进行客户端修改以及工具的使用与自订。
* **禁止：** 任何对其他玩家产生负面影响的行为（例如：自动打怪、挂机机器人、外挂作弊）。
* **执行方式：** 封禁标准完全取决于开发者的主观裁量权。玩家必须自行斟酌判断——只要你确定不会影响他人，通常都是允许的。使用风险由使用者自行承担。

---

<h2 id="5-download">5. 下载</h2>

[⬆ 返回顶部](#table-of-contents)

<img width="264" height="213" alt="1778253476070028" src="https://github.com/user-attachments/assets/caaa2f1c-b522-4cf6-8fa2-f44677b8db7a" />

前往 [Releases（版本发布页面）](https://github.com/DJTOMATO/SpeakiRPG/releases) 下载最新版本的安装档案。

<h2 id="6-self-compile-quick-start-guide">6. 自行编译快速入门指南</h2>

[⬆ 返回顶部](#table-of-contents)

想要自己编译并执行吗？请按照以下步骤操作：

1. **复制专案 (Clone):**

```bash
git clone https://github.com/DJTOMATO/SpeakiRPG.git
cd SpeakiRPG
```

2. **安装相依套件 (Install):**

```bash
npm install
```

3. **启动 (Launch):**

```bash
npm start
```

---

*想要打包独立安装档吗？使用 electron-builder 执行 `npm run build` 即可！*

---

<h2 id="7-how-to-use-it">7. 如何使用</h2>

[⬆ 返回顶部](#table-of-contents)

<img width="203" height="124" alt="HHUUUaybIAA5i4g" src="https://github.com/user-attachments/assets/4ba2eb21-8e70-4605-8b5d-cd6031229b29" />

1. 开启桌面客户端并登入 Speaki RPG。
2. 应用程式将自动撷取你的玩家名称、等级与经验值。
3. 你的 Discord 状态将立即更新，向好友展示你的练等成果！（也可以按下 CTRL+SHIFT+D 强制手动更新）
4. [附加功能](#2-additional-features) 将会显示在左侧。

---

<h2 id="8-good-to-know">8. 注意事项</h2>

[⬆ 返回顶部](#table-of-contents)

<img width="125" height="113" alt="DONT" src="https://github.com/user-attachments/assets/c76b1d40-e0a7-4904-b250-38b73f02db54" />

* **非官方专案：** 本专案为粉丝自制作品，与 Speaki RPG 官方原创团队无任何附属关系。专案内不包含任何游戏素材资源。
* **想参与贡献？** 非常欢迎在 GitHub 上提交贡献、回报 Bug 以及发起 Pull Request！
* **授权条款：** 本专案依据 GNU 授权条款进行授权。
* **Mod 功能显示/折叠：** 别忘了点击 Mod 标题最多 3 次即可折叠 HUD 介面！
* **官方立场摘要：** 只要不损害其他玩家权益且不影响公平游戏，客户端修改与工具使用均属允许（但处罚裁量权完全取决于官方开发者的主观判断）。

---

<h2 id="9-want-to-collaborate">9. 想要一起协作？</h2>

[⬆ 返回顶部](#table-of-contents)

<img width="235" height="236" alt="1765896114857749" src="https://github.com/user-attachments/assets/08d51e52-7f46-4a24-97d1-d4e4bfc5d114" />

想一起协作开发吗？欢迎加入我们的 [Discord 伺服器](https://discord.gg/bruZhcwqRx) 与我们联络，或在 GitHub 上 [发起 Pull Request](https://github.com/DJTOMATO/SpeakiRPG/pulls) 或 [提交 Issue 问题回报](https://github.com/DJTOMATO/SpeakiRPG/issues)！也非常欢迎繁体中文母语玩家协助修饰或校对文句！

<h2 id="faq">10. 常见问题 (FAQ)</h2>

[⬆ 返回顶部](#table-of-contents)

<img width="553" height="380" alt="1788325138168569" src="https://github.com/user-attachments/assets/819625ea-bfe4-4977-b5fc-ce72376f2177" />

**使用这个工具安全吗？我会被封锁帐号 (Ban) 吗？**
- 根据开发者的官方声明，只要不损害其他玩家权益的客户端修改都是允许的。但像自动打怪或任何给予不正当优势的功能并不在此限，可能会导致帐号被封禁。请自行斟酌并理性使用。

**可以在 Mac / Linux 上执行吗？**
- 预编译的释出版本为 Windows 专用。Mac / Linux 使用者可以参考 [自行编译快速入门指南](#6-self-compile-quick-start-guide) 尝试自行编译，不过我们并未在这些平台上进行官方测试。

**这是免费的吗？**
- 是的，完全免费且在 GNU 授权下开源。

**这会修改游戏档案或包含游戏素材资源吗？**
- 不会。这是一个独立的桌面应用包装器 / 启动器——未包含任何游戏素材资源，也不会修改任何游戏原始档案。

**为什么我的 Discord 状态没有更新？**
- 请确认在启动 Speaki RPG Desktop 之前 Discord 已开启并处于执行状态。你也可以随时按下 CTRL+SHIFT+D 强制重新整理状态。

**这与 Speaki RPG 官方团队有关联吗？**
- 没有，这是一个非官方的粉丝自制专案。

**这会带有病毒或导致我的帐号被盗吗？**
- 不会——原始码完全公开在此储存库中，任何人都能在执行前仔细检查所有程式码逻辑。如果你对预先编译的发行版有疑虑，可以参考 [自行编译快速入门指南](#6-self-compile-quick-start-guide) 直接从原始码自行建置。

**你们接受赞助/捐款吗？**
- 不接受，这是一个完全免费的专案，并且会一直保持免费。

**谁是最棒的使徒 (Apostle)？？**
- 鲁波 (Rufo)。不接受任何反驳。<img width="32" height="32" alt="image" src="https://github.com/user-attachments/assets/c30f8b97-c0e3-4bd1-bc77-742a2f9dd21f" />

**使用这个会被官方开发者封锁吗？**
- 不会——详细说明请参阅上方的 [官方开发者回应与使用规范](#4-official-developer-reaction--usage-policy) 章节。

---

<h2 id="credits">11. 致谢名单</h2>

[⬆ 返回顶部](#table-of-contents)

* **原作游戏 (Original Game):** EPID Games
* **Speaki MMO 开发:** GMDT
* **客户端与 SpeakiMod+ 开发:** Glas
* **SpeakiMod 原作者:** Alluseri
* **日语翻译:** JPN_WholesomeElfName15T
* **繁体中文 (zh-TW) 翻译:** PeiYu

**使用的同人图：**
特别感谢授权将其作品用于 UI 背景的画师们！
* [느그 유노(Yuno) - Lv. 40](https://x.com/yyakk__11)

---

## 第三方元件

* **speakimod.js** – 衍生自 [Alluseri 开发的 SpeakiMod](https://github.com/Alluseri/SpeakiMod)，采用 [BSD 3-Clause 授权条款](https://opensource.org/licenses/BSD-3-Clause)。

---

<img src="https://cdn.nest.rip/uploads/96578d20-4e61-4cab-9978-d01789edebbb.png">

