# Speaki RPG Desktop

# ->  [English](README.md) | [日本語](README.ja.md) | [한국어](README.ko.md) <- 


<img width="1039" height="441" alt="image" src="https://github.com/user-attachments/assets/02184bea-65d8-4858-af07-895be0b11e77" />



#  -> [Download | ダウンロード | 다운로드 ](https://github.com/DJTOMATO/SpeakiRPG/releases) <- 

**Speaki RPG Desktop** is a custom desktop app and launcher for the browser MMORPG **Speaki RPG**. It brings the game out of your browser tab and adds awesome Discord integration plus extra fun features so your friends can see your grinding progress in real time!

<h2 id="table-of-contents">Table of Contents</h2>

- [1. What Makes It Awesome?](#1-what-makes-it-awesome)
- [2. Additional Features](#2-additional-features)
- [3. Implementation of SpeakiMod+!](#3-speakimod)
- [4. Official Developer Reaction & Usage Policy](#4-official-developer-reaction--usage-policy)
- [5. Download](#5-download)
- [6. Self-compile Quick Start Guide](#6-self-compile-quick-start-guide)
- [7. How to Use It](#7-how-to-use-it)
- [8. Good to Know](#8-good-to-know)
- [9. Want to Collaborate?](#9-want-to-collaborate)
- [10. FAQ](#faq)
- [11. Credits](#credits)

![Alt Text for Image](https://github.com/user-attachments/assets/162507e2-68d6-4299-b847-beab0580ef47)
---

<h2 id="1-what-makes-it-awesome">1. What Makes It Awesome?</h2>

[⬆ Back to Top](#table-of-contents)

<img width="1255" height="649" alt="image" src="https://github.com/user-attachments/assets/94de28f6-c3bb-46ef-abb5-0fd1b055986f" />

* **Discord Rich Presence:** Automatically shows your current character name, level, and XP right on your Discord profile.
* **Smooth Experience:** Gives you a dedicated desktop wrapper for a cleaner, smoother session.
* **Improved GPU performance**: It automatically sets up your GPU for better 3D rendering.
* **Rich Gameplay features**: Thanks to SpeakiMod+ (Read below) several QOL features are introduced!
* **Real-Time Chat Translation**: Instantly translates in-game chat messages using the MyMemory API
* **Profanity Filter**: Automatically censors explicit or inappropriate language in chat to keep your in-game communication clean and friendly.

<h2 id="2-additional-features">2. Additional Features</h2>

[⬆ Back to Top](#table-of-contents)

<img width="456" height="461" alt="image" src="https://github.com/user-attachments/assets/f51d57d9-2632-4a18-960e-f641133cbd9e" />

- Nearby player count
- EXP tracker (EXP per minute and time until next level estimation)
- Channel tracker
- Dance anywhere
- Say "Chowayo!" anywhere
- Heart bloom & continuous heart loop (Spread love with single or repeating heart bursts)
- Lock the camera (like in old PS1 games)
- ViewClip (allow the camera to phase through walls)
- Spin fast (defeating the mobile monopoly)
- True direction-locked Moonwalk (Move in any direction while keeping your facing angle locked)
- Shake & Super Shake (Rapid camera-following jitter and energetic super-shake reaction)
- Dance Ritual (Perform synchronized circular orbit dances with rhythmic jumps and hearts)
- Turntable photo mode (Continuous 360° orbiting camera for screenshots & clips)
- Watch the game from another player's perspective
- Follow player (Auto-follow targeted friends or nearby players with one click)
- Player Radar (Scan nearby players with levels, distances, and IDs via button or `!players`)
- Native Gamepad / Controller support (Xbox, PlayStation & Switch controllers with movement, camera, attack & portal entry)
- Interactive Controller Diagram & Remapping (Visual layout with live button press lighting & custom bindings)
- Hide other players' nametags
- Turn Speaki to face the camera (useful for posing)
- Quest pinning
- Automatically walk towards portals (must be attended, because no auto-eat & no obstacle avoidance)
- Fold the HUD by clicking on the mod title (up to 3 clicks) or drag it around!
- Control camera zoom (!zoom chat command)
- Language switcher (choose between English / 日本語 / 한국어)
- Profanity Filter
- Real-time chat translation (MyMemory API) with a target-language selector and on/off toggle in settings
- Gamemaster talks highlight (Visually highlights and bolds GM/developer messages in chat; toggleable in settings)
- Chat mention notifications (Optional notification when someone calls your name in chat)
- Chat command shortcuts (`!dance`, `!hearts`, `!pat`, `!chowayo`, `!follow`, `!players`, `!zoom`, `!fppitch`)
- **[NEW]** Chat Timestamps (Toggleable `[HH:MM:SS]` prefix in chat)
- **[NEW]** Free-Cam / Drone Photo Mode (Requires Gamepad, detaches camera for cinematic shots)
- **[NEW]** True First-Person POV Mode (Locked horizontal eye-level camera with configurable pitch)
- **[NEW]** HUD Customization: UI Scale Slider (80% - 130%), Glassmorphism/Opacity Slider, & Accent Color Picker
- **[NEW]** HUD Backgrounds (Unlocks progressively from Level 10 to Level 50)
- **[NEW]** Session Gold & Elif Tracker (Real-time tracking of currency earned in current session)
- **[NEW]** FPS & Network Latency Counter
- **[NEW]** Low HP Critical Warning (Pulsing red screen vignette)
- **[NEW]** Gamepad Haptic Vibration / Rumble on Damage
- **[NEW]** Export / Import Settings to JSON

<img width="320" height="130" alt="image" src="https://github.com/user-attachments/assets/baef0617-c9df-4ff9-a294-78d914c67e93" />

---

<img width="535" height="590" alt="image" src="https://github.com/user-attachments/assets/1e7c0c60-9576-4b3d-9828-8aeac29d0936" />

<h2 id="3-speakimod">3. Implementation of SpeakiMod+!</h2>

[⬆ Back to Top](#table-of-contents)

SpeakiMod+ is a heavily modified, completely overhauled fork of the original SpeakiMod. We originally forked this project to thoroughly clean up the codebase to ensure a secure, transparent, and reliable experience for our users. Since then, we have expanded it into a distinctly new project with plenty of custom features.

*Legal: Derived from [SpeakiMod by Alluseri](https://github.com/Alluseri/SpeakiMod) under the [BSD 3-Clause License](https://opensource.org/licenses/BSD-3-Clause).*

---

<h2 id="4-official-developer-reaction--usage-policy">4. Official Developer Reaction & Usage Policy</h2>

[⬆ Back to Top](#table-of-contents)

* [Regarding the Official Developer Reaction]
* The Korean translation of the official reaction by SpeakiMMODeveloper is as follows:

---

<img width="462" height="259" alt="devresponse" src="https://github.com/user-attachments/assets/3e96eae6-845a-43ba-9af2-18e51f038a89" />

---

* Client modifications to the extent that they do not harm other users have been permitted.
* You are free to use or modify this tool.
* Anything that still harms other users (such as auto-hunting) remains subject to penalties.
* The criteria for penalties are completely subjective (i.e., me, the operator), so users must judge for themselves.
* As long as it's certain that it doesn't harm other users, it doesn't matter.

---

So, according to the official developer statement:
* **Allowed:** Client modifications and tool usage/customization, **provided they do not harm other users** or disrupt fair play.
* **Prohibited:** Any actions that negatively impact other players (e.g., auto-hunting, botting, cheating).
* **Enforcement:** Ban criteria are entirely at the developer's subjective discretion. Users must exercise their own judgment—if you are certain it does not affect others, it is generally permitted. Use at your own risk.

---

<h2 id="5-download">5. Download</h2>

[⬆ Back to Top](#table-of-contents)

<img width="264" height="213" alt="1778253476070028" src="https://github.com/user-attachments/assets/caaa2f1c-b522-4cf6-8fa2-f44677b8db7a" />

Head to [Releases](https://github.com/DJTOMATO/SpeakiRPG/releases) and get the latest version setup file.

<h2 id="6-self-compile-quick-start-guide">6. Self-compile Quick Start Guide</h2>

[⬆ Back to Top](#table-of-contents)

Want to run it yourself? Follow these steps:

1. **Clone:**

```bash
git clone https://github.com/DJTOMATO/SpeakiRPG.git
cd SpeakiRPG
```

2. **Install:**

```bash
npm install
```

3. **Launch:**

```bash
npm start
```

---

*Want a standalone installer? Run `npm run build` using electron-builder!*

---

<h2 id="7-how-to-use-it">7. How to Use It</h2>

[⬆ Back to Top](#table-of-contents)

<img width="203" height="124" alt="HHUUUaybIAA5i4g" src="https://github.com/user-attachments/assets/4ba2eb21-8e70-4605-8b5d-cd6031229b29" />

1. Open up the desktop client and log into Speaki RPG.
2. The app will automatically catch your player name, level, and XP.
3. Your Discord status will update instantly to show off your hard work! (You can force update it with CTRL+SHIFT+D)
4. [Additional Features](#2-additional-features) will appear to the left.

---

<h2 id="8-good-to-know">8. Good to Know</h2>

[⬆ Back to Top](#table-of-contents)

<img width="125" height="113" alt="DONT" src="https://github.com/user-attachments/assets/c76b1d40-e0a7-4904-b250-38b73f02db54" />

* **Unofficial:** This is a fan-made project and isn't officially affiliated with the Speaki RPG creators. No game assets are included.
* **Want to help out?** Contributions, bug reports, and pull requests are always welcome over on GitHub!
* **License:** Licensed under the GNU License.
* **Mod Feature Visibility:** Don't forget that you can fold the HUD by clicking up to 3 times on the mod title!
* **Official Stance Summary:** Client modifications and tool usage are permitted as long as they do not harm other users or disrupt fair play (though enforcement is entirely at the developer's subjective discretion).

---

<h2 id="9-want-to-collaborate">9. Want to Collaborate?</h2>

[⬆ Back to Top](#table-of-contents)

<img width="235" height="236" alt="1765896114857749" src="https://github.com/user-attachments/assets/08d51e52-7f46-4a24-97d1-d4e4bfc5d114" />

Want to collaborate? Reach out to us, [send a pull request](https://github.com/DJTOMATO/SpeakiRPG/pulls), or [submit an issue](https://github.com/DJTOMATO/SpeakiRPG/issues) on GitHub!

<h2 id="faq">10. FAQ</h2>

[⬆ Back to Top](#table-of-contents)

**Is this safe to use / will I get banned?**
- Per the developer's official statement, client modifications that don't harm other players are permitted. Features like auto-hunting or anything that gives you an unfair advantage over other players are not covered by this and could get you banned. Use good judgment.

**Does this work on Mac / Linux?**
- The pre-built releases are for Windows. Mac/Linux users can try the [Self-compile Quick Start Guide](#6-self-compile-quick-start-guide) to build it themselves, though it isn't officially tested on those platforms.

**Is this free?**
- Yes, completely free and open source under the GNU License.

**Does this modify game files or include game assets?**
- No. This is a standalone desktop wrapper/launcher — no game assets are included and no game files are modified.

**Why isn't my Discord status updating?**
- Make sure Discord is open and running before you launch Speaki RPG Desktop. You can also force an update with CTRL+SHIFT+D.

**Is this affiliated with the official Speaki RPG team?**
- No, this is an unofficial, fan-made project.

**Will this give me a virus / get me hacked?**
- No — the source code is fully open and available in this repository, so anyone can inspect exactly what it does before running it. If you don't trust the pre-built release, use the [Self-compile Quick Start Guide](#6-self-compile-quick-start-guide) to build it yourself from source.

**Do you accept donations?**
- No, this is a free project and will stay that way.

**Who is the best Apostle??**
- Rufo. No further questions.

**Will I get banned by the official developer for using this?**
- No — check the [Official Developer Reaction & Usage Policy](#4-official-developer-reaction--usage-policy) section above for the full details.

---

<h2 id="credits">11. Credits</h2>

[⬆ Back to Top](#table-of-contents)

* **Original Game:** EPID Games
* **Speaki MMO Development:** GMDT
* **Client and SpeakiMod+ Coding:** Glas
* **SpeakiMod Original Developer:** Alluseri
* **Japanese Translation:** JPN_WholesomeElfName15T

---

## Third-Party Components

* **speakimod.js** – Derived from [SpeakiMod by Alluseri](https://github.com/Alluseri/SpeakiMod), licensed under the [BSD 3-Clause License](https://opensource.org/licenses/BSD-3-Clause).

---

<img src="https://cdn.nest.rip/uploads/96578d20-4e61-4cab-9978-d01789edebbb.png">
