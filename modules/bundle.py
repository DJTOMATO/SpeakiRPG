import os
import sys
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Resolve repository root dynamically (parent of modules/)
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
MODULES_DIR = os.path.join(REPO_ROOT, "modules") if os.path.isdir(os.path.join(REPO_ROOT, "modules")) else SCRIPT_DIR
OUT_PATH = os.path.join(REPO_ROOT, "SpeakiMod.js")

# Optional movie duration check if updater script is present
movies_txt = os.path.join(REPO_ROOT, 'assets', 'movies.txt')
if not os.path.exists(movies_txt):
    movies_txt = os.path.join(REPO_ROOT, 'movies.txt')
updater_script = os.path.join(REPO_ROOT, 'tools', 'update_movies.py')
if os.path.exists(movies_txt) and os.path.exists(updater_script):
    try:
        tools_dir = os.path.dirname(updater_script)
        if tools_dir not in sys.path:
            sys.path.insert(0, tools_dir)
        from update_movies import update_movies_file
        update_movies_file(movies_txt)
    except Exception as e:
        print(f"Notice: movies.txt check skipped ({e})")

# Automatically discover and sort all JS module files (e.g. 01_core.js ... 19_cinema.js)
module_files = sorted([
    f for f in os.listdir(MODULES_DIR)
    if f.endswith('.js') and f[0:2].isdigit()
])

if not module_files:
    print(f"[-] Error: No module files found in {MODULES_DIR}")
    sys.exit(1)

print(f"Bundling {len(module_files)} modules from modules/ into SpeakiMod.js...")

bundled_code = ""
for file_name in module_files:
    file_path = os.path.join(MODULES_DIR, file_name)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = len(content.splitlines())
        print(f"  + {file_name.ljust(26)} ({lines} lines)")
        bundled_code += content + "\n\n"

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    f.write(bundled_code)

total_lines = len(bundled_code.splitlines())
print(f"\nSuccessfully wrote SpeakiMod.js ({total_lines} lines).\n")

print("[1/2] Running syntax check (node -c)...")
result = subprocess.run(['node', '-c', OUT_PATH], capture_output=True, text=True)
if result.returncode == 0:
    print("Syntax check: PASS\n")
else:
    print("Syntax check: FAIL")
    print(result.stderr)
    sys.exit(1)
