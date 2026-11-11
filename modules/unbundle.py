"""
SpeakiMod Unbundler & Synchronization Tool
===========================================
Splits `SpeakiMod.js` back into individual module files in `tools/modules/`.
Useful when changes are made directly to `SpeakiMod.js` (e.g. from upstream
PRs, quick online edits, or external contributions) so they are kept in sync
with `tools/modules/` and won't be overwritten on the next `python tools/bundle.py`.

Usage:
    python tools/unbundle.py [--dry-run] [--check] [path/to/SpeakiMod.js]
"""

import os
import sys
import difflib
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
MODULES_DIR = os.path.join(SCRIPT_DIR, "modules") if os.path.isdir(os.path.join(SCRIPT_DIR, "modules")) else SCRIPT_DIR
DEFAULT_BUNDLE = os.path.join(REPO_ROOT, "SpeakiMod.js")

# Ordered module list and anchor signatures used to find starting boundaries
MODULE_SPECS = [
    {
        "name": "01_core.js",
        "anchors": [
            "// Suppress report-only CSP warnings in console for custom emoji assets",
            "window.speakiMod = true;",
            "let authToken = null;"
        ]
    },
    {
        "name": "02_map_data.js",
        "anchors": [
            "// Default fallback portals and raids (offline / boot fallback)",
            "const DEFAULT_PORTALS = {",
            "const DEFAULT_WORLD_ZONES = ["
        ]
    },
    {
        "name": "03_i18n_core.js",
        "anchors": [
            "function buildElement(tag, characteristics, inner, callback) {",
            "function findNametagSprite(entity) {",
            "const lunBadWords = ["
        ]
    },
    {
        "name": "04_audio_modals.js",
        "anchors": [
            "function findGameAudioListener() {",
            "function toggleGameMute() {",
            "function positionModalNicely(modal) {"
        ]
    },
    {
        "name": "05_fonts_expressions.js",
        "anchors": [
            "const SPKMOD_VALID_FONT_PRESETS = new Set([",
            "var lunFontPreset =",
            "function sanitizeSpkmodCustomFont(raw) {"
        ]
    },
    {
        "name": "06_ui_styles_hud.js",
        "anchors": [
            "function updateDynamicStyles() {",
            'case "sepia": filterRule =',
            "const styleTag = document.getElementById(\"spkmod-dynamic-styles\")"
        ]
    },
    {
        "name": "07_ui_emoji_avatar.js",
        "anchors": [
            "// --- EMOJI PICKER ---",
            "function toggleFavoriteEmoji(id) {",
            "function renderSpkmodInlineEmojis(text, imgStyle) {"
        ]
    },
    {
        "name": "08_ui_floating_buttons.js",
        "anchors": [
            "// FLOATING ACTION BUTTONS (Right-Click to Summon / Clean / LocalStorage Saved)",
            "window.spkmodActiveFloatingButtons = new Map();",
            "function spkmodSpawnFloatingButton("
        ]
    },
    {
        "name": "09_emotes_effects.js",
        "anchors": [
            "const lunJumpAnimMs = 500;",
            "function setJumpActive(val) {",
            "function triggerHearts() {"
        ]
    },
    {
        "name": "10_cooking_prop_anims.js",
        "anchors": [
            "// ============================================================================\n// PUMPKIN CART TEXTURE REPLACEMENT SKINS",
            "const SPKMOD_PUMPKIN_CART_ORIG_TEX = \"https://speakirpg.overture.io.kr/models/mount_pumpkin_cart_halloween/HW_Map_Body.png\";",
            "const SPKMOD_PUMPKIN_CART_SKINS = {"
        ]
    },
    {
        "name": "11_modals_world_map.js",
        "anchors": [
            "const mapModalElements = {};",
            "// ---- World map viewport (pan / pinch-zoom) ----",
            "function openMapModal() {"
        ]
    },
    {
        "name": "12_modals_bbs.js",
        "anchors": [
            "// --- SPEAKI BBS (COMMUNITY BULLETIN BOARD) ---",
            "function escapeBbsHtml(text) {",
            "function getBbsServerUrl() {"
        ]
    },
    {
        "name": "13_modals_gamepad.js",
        "anchors": [
            "function openGamepadModal() {",
            "function refreshGamepadModalI18n() {",
            "function pollGamepadLoop() {"
        ]
    },
    {
        "name": "14_chat_i18n.js",
        "anchors": [
            "function updateBeyBladeButtonText() {",
            "function updateReverseBeyBladeButtonText() {",
            "var questsModalElements = window.questsModalElements = window.questsModalElements || {"
        ]
    },
    {
        "name": "15_quests.js",
        "anchors": [
            "function getQuestDisplayText(quest) {",
            "function getQuestTitle(quest) {",
            "// --- SpeakiMod Quest Checklist System ---"
        ]
    },
    {
        "name": "16_exp_tracker_gameloop.js",
        "anchors": [
            "// --- MOD PLAYERS TELEMETRY & HOURLY PING ---",
            "window.spkmodSendTelemetryPing = function() {",
            "var windowSec = lunExpIntervalMinutes * 60;"
        ]
    },
    {
        "name": "17_chat_game_hooks.js",
        "anchors": [
            "function hookGameStateOnce() {",
            "function appendColoredChatLine(id, name, text, customColor) {",
            "// EMOJI COOLDOWN SYSTEM"
        ]
    },
    {
        "name": "18_account_recovery.js",
        "anchors": [
            "const SPKMOD_ACCOUNTS_KEY = \"spkmod-saved-accounts\";",
            "function getStoredAccounts() {",
            "function showAccountManagerModal() {"
        ]
    },
    {
        "name": "19_cinema.js",
        "anchors": [
            "// ============================================================================\n// IN-GAME 3D MOVIE THEATER & CINEMA PLAYER (CSS3DRENDERER + YOUTUBE)",
            "var SPKMOD_CINEMA_DEFAULT_CONFIG = window.SPKMOD_CINEMA_DEFAULT_CONFIG || {",
            "function spkmodInitCinema() {"
        ]
    }
]


def unbundle(bundle_path=DEFAULT_BUNDLE, dry_run=False, check_only=False):
    if not os.path.exists(bundle_path):
        print(f"[-] Error: Bundle file not found at {bundle_path}")
        return False

    print(f"Reading bundle from: {os.path.relpath(bundle_path, REPO_ROOT)}")
    with open(bundle_path, "r", encoding="utf-8") as f:
        bundle_text = f.read()

    # Determine line ending style of bundle
    nl = "\r\n" if "\r\n" in bundle_text else "\n"

    # Find starting index for each module
    starts = []
    for spec in MODULE_SPECS:
        name = spec["name"]
        if name == "01_core.js":
            starts.append((0, name))
            continue

        pos = -1
        matched_anchor = None
        for anchor in spec["anchors"]:
            pos = bundle_text.find(anchor)
            if pos != -1:
                matched_anchor = anchor
                break

        if pos == -1:
            print(f"[-] Error: Could not locate starting boundary for '{name}'.")
            print(f"    Searched anchors: {spec['anchors']}")
            return False

        starts.append((pos, name))

    # Verify monotonic increasing positions
    for i in range(len(starts) - 1):
        if starts[i][0] >= starts[i + 1][0]:
            print(f"[-] Error: Ordering conflict between {starts[i][1]} (pos {starts[i][0]}) and {starts[i+1][1]} (pos {starts[i+1][0]})")
            return False

    # Extract module chunks
    extracted = {}
    for i in range(len(starts)):
        name = starts[i][1]
        start_pos = starts[i][0]
        if i < len(starts) - 1:
            next_pos = starts[i + 1][0]
            chunk = bundle_text[start_pos:next_pos]
            # Strip trailing double newline separator added by bundle.py
            if chunk.endswith("\r\n\r\n"):
                chunk = chunk[:-4]
            elif chunk.endswith("\n\n"):
                chunk = chunk[:-2]
        else:
            chunk = bundle_text[start_pos:]
            # Strip trailing double/single newline at EOF if any
            if chunk.endswith("\r\n\r\n"):
                chunk = chunk[:-4]
            elif chunk.endswith("\n\n"):
                chunk = chunk[:-2]
            elif chunk.endswith("\r\n"):
                chunk = chunk[:-2]
            elif chunk.endswith("\n"):
                chunk = chunk[:-1]

        # Ensure consistent module ending newline
        if not chunk.endswith(nl):
            chunk += nl

        extracted[name] = chunk

    # Compare extracted modules with existing modules on disk
    print("\nComparing extracted modules with tools/modules/:")
    modified_count = 0
    total_modules = len(extracted)

    for name, new_content in extracted.items():
        target_path = os.path.join(MODULES_DIR, name)
        old_content = ""
        exists = os.path.exists(target_path)
        if exists:
            with open(target_path, "r", encoding="utf-8") as f:
                old_content = f.read()

        old_stripped = old_content.rstrip("\r\n")
        new_stripped = new_content.rstrip("\r\n")

        if old_stripped == new_stripped:
            print(f"  [=] {name.ljust(26)} (unchanged)")
        else:
            diff_lines = list(difflib.unified_diff(
                old_stripped.splitlines(),
                new_stripped.splitlines(),
                fromfile=f"a/{name}",
                tofile=f"b/{name}",
                n=1
            ))
            added = sum(1 for line in diff_lines if line.startswith("+") and not line.startswith("+++"))
            removed = sum(1 for line in diff_lines if line.startswith("-") and not line.startswith("---"))
            print(f"  [*] {name.ljust(26)} (MODIFIED: +{added} -{removed} lines)")
            modified_count += 1

    if check_only:
        if modified_count == 0:
            print("\n[PASS] All modules are currently in sync with SpeakiMod.js.")
            return True
        else:
            print(f"\n[FAIL] {modified_count} module(s) differ from SpeakiMod.js.")
            return False

    if modified_count == 0:
        print("\nAll modules already match SpeakiMod.js. No writes needed.")
        return True

    if dry_run:
        print(f"\n[DRY RUN] {modified_count} module(s) would be updated. No files written.")
        return True

    # Write updated modules to disk
    print(f"\nWriting {modified_count} updated module(s) to tools/modules/...")
    for name, new_content in extracted.items():
        target_path = os.path.join(MODULES_DIR, name)
        with open(target_path, "w", encoding="utf-8", newline="") as f:
            f.write(new_content)

    print("[+] Successfully synchronized all modules.")

    # Re-verify by bundling in memory to guarantee lossless consistency
    bundle_script = os.path.join(SCRIPT_DIR, "bundle.py")
    if os.path.exists(bundle_script):
        print("\nRe-verifying consistency with tools/bundle.py...")
        res = subprocess.run([sys.executable, bundle_script], capture_output=True, text=True)
        if res.returncode == 0:
            print("[+] bundle.py completed successfully with PASS.")
        else:
            print("[-] Warning: bundle.py reported an issue:\n" + res.stderr)

    return True


if __name__ == "__main__":
    args = sys.argv[1:]
    dry_run = "--dry-run" in args
    check_only = "--check" in args
    file_args = [a for a in args if not a.startswith("--")]
    target_bundle = file_args[0] if file_args else DEFAULT_BUNDLE

    success = unbundle(target_bundle, dry_run=dry_run, check_only=check_only)
    sys.exit(0 if success else 1)

