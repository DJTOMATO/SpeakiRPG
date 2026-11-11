import os
import re
import json
import html as html_module
import urllib.request

EXPECTED_CHANNEL_IDS = {"UC9BRLn9BCnDYHaoXigXe0dA"}

def extract_live_stream_from_html(html):
    """
    Extracts active livestream info for @oagemono from fetched YouTube HTML.
    Supports watch pages, channel home pages, and streams tabs.
    """
    # Channel verification proof in the HTML to ensure we don't pick up unrelated recommendations
    has_channel_proof = (
        any(cid in html for cid in EXPECTED_CHANNEL_IDS) or
        "oagemono" in html.lower() or
        "おあげ" in html
    )
    if not has_channel_proof:
        return None

    # Method 1: ytInitialPlayerResponse (Embedded player on watch or direct /live page)
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

            is_valid_channel = (cid in EXPECTED_CHANNEL_IDS) or ("oagemono" in author.lower()) or ("おあげ" in author)
            if vid and is_valid_channel and is_live:
                return {
                    "video_id": vid,
                    "is_live": True,
                    "title": html_module.unescape(title) if title else "oage",
                    "author": author or "oagemono"
                }
        except Exception as e:
            print(f"[Livestream Check] Warning: ytInitialPlayerResponse JSON parse error: {e}")

    # Method 2: ytInitialData (Channel Home page, avatar live ring, featured live banner, or streams tab)
    match_data = re.search(r'ytInitialData\s*=\s*({.+?});(?:var\s|</script>)', html)
    if match_data:
        try:
            data = json.loads(match_data.group(1))

            # 2a. Header decorated avatar live ring (Clickable live avatar ring)
            try:
                header = data.get("header", {})
                avatar = (
                    header.get("pageHeaderRenderer", {})
                    .get("content", {})
                    .get("pageHeaderViewModel", {})
                    .get("image", {})
                    .get("decoratedAvatarViewModel", {})
                )
                if avatar.get("liveData", {}).get("liveBadgeText") == "LIVE":
                    cmd = avatar.get("rendererContext", {}).get("commandContext", {}).get("onTap", {}).get("innertubeCommand", {})
                    vid = cmd.get("watchEndpoint", {}).get("videoId")
                    if vid:
                        return {
                            "video_id": vid,
                            "is_live": True,
                            "title": "oage",
                            "author": "oagemono"
                        }
            except Exception:
                pass

            # 2b. Channel featured live banner / player on Home tab
            try:
                tabs = data.get("contents", {}).get("twoColumnBrowseResultsRenderer", {}).get("tabs", [])
                for tab in tabs:
                    sections = (
                        tab.get("tabRenderer", {})
                        .get("content", {})
                        .get("sectionListRenderer", {})
                        .get("contents", [])
                    )
                    for sec in sections:
                        for isec in sec.get("itemSectionRenderer", {}).get("contents", []):
                            featured = isec.get("channelFeaturedContentRenderer", {})
                            for item in featured.get("items", []):
                                lockup = item.get("lockupViewModel", {})
                                is_live = False
                                overlays = lockup.get("contentImage", {}).get("thumbnailViewModel", {}).get("overlays", [])
                                for ov in overlays:
                                    badges = ov.get("thumbnailBottomOverlayViewModel", {}).get("badges", [])
                                    for b in badges:
                                        tb = b.get("thumbnailBadgeViewModel", {})
                                        if tb.get("badgeStyle") == "THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE" or tb.get("text") == "LIVE":
                                            is_live = True
                                if is_live:
                                    vid = lockup.get("contentId")
                                    title = lockup.get("rendererContext", {}).get("accessibilityContext", {}).get("label", "oage")
                                    if vid:
                                        return {
                                            "video_id": vid,
                                            "is_live": True,
                                            "title": html_module.unescape(title) if title else "oage",
                                            "author": "oagemono"
                                        }
            except Exception:
                pass

            # 2c. Recursive search for any video element with an explicit LIVE badge
            found_live_candidates = []
            def search_data(obj):
                if isinstance(obj, dict):
                    vid = obj.get("contentId") or obj.get("videoId")
                    if vid and len(vid) == 11 and (obj.get("contentType") == "LOCKUP_CONTENT_TYPE_VIDEO" or "videoId" in obj):
                        s = json.dumps(obj)
                        if "THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE" in s or '"text":"LIVE"' in s or '"style":"LIVE"' in s or '"BADGE_STYLE_TYPE_LIVE_NOW"' in s:
                            title = ""
                            if "rendererContext" in obj:
                                title = obj.get("rendererContext", {}).get("accessibilityContext", {}).get("label", "")
                            elif "title" in obj:
                                t = obj.get("title", {})
                                title = t.get("simpleText") or "".join(r.get("text", "") for r in t.get("runs", []))
                            found_live_candidates.append((vid, title))
                    for v in obj.values():
                        search_data(v)
                elif isinstance(obj, list):
                    for it in obj:
                        search_data(it)

            search_data(data)
            if found_live_candidates:
                vid, title = found_live_candidates[0]
                return {
                    "video_id": vid,
                    "is_live": True,
                    "title": html_module.unescape(title) if title else "oage",
                    "author": "oagemono"
                }
        except Exception as e:
            print(f"[Livestream Check] Warning: ytInitialData JSON parse error: {e}")

    # Method 3: Canonical / og:url / shortlink tag pointing to watch?v=
    canonical_links = re.findall(r'<link\s+rel="canonical"\s+href="([^"]+)"', html)
    og_links = re.findall(r'<meta\s+property="og:url"\s+content="([^"]+)"', html)
    short_links = re.findall(r'<link\s+rel="shortlinkUrl"\s+href="([^"]+)"', html)
    candidates = canonical_links + og_links + short_links
    for url in candidates:
        m = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', url) or re.search(r'youtu\.be/([a-zA-Z0-9_-]{11})', url)
        if m:
            vid = m.group(1)
            # Confirm the page indicates live content
            is_live_indicators = (
                '"isLive":true' in html or
                '"isLiveContent":true' in html or
                'VIEW_COUNT_VIDEO_TYPE_LIVE' in html or
                'watching now' in html or
                'liveBadgeText' in html or
                'THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE' in html
            )
            if is_live_indicators:
                title_match = re.search(r'<title>(.*?)</title>', html)
                title = title_match.group(1).replace(" - YouTube", "").strip() if title_match else "oage"
                return {
                    "video_id": vid,
                    "is_live": True,
                    "title": html_module.unescape(title) if title else "oage",
                    "author": "oagemono"
                }

    # Method 4: HTML pattern regex fallback (proximity search for videoId with LIVE badge)
    for m in re.finditer(r'\{"videoId":"([a-zA-Z0-9_-]{11})"', html):
        vid = m.group(1)
        window = html[max(0, m.start() - 600):min(len(html), m.end() + 600)]
        if "BADGE_STYLE_LIVE" in window or '"text":"LIVE"' in window or '"style":"LIVE"' in window or 'liveBadgeText' in window:
            title_match = re.search(r'<title>(.*?)</title>', html)
            title = title_match.group(1).replace(" - YouTube", "").strip() if title_match else "oage"
            return {
                "video_id": vid,
                "is_live": True,
                "title": html_module.unescape(title) if title else "oage",
                "author": "oagemono"
            }

    return None

def check_youtube_live(handle_or_channel):
    identifier = handle_or_channel.strip()
    if identifier.startswith("UC"):
        candidate_urls = [
            f"https://www.youtube.com/channel/{identifier}/live",
            f"https://www.youtube.com/channel/{identifier}",
            f"https://www.youtube.com/channel/{identifier}/streams",
        ]
    else:
        handle = identifier if identifier.startswith("@") else f"@{identifier}"
        candidate_urls = [
            f"https://www.youtube.com/{handle}/live",
            f"https://www.youtube.com/{handle}",
            f"https://www.youtube.com/{handle}/streams",
            f"https://www.youtube.com/channel/UC9BRLn9BCnDYHaoXigXe0dA/live",
            f"https://www.youtube.com/channel/UC9BRLn9BCnDYHaoXigXe0dA"
        ]

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
        "Cookie": "CONSENT=PENDING+999; SOCS=CAESEwgDEgk2MTQ1MTY1NzQaAmVuIAEaBgiA_LyaBg;"
    }

    for url in candidate_urls:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=12) as res:
                html = res.read().decode("utf-8", errors="ignore")

            live_info = extract_live_stream_from_html(html)
            if live_info and live_info.get("video_id"):
                return live_info
        except Exception as e:
            print(f"[Livestream Check] Notice: Failed checking {url}: {e}")
            continue

    print(f"[Livestream Check] Channel page did not contain a verified live stream for {handle_or_channel}.")
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
    target = os.path.join(base_dir, "assets/movies.txt")
    if not os.path.exists(target):
        target = os.path.join(base_dir, "movies.txt")
    update_movies_with_live(target)
