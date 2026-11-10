import os
import re
import urllib.request

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
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
    )
    try:
        res = urllib.request.urlopen(req, timeout=10)
        final_url = res.geturl()
        html = res.read().decode("utf-8", errors="ignore")
        
        canonical = re.findall(r'<link\s+rel="canonical"\s+href="([^"]+)"', html)
        can_url = canonical[0] if canonical else final_url
        
        vid_match = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', can_url) or re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', html)
        if not vid_match:
            return None
            
        video_id = vid_match.group(1)
        is_live = ('"isLive":true' in html) or ('"isLiveContent":true' in html)
        
        title_match = re.search(r'<title>(.*?)</title>', html)
        title = ""
        if title_match:
            title = title_match.group(1).replace(" - YouTube", "").strip()
            title = title.replace("&amp;", "&").replace("&quot;", '"').replace("&#39;", "'").replace("&lt;", "<").replace("&gt;", ">")
            
        return {
            "video_id": video_id,
            "is_live": is_live,
            "title": title or "oage"
        }
    except Exception as e:
        print(f"Error checking live status for {handle_or_channel}: {e}")
        return None

def update_movies_with_live(movies_path):
    if not os.path.exists(movies_path):
        return False
        
    # Both channel ID ("UC9BRLn9BCnDYHaoXigXe0dA") and handle ("@oagemono") now work correctly
    info = check_youtube_live("UC9BRLn9BCnDYHaoXigXe0dA")
    if not info or not info.get("video_id"):
        print("[Livestream Check] Could not resolve live stream for channel.")
        return False
        
    video_id = info["video_id"]
    is_live = info["is_live"]
    print(f"[Livestream Check] Channel -> video_id={video_id}, is_live={is_live}")
    
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
        with open(movies_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
        print("[movies.txt] Successfully updated with newest livestream URL!")
        return True
    else:
        print("[movies.txt] Stream URL is already up to date.")
        return False

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    target = os.path.join(base_dir, "movies.txt")
    update_movies_with_live(target)
