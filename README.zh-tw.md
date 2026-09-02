# Speaki RPG 桌面客戶端

# ->  [English](README.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [繁體中文](README.zh-tw.md) <- 


<img width="1039" height="441" alt="image" src="https://github.com/user-attachments/assets/02184bea-65d8-4858-af07-895be0b11e77" />



#  -> [下載 / Download](https://github.com/DJTOMATO/SpeakiRPG/releases) <- 

**Speaki RPG Desktop** 是一款專為網頁 MMORPG **Speaki RPG** 設計的自訂桌面應用程式與啟動器。它能將遊戲從瀏覽器分頁中獨立出來，並提供出色的 Discord 狀態整合以及多種趣味功能，讓你的好友能即時看到你的練等與冒險進度！

<h2 id="table-of-contents">目錄</h2>

- [1. 特色亮點](#1-what-makes-it-awesome)
- [2. 附加功能](#2-additional-features)
- [3. SpeakiMod+ 實裝！](#3-speakimod)
- [4. 官方開發者回應與使用規範](#4-official-developer-reaction--usage-policy)
- [5. 下載](#5-download)
- [6. 自行編譯快速入門指南](#6-self-compile-quick-start-guide)
- [7. 如何使用](#7-how-to-use-it)
- [8. 注意事項](#8-good-to-know)
- [9. 想要一起協作？](#9-want-to-collaborate)
- [10. 常見問題 (FAQ)](#faq)
- [11. 致謝名單](#credits)

![Alt Text for Image](https://github.com/user-attachments/assets/162507e2-68d6-4299-b847-beab0580ef47)
---

<h2 id="1-what-makes-it-awesome">1. 特色亮點</h2>

[⬆ 返回頂部](#table-of-contents)

<img width="1255" height="649" alt="image" src="https://github.com/user-attachments/assets/94de28f6-c3bb-46ef-abb5-0fd1b055986f" />

* **Discord Rich Presence（豐富個人狀態）:** 自動在你的 Discord 個人檔案中展示目前的角色名稱、等級與經驗值。
* **流暢體驗:** 採用專用桌面外殼（Wrapper），提供更乾淨、更順暢的遊玩體驗。
* **提升 GPU 效能:** 自動調整 GPU 設定，以獲得更佳的 3D 渲染表現。
* **豐富的遊戲玩法功能:** 透過 SpeakiMod+（詳見下方說明）帶來了多項大幅提升遊戲體驗的 QOL（便利性）功能！
* **即時聊天翻譯:** 使用 MyMemory API 即時翻譯遊戲內的聊天訊息。
* **不雅字詞過濾器 (Profanity Filter):** 自動屏蔽聊天中的露骨或不當用語，保持遊戲內交流環境的乾淨友善。

<h2 id="2-additional-features">2. 附加功能</h2>

[⬆ 返回頂部](#table-of-contents)

<img width="456" height="461" alt="image" src="https://github.com/user-attachments/assets/f51d57d9-2632-4a18-960e-f641133cbd9e" />

- 顯示附近玩家數量
- 經驗值追蹤器（顯示每分鐘獲得 EXP 及升至下一級的預估時間）
- 頻道追蹤器
- 隨處跳舞
- 隨處喊出「Chowayo!（超喜歡！）」
- 愛心綻放與愛心循環模式（單次或連續不斷發射愛心光效傳遞心意）
- 鎖定攝影機視角（重現早期 PS1 經典遊戲視角）
- 穿牆視角 ViewClip（允許鏡頭視角穿透牆壁）
- 極速旋轉（打破手機端的操作優勢）
- 真·方向鎖定月球漫步（鎖定面向角度的同時向任意方向自由移動）
- 搖擺與超級搖擺 Shake & Super Shake（鏡頭跟隨快速抖動以及充滿活力的超狂搖擺反應）
- 祭典之舞 Dance Ritual（伴隨節奏跳躍與愛心的同步環繞軌道舞蹈）
- 旋轉轉盤拍照模式 Turntable photo mode（360° 連續環繞攝影機，適合截圖與錄影）
- 切換至其他玩家的第一視角觀看遊戲
- 跟隨玩家（一鍵自動跟隨鎖定的好友或附近玩家）
- 玩家雷達（透過按鈕或 `!players` 指令掃描附近玩家的等級、距離與 ID）
- 原生遊戲手把 / 控制器支援（支援 Xbox、PlayStation 與 Switch 手把，包含移動、鏡頭、攻擊與進入傳送門）
- 互動式控制器示意圖與按鍵映射（具備即時按鍵發光反饋的視覺化佈局與自訂按鍵設定）
- 隱藏其他玩家的名字標籤
- 讓 Speaki 面向鏡頭（方便擺 POSE 拍照）
- 釘選任務 (Quest pinning)
- 自動走向傳送門（需有人在旁看顧，因不具備自動吃補品與避開障礙物功能）
- 點擊 Mod 標題折疊 HUD（最多點擊 3 次）或自由拖曳位置！
- 控制鏡頭縮放（`!zoom` 聊天指令）
- 語言切換（可於 English / 日本語 / 한국어 / 繁體中文 間切換）
- 不雅字詞過濾器
- 即時聊天翻譯（MyMemory API），設定中提供目標語言選擇器與開關切換
- GM/開發者發言高亮（在聊天中以金色粗體視覺化突顯 GM/開發者訊息；可在設定中開關）
- 聊天 Mention 提及通知（當有人在聊天中叫你的名字時收到可選通知）
- 聊天指令快捷鍵（`!dance`, `!hearts`, `!pat`, `!chowayo`, `!follow`, `!players`, `!zoom`, `!fppitch`）
- **[NEW]** 聊天時間戳記（可在聊天中切換顯示 `[HH:MM:SS]` 前綴）
- **[NEW]** 自由視角 / 空拍機拍照模式（需手把控制器，可分離鏡頭進行電影級拍攝）
- **[NEW]** 真·第一人稱視角 (POV) 模式（鎖定水平視線高度的攝影機，支援自訂仰俯角度）
- **[NEW]** HUD 自訂：UI 縮放滑桿（80% - 130%）、毛玻璃 / 不透明度滑桿、以及重點配色選擇器
- **[NEW]** HUD 背景圖片（隨角色等級 10 級至 50 級逐步解鎖）
- **[NEW]** 單次連線金幣與 Elif 收益追蹤器（即時追蹤本次遊戲連線期間獲得的貨幣）
- **[NEW]** FPS 幀率與網路延遲 (Ping) 計數器
- **[NEW]** 每日重置倒數計時器（顯示距離韓國時間 00:00 KST 重置的剩餘時間）
- **[NEW]** 低血量危急警示（螢幕邊緣紅色脈衝暗角提示）
- **[NEW]** 手把觸覺震動回饋（受到傷害時控制器震動）
- **[NEW]** 設定匯出 / 匯入為 JSON 檔案

<img width="320" height="130" alt="image" src="https://github.com/user-attachments/assets/baef0617-c9df-4ff9-a294-78d914c67e93" />

---

<img width="535" height="590" alt="image" src="https://github.com/user-attachments/assets/1e7c0c60-9576-4b3d-9828-8aeac29d0936" />

<h2 id="3-speakimod">3. SpeakiMod+ 實裝！</h2>

[⬆ 返回頂部](#table-of-contents)

SpeakiMod+ 是基於原始 SpeakiMod 進行大幅修改與全面重構的分支版本（Fork）。我們最初分叉此專案是為了徹底清理程式碼庫，確保為使用者提供安全、透明且可靠的體驗。自那之後，我們已將其擴展為一個擁有豐富自訂功能的全新獨立專案。

*法律聲明：本專案依據 [BSD 3-Clause 授權條款](https://opensource.org/licenses/BSD-3-Clause) 衍生自 [Alluseri 開發的 SpeakiMod](https://github.com/Alluseri/SpeakiMod)。*

---

<h2 id="4-official-developer-reaction--usage-policy">4. 官方開發者回應與使用規範</h2>

[⬆ 返回頂部](#table-of-contents)

* 【關於官方開發者的回應】
* SpeakiMMODeveloper 的官方回應繁體中文翻譯如下：

---

<img width="462" height="259" alt="devresponse" src="https://github.com/user-attachments/assets/3e96eae6-845a-43ba-9af2-18e51f038a89" />

---

* 「在不損害其他玩家權益的前提下，允許對客戶端進行修改。」
* 「你可以自由使用或修改此工具。」
* 「任何會損害其他玩家權益的行為（例如自動打怪/外掛自動狩獵）仍屬於懲罰對象。」
* 「處罰標準完全是主觀的（也就是由我，營運者自行判斷），因此玩家必須自行斟酌。」
* 「只要確定不會對其他玩家造成損害，就沒有關係。」

---

因此，根據官方開發者的聲明：
* **允許：** 在**不損害其他玩家或破壞遊戲公平性**的前提下，允許進行客戶端修改以及工具的使用與自訂。
* **禁止：** 任何對其他玩家產生負面影響的行為（例如：自動打怪、掛機機器人、外掛作弊）。
* **執行方式：** 封禁標準完全取決於開發者的主觀裁量權。玩家必須自行斟酌判斷——只要你確定不會影響他人，通常都是允許的。使用風險由使用者自行承擔。

---

<h2 id="5-download">5. 下載</h2>

[⬆ 返回頂部](#table-of-contents)

<img width="264" height="213" alt="1778253476070028" src="https://github.com/user-attachments/assets/caaa2f1c-b522-4cf6-8fa2-f44677b8db7a" />

前往 [Releases（版本發布頁面）](https://github.com/DJTOMATO/SpeakiRPG/releases) 下載最新版本的安裝檔案。

<h2 id="6-self-compile-quick-start-guide">6. 自行編譯快速入門指南</h2>

[⬆ 返回頂部](#table-of-contents)

想要自己編譯並執行嗎？請按照以下步驟操作：

1. **複製專案 (Clone):**

```bash
git clone https://github.com/DJTOMATO/SpeakiRPG.git
cd SpeakiRPG
```

2. **安裝相依套件 (Install):**

```bash
npm install
```

3. **啟動 (Launch):**

```bash
npm start
```

---

*想要打包獨立安裝檔嗎？使用 electron-builder 執行 `npm run build` 即可！*

---

<h2 id="7-how-to-use-it">7. 如何使用</h2>

[⬆ 返回頂部](#table-of-contents)

<img width="203" height="124" alt="HHUUUaybIAA5i4g" src="https://github.com/user-attachments/assets/4ba2eb21-8e70-4605-8b5d-cd6031229b29" />

1. 開啟桌面客戶端並登入 Speaki RPG。
2. 應用程式將自動擷取你的玩家名稱、等級與經驗值。
3. 你的 Discord 狀態將立即更新，向好友展示你的練等成果！（也可以按下 CTRL+SHIFT+D 強制手動更新）
4. [附加功能](#2-additional-features) 將會顯示在左側。

---

<h2 id="8-good-to-know">8. 注意事項</h2>

[⬆ 返回頂部](#table-of-contents)

<img width="125" height="113" alt="DONT" src="https://github.com/user-attachments/assets/c76b1d40-e0a7-4904-b250-38b73f02db54" />

* **非官方專案：** 本專案為粉絲自製作品，與 Speaki RPG 官方原創團隊無任何附屬關係。專案內不包含任何遊戲素材資源。
* **想參與貢獻？** 非常歡迎在 GitHub 上提交貢獻、回報 Bug 以及發起 Pull Request！
* **授權條款：** 本專案依據 GNU 授權條款進行授權。
* **Mod 功能顯示/折疊：** 別忘了點擊 Mod 標題最多 3 次即可折疊 HUD 介面！
* **官方立場摘要：** 只要不損害其他玩家權益且不影響公平遊戲，客戶端修改與工具使用均屬允許（但處罰裁量權完全取決於官方開發者的主觀判斷）。

---

<h2 id="9-want-to-collaborate">9. 想要一起協作？</h2>

[⬆ 返回頂部](#table-of-contents)

<img width="235" height="236" alt="1765896114857749" src="https://github.com/user-attachments/assets/08d51e52-7f46-4a24-97d1-d4e4bfc5d114" />

想一起協作開發嗎？歡迎與我們聯絡，在 GitHub 上 [發起 Pull Request](https://github.com/DJTOMATO/SpeakiRPG/pulls) 或 [提交 Issue 問題回報](https://github.com/DJTOMATO/SpeakiRPG/issues)！也非常歡迎繁體中文母語玩家協助修飾或校對文句！

<h2 id="faq">10. 常見問題 (FAQ)</h2>

[⬆ 返回頂部](#table-of-contents)

**使用這個工具安全嗎？我會被封鎖帳號 (Ban) 嗎？**
- 根據開發者的官方聲明，只要不損害其他玩家權益的客戶端修改都是允許的。但像自動打怪或任何給予不正當優勢的功能並不在此限，可能會導致帳號被封禁。請自行斟酌並理性使用。

**可以在 Mac / Linux 上執行嗎？**
- 預編譯的釋出版本為 Windows 專用。Mac / Linux 使用者可以參考 [自行編譯快速入門指南](#6-self-compile-quick-start-guide) 嘗試自行編譯，不過我們並未在這些平台上進行官方測試。

**這是免費的嗎？**
- 是的，完全免費且在 GNU 授權下開源。

**這會修改遊戲檔案或包含遊戲素材資源嗎？**
- 不會。這是一個獨立的桌面應用包裝器 / 啟動器——未包含任何遊戲素材資源，也不會修改任何遊戲原始檔案。

**為什麼我的 Discord 狀態沒有更新？**
- 請確認在啟動 Speaki RPG Desktop 之前 Discord 已開啟並處於執行狀態。你也可以隨時按下 CTRL+SHIFT+D 強制重新整理狀態。

**這與 Speaki RPG 官方團隊有關聯嗎？**
- 沒有，這是一個非官方的粉絲自製專案。

**這會帶有病毒或導致我的帳號被盜嗎？**
- 不會——原始碼完全公開在此儲存庫中，任何人都能在執行前仔細檢查所有程式碼邏輯。如果你對預先編譯的發行版有疑慮，可以參考 [自行編譯快速入門指南](#6-self-compile-quick-start-guide) 直接從原始碼自行建置。

**你們接受贊助/捐款嗎？**
- 不接受，這是一個完全免費的專案，並且會一直保持免費。

**誰是最棒的使徒 (Apostle)？？**
- 魯波 (Rufo)。不接受任何反駁。<img width="32" height="32" alt="image" src="https://github.com/user-attachments/assets/c30f8b97-c0e3-4bd1-bc77-742a2f9dd21f" />

**使用這個會被官方開發者封鎖嗎？**
- 不會——詳細說明請參閱上方的 [官方開發者回應與使用規範](#4-official-developer-reaction--usage-policy) 章節。

---

<h2 id="credits">11. 致謝名單</h2>

[⬆ 返回頂部](#table-of-contents)

* **原作遊戲 (Original Game):** EPID Games
* **Speaki MMO 開發:** GMDT
* **客戶端與 SpeakiMod+ 開發:** Glas
* **SpeakiMod 原作者:** Alluseri
* **日語翻譯:** JPN_WholesomeElfName15T
* **繁體中文 (zh-TW) 翻譯:** PeiYu

---

## 第三方元件

* **speakimod.js** – 衍生自 [Alluseri 開發的 SpeakiMod](https://github.com/Alluseri/SpeakiMod)，採用 [BSD 3-Clause 授權條款](https://opensource.org/licenses/BSD-3-Clause)。

---

<img src="https://cdn.nest.rip/uploads/96578d20-4e61-4cab-9978-d01789edebbb.png">

