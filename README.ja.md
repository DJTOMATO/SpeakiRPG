# Speaki RPG デスクトップクライアント

[English:README](README.md) | [イマココ!](README.ja.md) | [한국어:README](README.ko.md) | [繁體中文:README](README.zh-tw.md)

# [ダウンロード](https://github.com/DJTOMATO/SpeakiRPG/releases) | [Discordに参加](https://discord.gg/bruZhcwqRx)

**Speaki RPG デスクトップクライアント**は、ブラウザMMORPG **Speaki RPG**専用のカスタムデスクトップアプリ兼ランチャーです。ブラウザタブからゲームをデスクトップに拡張し、Discordとの素晴らしい連携機能や、フレンドがあなたのゲーム進行状況をリアルタイムで確認できるなど、楽しい機能を追加します。

<h2 id="table-of-contents">目次</h2>

- [1. 何が素晴らしいのか？](#1-what-makes-it-awesome)
- [2. 追加機能](#2-additional-features)
- [3. SpeakiMod+の実装！](#3-speakimod)
- [4. 公式開発者の見解および使用ポリシー](#4-official-developer-reaction--usage-policy)
- [5. ダウンロード](#5-download)
- [6. セルフコンパイルクイックスタートガイド](#6-self-compile-quick-start-guide)
- [7. 使い方](#7-how-to-use-it)
- [8. 留意事項](#8-good-to-know)
- [9. 協力を希望される方へ](#9-want-to-collaborate)
- [10. よくある質問](#faq)
- [11. クレジット](#credits)

![Alt Text for Image](https://github.com/user-attachments/assets/162507e2-68d6-4299-b847-beab0580ef47)
---

<h2 id="1-what-makes-it-awesome">1. 何が素晴らしいのか？</h2>

[⬆ トップへ戻る](#table-of-contents)

<img width="1255" height="649" alt="image" src="https://github.com/user-attachments/assets/94de28f6-c3bb-46ef-abb5-0fd1b055986f" />

* **Discordリッチプレゼンス:** Discordプロフィールに、現在のキャラクター名、レベル、経験値を自動的に表示します。
* **スムーズな操作性:** 専用のデスクトップラッパーにより、よりクリーンでスムーズなセッションを実現します。
* **GPUパフォーマンスの向上:** 3Dレンダリングを向上させるために、GPUを自動的に最適化します。
* **豊富なゲームプレイ機能:** SpeakiMod+（下記参照）のおかげで、様々なQOL機能が追加されました！
* **リアルタイムチャット翻訳**: MyMemory APIを使用してゲーム内チャットメッセージを瞬時に翻訳します。
* **不適切な言葉のフィルタリング**: チャット内の露骨な表現や不適切な言葉を自動的に検閲し、ゲーム内コミュニケーションをクリーンで友好的なものに保ちます。

<h2 id="2-additional-features">2. 追加機能</h2>

[⬆ トップへ戻る](#table-of-contents)

<img width="456" height="461" alt="image" src="https://github.com/user-attachments/assets/f51d57d9-2632-4a18-960e-f641133cbd9e" />

- 周囲のｽﾋﾟｷ数
- 各チャンネル接続ｽﾋﾟｷ数の表示
- 他ｽﾋﾟｷの名前を非表示
- リアルタイムチャット翻訳機能（MyMemory API）を追加しました。翻訳対象言語の選択機能と、オン/オフ切り替え機能があります。
- 不適切な単語のフィルタリング (現在メンテナンス中)
- クエストのピン留め
- 経験値トラッカー（1分あたりの経験値と次のレベルまでの推定時間）
- ポータルに向かって自動で歩く（自動で回復したり、障害物を避けたりはしません）
- どこでもダンス
- どこでも「ﾁｮﾜﾖ！」
- ハートエモート＆継続ハートエモート（周囲にハートを振りまく）
- くるりん (その場で回転 いつまでも持続可能)
- 向き固定ムーンウォーク（向いている方向を固定したまま全方向に自由に移動）
- ふるふる＆ふりふり（カメラ方向に細かく震えるエモートと、高速荒ぶりエモート）
- 💃🏻舞う💃🏻（ジャンプやハートを活用した同期サークルダンス）
- ターンテーブル写真モード（スクリーンショットや撮影用の360度自動回転カメラ）
- ｽﾋﾟｷ追従機能（ワンクリックで対象のフレンドや周囲のｽﾋﾟｷを自動追従）
- 近くのｽﾋﾟｷを発見（ボタンまたは `!players` で周囲のプレイヤーのLv、距離、IDを一覧表示）
- ゲームパッド / コントローラー完全対応（Xbox、PlayStation、Switchコントローラーでの移動、カメラ、攻撃、ポータル進入に対応）
- インタラクティブなコントローラー配置図 / キーリマップ（リアルタイム入力点灯機能付きの視覚的配置図と自由なボタン割り当て）
- ｽﾋﾟｷの向きを調整（ポージングに便利）
- 視点カメラが壁をすり抜ける（View Clip）
- カメラをロック（昔のPS1ゲームのように）
- カメラのズームを制御（チャットコマンド:!zoom）
- 他ｽﾋﾟｷの視界を確認
- MODタイトルをクリックして、MODのHUDを折りたたむ（三段階）
- クライアント言語切り替え機能（English / 日本語 / 한국어 から選択可能）
- GMのチャットを強調表示（チャット内でGM/開発者の発言を金色・太字で強調表示・設定でON/OFF可能）
- メンションチャットを通知（チャットで自分の名前が呼ばれた際の通知機能・設定でON/OFF可能）
- チャットコマンドショートカット（`!dance`, `!hearts`, `!pat`, `!chowayo`, `!follow`, `!players`, `!zoom`, `!fppitch`）
- **[NEW]** チャットタイムスタンプ (チャットに `[HH:MM:SS]` を表示/非表示)
- **[NEW]** フリーカメラ / ドローンモード (ゲームパッド専用、カメラを切り離してシネマティックな撮影が可能)
- **[NEW]** 1人称視点(FPS)モード (上向き下向き調節可能)
- **[NEW]** HUDカスタマイズ: UI拡大縮小スライダー(80%～130%) / ガラスモーフィズム / 不透明度スライダー / アクセントカラー選択
- **[NEW]** HUD背景画像 (レベル10から50まで段階的に選択可能)
- **[NEW]** ゴールドとエリーフの獲得量表示 (現在のセッションで獲得した通貨量を表示)
- **[NEW]** FPSとPingを表示
- **[NEW]** デイリーリセットタイマー (00:00 KSTまでの残り時間を表示)
- **[NEW]** 低体力アラート (画面端が赤く点滅する)
- **[NEW]** ゲームパッド振動機能 (ダメージを受けた時にコントローラーが振動)
- **[NEW]** 設定の保存/読み込み (JSON形式)

<img width="320" height="130" alt="image" src="https://github.com/user-attachments/assets/baef0617-c9df-4ff9-a294-78d914c67e93" />

---

<img width="535" height="590" alt="image" src="https://github.com/user-attachments/assets/1e7c0c60-9576-4b3d-9828-8aeac29d0936" />

<h2 id="3-speakimod">3. SpeakiMod+の実装！</h2>

[⬆ トップへ戻る](#table-of-contents)

SpeakiMod+ は、オリジナルの SpeakiMod を大幅に変更し、完全にオーバーホールしたフォーク（派生版）です。安全で透明性が高く信頼できる体験をユーザーに提供するため、コードベースを徹底的にクリーンアップする目的でこのプロジェクトをフォークしました。その後、多くのカスタム機能を追加し、全く新しいプロジェクトへと発展させました。

*法的情報：[BSD 3条項ライセンス](https://opensource.org/licenses/BSD-3-Clause)の下、[Alluseri による SpeakiMod](https://github.com/Alluseri/SpeakiMod) から派生しています。*

---

<h2 id="4-official-developer-reaction--usage-policy">4. 公式開発者の見解および使用ポリシー</h2>

[⬆ トップへ戻る](#table-of-contents)

* 【公式開発者からの見解】
* SpeakiMMODeveloperによる公式見解の日本語訳は以下の通りです。

---

<img width="462" height="259" alt="devresponse" src="https://github.com/user-attachments/assets/3e96eae6-845a-43ba-9af2-18e51f038a89" />

---

* 他のユーザーに被害が及ばない範囲でのクライアント改変を許可しました。
* このツールを使用・改造しても構いません。
* 他のユーザーに迷惑をかける行為（自動狩りなど）は依然として制裁対象です。
* 制裁の基準は完全に主観的（私、つまり運営者）であるため、ユーザー自身で判断する必要があります。
* 他のユーザーに被害がないことが確実であれば、問題ありません。

---

公式開発者からの見解を要約すると、以下の通りです。
* **許可:** クライアントの変更およびツールの使用/カスタマイズは、**他のユーザーに損害を与えたり、公平なプレイを妨害したりしない限り**可能です。
* **禁止:** 他のプレイヤーに悪影響を与える行為（例：自動狩り、ボットの使用、チート行為）は禁止です。
* **適用:** 禁止基準は開発者の主観的な裁量に完全に委ねられています。ユーザーは各自の判断で行動する必要があります。他のユーザーに悪影響を与えないと確信できる場合は、一般的に許可されます。自己責任でご利用ください。

---

<h2 id="5-download">5. ダウンロード</h2>

[⬆ トップへ戻る](#table-of-contents)

<img width="264" height="213" alt="1778253476070028" src="https://github.com/user-attachments/assets/caaa2f1c-b522-4cf6-8fa2-f44677b8db7a" />

[Releases](https://github.com/DJTOMATO/SpeakiRPG/releases)から最新バージョンのセットアップファイルをダウンロードしてください。

<h2 id="6-self-compile-quick-start-guide">6. セルフコンパイルクイックスタートガイド</h2>

[⬆ トップへ戻る](#table-of-contents)

ご自身で実行したい場合は以下の手順に従ってください：

1. **クローン:**

```bash
git clone https://github.com/DJTOMATO/SpeakiRPG.git
cd SpeakiRPG
```

2. **インストール:**

```bash
npm install
```

3. **起動:**

```bash
npm start
```

---

*スタンドアロン版のビルドには `npm run build` (electron-builder) を実行してください！*

---

<h2 id="7-how-to-use-it">7. 使い方</h2>

[⬆ トップへ戻る](#table-of-contents)

<img width="203" height="124" alt="HHUUUaybIAA5i4g" src="https://github.com/user-attachments/assets/4ba2eb21-8e70-4605-8b5d-cd6031229b29" />

1. デスクトップクライアントを開き、Speaki RPGにログインします。
2. アプリが自動的にプレイヤー名、レベル、経験値を検出します。
3. あなたの頑張りを示すために、Discordステータスが即座に更新されます！（CTRL+SHIFT+Dで強制更新も可能です）
4. [追加機能](#2-additional-features)が左側に表示されます。

---

<h2 id="8-good-to-know">8. 留意事項</h2>

[⬆ トップへ戻る](#table-of-contents)

<img width="125" height="113" alt="DONT" src="https://github.com/user-attachments/assets/c76b1d40-e0a7-4904-b250-38b73f02db54" />

* **非公式:** これはファンメイドのプロジェクトであり、Speaki RPGのクリエイターとは公式に提携していません。ゲームアセットは含まれていません。
* **協力したいですか？** 貢献、バグ報告、プルリクエストはGitHubでいつでも大歓迎です！
* **ライセンス:** GNUライセンスの下でライセンスされています。
* **MOD機能の表示:** MODタイトルをクリックすることで、HUDを折りたためます！
* **公式見解の概要:** 他のユーザーに迷惑をかけず公平なプレイを妨げない範囲であればクライアントの変更やツールの使用は許可されています（ただし制裁基準は開発者の主観的裁量に完全に委ねられます）。

---

<h2 id="9-want-to-collaborate">9. 協力を希望される方へ</h2>

[⬆ トップへ戻る](#table-of-contents)

<img width="235" height="236" alt="1765896114857749" src="https://github.com/user-attachments/assets/08d51e52-7f46-4a24-97d1-d4e4bfc5d114" />

開発に協力したいですか？[Discordサーバー](https://discord.gg/bruZhcwqRx)でお気軽にご連絡いただくか、GitHubにて[pull requestを送信](https://github.com/DJTOMATO/SpeakiRPG/pulls)または[issueを提出](https://github.com/DJTOMATO/SpeakiRPG/issues)してください！日本語が第一言語の方による文章の修正・翻訳も大歓迎です！

<h2 id="faq">10. よくある質問</h2>

[⬆ トップへ戻る](#table-of-contents)

**安全に使用できますか？ / BANされませんか？**
- 開発者の公式声明によると、他のプレイヤーに害を及ぼさないクライアント改変は許可されています。自動狩りなど、他プレイヤーに対して不公平な優位性をもたらす機能はこれに該当せず、BANされる可能性があります。ご自身の判断でご利用ください。

**Mac／Linuxで使用できますか？**
- 配布されているビルド版はWindows向けです。Mac／Linuxをお使いの方は[セルフコンパイルクイックスタートガイド](#6-self-compile-quick-start-guide)を参照してご自身でビルドしてください。ただし、これらの環境での動作は公式にテストされていません。

**無料ですか？**
- はい、完全無料でオープンソースです（GNUライセンス）。

**ゲームファイルを改変したり、ゲームアセットを含んでいますか？**
- いいえ。これはスタンドアロンのデスクトップラッパー／ランチャーであり、ゲームアセットは含まれておらず、ゲームファイルの改変も行いません。

**Discordのステータスが更新されないのですが？**
- Speaki RPG Desktopを起動する前にDiscordを開いて実行しておいてください。CTRL+SHIFT+Dで強制更新することもできます。

**ウイルスに感染したり、ハッキングされたりしませんか？**
- いいえ。 ソースコードは完全に公開されており、このリポジトリで誰でも実際の動作内容を確認できます。ビルド済みのリリース版を信用できない場合は、[セルフコンパイルクイックスタートガイド](#6-self-compile-quick-start-guide)を参照して、ソースからご自身でビルドしてください。

**寄付を受け付けていますか？**
- いいえ、これは無料プロジェクトであり、今後も無料であり続けます。

**Best使徒は？**
- ルポです。異論は認めない。<img width="32" height="32" alt="image" src="https://github.com/user-attachments/assets/c30f8b97-c0e3-4bd1-bc77-742a2f9dd21f" /> BestだけにBeast……ふふっ。


**これを使用すると公式開発者からBANされますか？**
- 詳細は上記の[公式開発者の見解および使用ポリシー](#4-official-developer-reaction--usage-policy)セクションをご確認ください。

**公式のSpeaki RPGチームと提携していますか？**
- いいえ、これは非公式のファンメイドプロジェクトです。

---

<h2 id="credits">11. クレジット</h2>

[⬆ トップへ戻る](#table-of-contents)

* **原作ゲーム (Original Game):** EPID Games
* **Speaki MMO 開発:** GMDT
* **クライアント＆SpeakiMod+コーディング:** Glas
* **SpeakiMod原作者:** Alluseri
* **日本語翻訳:** JPN_健全なエルフ名15T
* **繁体字中国語翻訳:** PeiYu
---

## サードパーティコンポーネント

* **speakimod.js** – [BSD 3条項ライセンス](https://opensource.org/licenses/BSD-3-Clause)の下、[Alluseri による SpeakiMod](https://github.com/Alluseri/SpeakiMod) から派生しています。

---

<img src="https://cdn.nest.rip/uploads/96578d20-4e61-4cab-9978-d01789edebbb.png">

