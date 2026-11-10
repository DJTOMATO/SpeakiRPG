import os
import re
import json
import urllib.request

EXPECTED_CHANNEL_IDS = {"UC9BRLn9BCnDYHaoXigXe0dA", "UCgiIsLZFrdZUagCIQDCQX0b"}

def check_youtube_live(handle_or_channel):
    identifier = handle_or_channel.strip()
    if identifier.startswith("UC"):
        url = f"https://www.youtube.com/channel/{identifier}/live"
    elif identifier.startswith("@"):
        url = f"https://www.youtube.com/{identifier}/live"
    else:
        url = f"https://www.youtube.com/@{identifier}/live"

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
            "Cookie": "CONSENT=PENDING+999; SOCS=CAESEwgDEgk2MTQ1MTY1NzQaAmVuIAEaBgiA_LyaBg;"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as res:
            final_url = res.geturl()
            html = res.read().decode("utf-8", errors="ignore")

        # 1. Primary Method: Inspect embedded ytInitialPlayerResponse
        match_player = re.search(r'ytInitialPlayerResponse\s*=\s*({.+?});(?:var\s|</script>)', html)
        if match_player:
            try:
                data = json.loads(match_player.group(1))
                v_details = data.get("videoDetails", {})
                vid = v_details.get("videoId")
                cid = v_details.get("channelId")
                author = v_details.get("author", "")
                is_live = bool(v_details.get("isLive") or v_details.get("isLiveContent"))
                title = v_details.get("title", "")

                # Strict Channel Verification: MUST belong to Oage!
                is_valid_channel = (cid in EXPECTED_CHANNEL_IDS) or ("oagemono" in author.lower()) or ("おあげ" in author)
                if vid and is_valid_channel and is_live:
                    return {
                        "video_id": vid,
                        "is_live": True,
                        "title": title or "oage",
                        "author": author or "oagemono"
                    }
            except Exception as e:
                print(f"[Livestream Check] JSON parse error in ytInitialPlayerResponse: {e}")

        # 2. Secondary Method: Validate Canonical URL + Channel Metadata in HTML
        canonical = re.findall(r'<link\s+rel="canonical"\s+href="([^"]+)"', html)
        if canonical:
            can_url = canonical[0]
            m = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', can_url)
            if m:
                vid = m.group(1)
                # Confirm the page belongs to Oage before trusting canonical
                has_channel_proof = (
                    any(cid in html for cid in EXPECTED_CHANNEL_IDS) or
                    "oagemono" in html.lower() or
                    "おあげ" in html
                )
                if has_channel_proof:
                    title_match = re.search(r'<title>(.*?)</title>', html)
                    title = title_match.group(1).replace(" - YouTube", "").strip() if title_match else "oage"
                    return {
                        "video_id": vid,
                        "is_live": True,
                        "title": title,
                        "author": "oagemono"
                    }

        print("[Livestream Check] Channel page did not contain a verified live stream for @oagemono.")
        return None
    except Exception as e:
        print(f"[Livestream Check] Error checking live status for {handle_or_channel}: {e}")
        return None

def update_movies_with_live(movies_path):
    if not os.path.exists(movies_path):
        print(f"[movies.txt] Path not found: {movies_path}")
        return False
        
    info = check_youtube_live("@oagemono")
    if not info or not info.get("video_id"):
        print("[Livestream Check] Could not verify active live stream for @oagemono. Keeping existing playlist intact.")
        return False
        
    video_id = info["video_id"]
    is_live = info["is_live"]
    print(f"[Livestream Check] Verified @oagemono live stream -> video_id={video_id}, title={info.get('title')}")
    
    with open(movies_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    updated = False
    new_lines = []
    for line in lines:
        if "oage" in line.lower() and ("youtube.com" in line or "youtu.be" in line):
            new_line = f"https://www.youtube.com/watch?v={video_id} | oage | 0\n"
            if new_line != line:
                new_lines.append(new_line)
                updated = True
                print(f"  -> Updated oage stream line to: {new_line.strip()}")
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    if updated:
        with open(movies_path, "w", encoding="utf-8", newline="\n") as f:
            f.writelines(new_lines)
        print("[movies.txt] Successfully updated with verified livestream URL!")
        return True
    else:
        print("[movies.txt] Stream URL is already up to date.")
        return False

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    target = os.path.join(base_dir, "movies.txt")
    update_movies_with_live(target)
