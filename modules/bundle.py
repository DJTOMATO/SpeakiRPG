import os
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

module_files = [
    '01_core.js',
    '02_map_data.js',
    '03_i18n_core.js',
    '04_audio_modals.js',
    '05_fonts_expressions.js',
    '06_ui_styles_hud.js',
    '07_ui_emoji_avatar.js',
    '08_ui_floating_buttons.js',
    '09_emotes_effects.js',
    '10_cooking_prop_anims.js',
    '11_modals_world_map.js',
    '12_modals_bbs.js',
    '13_modals_gamepad.js',
    '14_chat_i18n.js',
    '15_quests.js',
    '16_exp_tracker_gameloop.js',
    '17_chat_game_hooks.js',
    '18_account_recovery.js',
    '19_cinema.js'
]

print(f"Bundling {len(module_files)} modules from modules/ into SpeakiMod.js...")

bundled_code = ""
for file_name in module_files:
    file_path = os.path.join(SCRIPT_DIR, file_name)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = len(content.splitlines())
        print(f"  + {file_name.ljust(25)} ({lines} lines)")
        bundled_code += content + "\n\n"

out_path = os.path.join(SCRIPT_DIR, '..', 'SpeakiMod.js')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(bundled_code)

total_lines = len(bundled_code.splitlines())
print(f"\nSuccessfully wrote SpeakiMod.js ({total_lines} lines).\n")

print("[1/2] Running syntax check (node -c)...")
result = subprocess.run(['node', '-c', out_path], capture_output=True, text=True)
if result.returncode == 0:
    print("Syntax check: PASS\n")
else:
    print("Syntax check: FAIL")
    print(result.stderr)
