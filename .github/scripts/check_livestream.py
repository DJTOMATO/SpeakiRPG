import os
import re
import json
import html as html_module
import urllib.request

EXPECTED_CHANNEL_IDS = {"UC9BRLn9BCnDYHaoXigXe0dA"}
EXPECTED_AUTHOR_KEYWORDS = {"おあげ", "oagemono", "oage"}

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
    "Cookie": "CONSENT=PENDING+999; SOCS=CAESEwgDEgk2MTQ1MTY1NzQaAmVuIAEaBgiA_LyaBg;"
}

def is_target_channel(channel_id=None, author=None):
    if channel_id and channel_id in EXPECTED_CHANNEL_IDS:
        return True
    if author:
        author_lower = author.lower()
        if any(kw in author_lower or kw in author for kw in EXPECTED_AUTHOR_KEYWORDS):
            return True
    return False

def verify_live_video(video_id):
    """
    Directly queries YouTube's Innertube Player API (with HTML scraping fallback)
    for the candidate video_id to verify that:
      1. It is indeed uploaded/streamed by @oagemono (UC9BRLn9BCnDYHaoXigXe0dA)
      2. It is currently LIVE (isLive or isLiveContent is True)
    Returns a dict with video details if verified, else None.
    """
    if not video_id or len(video_id) != 11:
        return None

    # Step 1: Innertube Player API (clean structured JSON)
    try:
        url = "https://www.youtube.com/youtubei/v1/player"
        payload = {
            "videoId": video_id,
            "context": {"client": {"clientName": "WEB", "clientVersion": "2.20240101.00.00"}}
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json", "User-Agent": DEFAULT_HEADERS["User-Agent"]}
        )
        with urllib.request.urlopen(req, timeout=10) as res:
            doc = json.loads(res.read().decode("utf-8"))

        v_details = doc.get("videoDetails", {})
        cid = v_details.get("channelId", "")
        author = v_details.get("author", "")
        is_live = bool(v_details.get("isLive") or v_details.get("isLiveContent"))
        title = v_details.get("title", "")

        if is_target_channel(cid, author) and is_live:
            return {
                "video_id": video_id,
                "is_live": True,
                "title": title or "oage",
                "author": author or "oagemono",
                "channel_id": cid
            }
        else:
            print(f"[Livestream Check] Candidate {video_id} failed verification (channel={author} [{cid}], is_live={is_live})")
            return None
    except Exception as e:
        print(f"[Livestream Check] Notice: Player API error for {video_id}: {e}")

    # Step 2: HTML watch page fallback
    try:
        watch_url = f"https://www.youtube.com/watch?v={video_id}"
        req = urllib.request.Request(watch_url, headers=DEFAULT_HEADERS)
        with urllib.request.urlopen(req, timeout=10) as res:
            html = res.read().decode("utf-8", errors="ignore")

        match_player = re.search(r'ytInitialPlayerResponse\s*=\s*({.+?});(?:var\s|</script>)', html)
        if match_player:
            d = json.loads(match_player.group(1))
            vd = d.get("videoDetails", {})
            cid = vd.get("channelId", "")
            author = vd.get("author", "")
            is_live = bool(vd.get("isLive") or vd.get("isLiveContent"))
            title = vd.get("title", "")
            if is_target_channel(cid, author) and is_live:
                return {
                    "video_id": video_id,
                    "is_live": True,
                    "title": html_module.unescape(title) if title else "oage",
                    "author": author or "oagemono",
                    "channel_id": cid
                }
            else:
                print(f"[Livestream Check] Candidate {video_id} failed HTML verification (channel={author} [{cid}], is_live={is_live})")
    except Exception as e:
        print(f"[Livestream Check] Notice: HTML watch verification error for {video_id}: {e}")

    return None

def check_innertube_channel(channel_id="UC9BRLn9BCnDYHaoXigXe0dA"):
    """
    Checks channel status using YouTube Innertube Browse API.
    Inspects avatar live ring and Streams tab.
    """
    url = "https://www.youtube.com/youtubei/v1/browse"

    try:
        payload = {
            "browseId": channel_id,
            "context": {"client": {"clientName": "WEB", "clientVersion": "2.20240101.00.00"}}
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": DEFAULT_HEADERS["User-Agent"]}
        )
        with urllib.request.urlopen(req, timeout=10) as res:
            doc = json.loads(res.read().decode("utf-8"))

        # 1. Header decorated avatar live ring
        header = doc.get("header", {})
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
                verified = verify_live_video(vid)
                if verified:
                    return verified

        # 2. Streams tab
        tabs = doc.get("contents", {}).get("twoColumnBrowseResultsRenderer", {}).get("tabs", [])
        streams_params = None
        for tab in tabs:
            tr = tab.get("tabRenderer", {})
            url_endpoint = tr.get("endpoint", {}).get("commandMetadata", {}).get("webCommandMetadata", {}).get("url", "")
            title = tr.get("title", "")
            if "/streams" in url_endpoint or "live" in title.lower():
                streams_params = tr.get("endpoint", {}).get("browseEndpoint", {}).get("params")
                break

        if streams_params:
            payload_streams = {
                "browseId": channel_id,
                "params": streams_params,
                "context": {"client": {"clientName": "WEB", "clientVersion": "2.20240101.00.00"}}
            }
            req_streams = urllib.request.Request(
                url,
                data=json.dumps(payload_streams).encode("utf-8"),
                headers={"Content-Type": "application/json", "User-Agent": DEFAULT_HEADERS["User-Agent"]}
            )
            with urllib.request.urlopen(req_streams, timeout=10) as res_streams:
                doc_streams = json.loads(res_streams.read().decode("utf-8"))

            tabs_s = doc_streams.get("contents", {}).get("twoColumnBrowseResultsRenderer", {}).get("tabs", [])
            for tab_s in tabs_s:
                tr_s = tab_s.get("tabRenderer", {})
                if tr_s.get("selected"):
                    grid = tr_s.get("content", {}).get("richGridRenderer", {})
                    for item in grid.get("contents", []):
                        lockup = item.get("richItemRenderer", {}).get("content", {}).get("lockupViewModel", {})
                        overlays = lockup.get("contentImage", {}).get("thumbnailViewModel", {}).get("overlays", [])
                        is_live_badge = False
                        for ov in overlays:
                            badges = ov.get("thumbnailBottomOverlayViewModel", {}).get("badges", [])
                            for b in badges:
                                tb = b.get("thumbnailBadgeViewModel", {})
                                if tb.get("badgeStyle") == "THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE" or tb.get("text") == "LIVE":
                                    is_live_badge = True
                        if is_live_badge:
                            vid = lockup.get("contentId")
                            if vid:
                                verified = verify_live_video(vid)
                                if verified:
                                    return verified
    except Exception as e:
        print(f"[Livestream Check] Notice: Innertube channel browse error: {e}")

    return None

def extract_live_stream_from_html(html):
    """
    Extracts active livestream info for @oagemono from fetched YouTube HTML.
    Supports watch pages, channel home pages, and streams tabs.
    CRITICAL: Never inspect secondaryResults (sidebar recommendations)
    and ALWAYS verify candidates against EXPECTED_CHANNEL_IDS.
    """
    has_channel_proof = (
        any(cid in html for cid in EXPECTED_CHANNEL_IDS) or
        "oagemono" in html.lower() or
        "おあげ" in html
    )
    if not has_channel_proof:
        return None

    # Method 1: ytInitialPlayerResponse
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

            if vid and is_target_channel(cid, author) and is_live:
                return {
                    "video_id": vid,
                    "is_live": True,
                    "title": html_module.unescape(title) if title else "oage",
                    "author": author or "oagemono",
                    "channel_id": cid
                }
        except Exception as e:
            print(f"[Livestream Check] Warning: ytInitialPlayerResponse JSON parse error: {e}")

    # Method 2: ytInitialData
    match_data = re.search(r'ytInitialData\s*=\s*({.+?});(?:var\s|</script>)', html)
    if match_data:
        try:
            data = json.loads(match_data.group(1))

            # 2a. Header avatar live ring
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
                        verified = verify_live_video(vid)
                        if verified:
                            return verified
            except Exception:
                pass

            # 2b. If this is a watch page (twoColumnWatchNextResults)
            # CRITICAL: Only look at PRIMARY results, NEVER secondaryResults (recommendations)!
            try:
                wn = data.get("contents", {}).get("twoColumnWatchNextResults", {})
                if wn:
                    vid = data.get("currentVideoEndpoint", {}).get("watchEndpoint", {}).get("videoId")
                    primary = wn.get("results", {}).get("results", {}).get("contents", [])
                    is_live = False
                    owner_match = False
                    title = "oage"

                    for c in primary:
                        if "videoPrimaryInfoRenderer" in c:
                            vpi = c["videoPrimaryInfoRenderer"]
                            vc = vpi.get("viewCount", {}).get("videoViewCountRenderer", {})
                            if vc.get("isLive") or "watching now" in json.dumps(vc):
                                is_live = True
                            t = vpi.get("title", {})
                            title = t.get("simpleText") or "".join(r.get("text", "") for r in t.get("runs", []))
                        if "videoSecondaryInfoRenderer" in c:
                            vsi = c["videoSecondaryInfoRenderer"]
                            owner = vsi.get("owner", {}).get("videoOwnerRenderer", {})
                            owner_cid = owner.get("navigationEndpoint", {}).get("browseEndpoint", {}).get("browseId", "")
                            owner_name = "".join(r.get("text", "") for r in owner.get("title", {}).get("runs", []))
                            if is_target_channel(owner_cid, owner_name):
                                owner_match = True

                    if vid and is_live and owner_match:
                        return {
                            "video_id": vid,
                            "is_live": True,
                            "title": html_module.unescape(title) if title else "oage",
                            "author": "oagemono"
                        }
            except Exception:
                pass

            # 2c. Channel tabs (Streams or Home)
            try:
                tabs = data.get("contents", {}).get("twoColumnBrowseResultsRenderer", {}).get("tabs", [])
                for tab in tabs:
                    t_rend = tab.get("tabRenderer", {})
                    # Check richGridRenderer (Streams tab)
                    grid = t_rend.get("content", {}).get("richGridRenderer", {})
                    for item in grid.get("contents", []):
                        lockup = item.get("richItemRenderer", {}).get("content", {}).get("lockupViewModel", {})
                        overlays = lockup.get("contentImage", {}).get("thumbnailViewModel", {}).get("overlays", [])
                        for ov in overlays:
                            badges = ov.get("thumbnailBottomOverlayViewModel", {}).get("badges", [])
                            for b in badges:
                                tb = b.get("thumbnailBadgeViewModel", {})
                                if tb.get("badgeStyle") == "THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE" or tb.get("text") == "LIVE":
                                    vid = lockup.get("contentId")
                                    if vid:
                                        verified = verify_live_video(vid)
                                        if verified:
                                            return verified

                    # Check sectionListRenderer (Home tab featured content)
                    sections = t_rend.get("content", {}).get("sectionListRenderer", {}).get("contents", [])
                    for sec in sections:
                        for isec in sec.get("itemSectionRenderer", {}).get("contents", []):
                            featured = isec.get("channelFeaturedContentRenderer", {})
                            for item in featured.get("items", []):
                                lockup = item.get("lockupViewModel", {})
                                overlays = lockup.get("contentImage", {}).get("thumbnailViewModel", {}).get("overlays", [])
                                for ov in overlays:
                                    badges = ov.get("thumbnailBottomOverlayViewModel", {}).get("badges", [])
                                    for b in badges:
                                        tb = b.get("thumbnailBadgeViewModel", {})
                                        if tb.get("badgeStyle") == "THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE" or tb.get("text") == "LIVE":
                                            vid = lockup.get("contentId")
                                            if vid:
                                                verified = verify_live_video(vid)
                                                if verified:
                                                    return verified
            except Exception:
                pass

        except Exception as e:
            print(f"[Livestream Check] Warning: ytInitialData JSON parse error: {e}")

    return None

def check_youtube_live(handle_or_channel="@oagemono"):
    primary_cid = "UC9BRLn9BCnDYHaoXigXe0dA"

    # Strategy 1: Innertube channel browse API
    # Fastest and most accurate method; inspects avatar live ring and Streams tab
    info = check_innertube_channel(primary_cid)
    if info and info.get("video_id"):
        return info

    # Strategy 2: HTML scraping fallback across verified channel URLs
    candidate_urls = [
        f"https://www.youtube.com/@oagemono/streams",
        f"https://www.youtube.com/@oagemono",
        f"https://www.youtube.com/@oagemono/live",
        f"https://www.youtube.com/channel/{primary_cid}/streams",
        f"https://www.youtube.com/channel/{primary_cid}/live",
    ]

    for url in candidate_urls:
        try:
            req = urllib.request.Request(url, headers=DEFAULT_HEADERS)
            with urllib.request.urlopen(req, timeout=12) as res:
                html = res.read().decode("utf-8", errors="ignore")

            live_info = extract_live_stream_from_html(html)
            if live_info and live_info.get("video_id"):
                verified = verify_live_video(live_info["video_id"])
                if verified:
                    return verified
        except Exception as e:
            print(f"[Livestream Check] Notice: Failed checking {url}: {e}")
            continue

    print(f"[Livestream Check] Channel did not contain a verified live stream for {handle_or_channel}.")
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
    targets = [
        os.path.join(base_dir, "assets/movies.txt"),
        os.path.join(base_dir, "movies.txt")
    ]
    for target in targets:
        if os.path.exists(target):
            update_movies_with_live(target)
