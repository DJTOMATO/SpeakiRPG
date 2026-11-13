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

INNERTUBE_CLIENT = {
    "clientName": "WEB",
    "clientVersion": "2.20240101.00.00",
    "hl": "en",
    "gl": "US"
}


def is_target_channel(channel_id=None, author=None, canonical_url=None):
    if channel_id:
        return channel_id in EXPECTED_CHANNEL_IDS
    if canonical_url and "oagemono" in canonical_url.lower():
        return True
    if author:
        author_lower = author.lower()
        return any(kw in author_lower or kw in author for kw in EXPECTED_AUTHOR_KEYWORDS)
    return False


def _post_innertube(endpoint, payload_fields, timeout=10):
    url = f"https://www.youtube.com/youtubei/v1/{endpoint}"
    payload = dict(payload_fields)
    payload["context"] = {"client": INNERTUBE_CLIENT}
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": DEFAULT_HEADERS["User-Agent"]}
    )
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return json.loads(res.read().decode("utf-8"))


def _fetch_html(url, timeout=12):
    req = urllib.request.Request(url, headers=DEFAULT_HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return res.read().decode("utf-8", errors="ignore")


def _extract_json_var(html, var_name):
    match = re.search(rf'\b{re.escape(var_name)}\s*=\s*\{{', html)
    if not match:
        return None
    try:
        obj, _ = json.JSONDecoder().raw_decode(html, match.end() - 1)
        return obj if isinstance(obj, dict) else None
    except Exception as e:
        print(f"[Livestream Check] Warning: {var_name} JSON parse error: {e}")
        return None


def _parse_player_data(doc, expected_video_id=None, unescape_title=False):
    """
    Parses an Innertube Player API or ytInitialPlayerResponse payload.
    Returns (verified_dict_or_None, is_definitive).
    is_definitive=False indicates YouTube omitted videoDetails (e.g. LOGIN_REQUIRED bot gate),
    so callers should fall back to other verification sources.
    """
    if not isinstance(doc, dict):
        return None, False

    v_details = doc.get("videoDetails", {})
    cid = v_details.get("channelId", "")
    author = v_details.get("author", "")
    if not cid and not author:
        return None, False

    vid = v_details.get("videoId") or expected_video_id
    if expected_video_id and v_details.get("videoId") and v_details.get("videoId") != expected_video_id:
        return None, True

    live_details = (
        doc.get("microformat", {})
        .get("playerMicroformatRenderer", {})
        .get("liveBroadcastDetails", {})
    )
    is_live = bool(v_details.get("isLive") or live_details.get("isLiveNow")) and not bool(v_details.get("isUpcoming"))
    title = v_details.get("title", "")
    if unescape_title and title:
        title = html_module.unescape(title)

    if vid and is_target_channel(cid, author) and is_live:
        return {
            "video_id": vid,
            "is_live": True,
            "title": title or "oage",
            "author": author or "oagemono",
            "channel_id": cid
        }, True

    print(f"[Livestream Check] Candidate {vid} failed verification (channel={author} [{cid}], is_live={is_live})")
    return None, True


def _parse_watch_next_data(doc, expected_video_id=None):
    """
    Parses twoColumnWatchNextResults from Innertube Next API or watch HTML ytInitialData.
    CRITICAL: Inspects ONLY primary results, never secondaryResults (sidebar recommendations).
    Returns (verified_dict_or_None, is_definitive).
    """
    if not isinstance(doc, dict):
        return None, False

    wn = doc.get("contents", {}).get("twoColumnWatchNextResults", {})
    if not wn:
        return None, False

    current_vid = doc.get("currentVideoEndpoint", {}).get("watchEndpoint", {}).get("videoId")
    if expected_video_id and current_vid and current_vid != expected_video_id:
        return None, True

    vid = current_vid or expected_video_id
    primary = wn.get("results", {}).get("results", {}).get("contents", [])
    is_live = False
    owner_cid = ""
    owner_name = ""
    owner_url = ""
    title = ""

    for c in primary:
        if "videoPrimaryInfoRenderer" in c:
            vpi = c["videoPrimaryInfoRenderer"]
            vc = vpi.get("viewCount", {}).get("videoViewCountRenderer", {})
            if vc.get("isLive") or "watching now" in json.dumps(vc, ensure_ascii=False).lower():
                is_live = True
            t = vpi.get("title", {})
            title = t.get("simpleText") or "".join(r.get("text", "") for r in t.get("runs", []))
        if "videoSecondaryInfoRenderer" in c:
            vsi = c["videoSecondaryInfoRenderer"]
            owner = vsi.get("owner", {}).get("videoOwnerRenderer", {})
            browse_ep = owner.get("navigationEndpoint", {}).get("browseEndpoint", {})
            owner_cid = browse_ep.get("browseId", "")
            owner_url = browse_ep.get("canonicalBaseUrl", "")
            owner_name = "".join(r.get("text", "") for r in owner.get("title", {}).get("runs", []))

    if not owner_cid and not owner_name and not owner_url:
        return None, False

    if vid and is_target_channel(owner_cid, owner_name, owner_url) and is_live:
        return {
            "video_id": vid,
            "is_live": True,
            "title": html_module.unescape(title) if title else "oage",
            "author": owner_name or "oagemono",
            "channel_id": owner_cid
        }, True

    print(f"[Livestream Check] Candidate {vid} failed watch-next verification (channel={owner_name} [{owner_cid}], is_live={is_live})")
    return None, True


def _extract_avatar_live_candidate(doc):
    header = doc.get("header", {})
    avatar = (
        header.get("pageHeaderRenderer", {})
        .get("content", {})
        .get("pageHeaderViewModel", {})
        .get("image", {})
        .get("decoratedAvatarViewModel", {})
    )
    if avatar.get("liveData"):
        cmd = avatar.get("rendererContext", {}).get("commandContext", {}).get("onTap", {}).get("innertubeCommand", {})
        return cmd.get("watchEndpoint", {}).get("videoId")
    return None


def _extract_live_video_id_from_item(item):
    if not isinstance(item, dict):
        return None

    lockup = item.get("lockupViewModel") or item.get("richItemRenderer", {}).get("content", {}).get("lockupViewModel")
    if lockup:
        overlays = lockup.get("contentImage", {}).get("thumbnailViewModel", {}).get("overlays", [])
        for ov in overlays:
            badges = ov.get("thumbnailBottomOverlayViewModel", {}).get("badges", [])
            for b in badges:
                tb = b.get("thumbnailBadgeViewModel", {})
                if tb.get("badgeStyle") == "THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE" or tb.get("text") == "LIVE":
                    return lockup.get("contentId")

    vr = item.get("videoRenderer") or item.get("gridVideoRenderer") or item.get("richItemRenderer", {}).get("content", {}).get("videoRenderer")
    if vr:
        for b in vr.get("badges", []):
            mb = b.get("metadataBadgeRenderer", {})
            if mb.get("style") == "BADGE_STYLE_TYPE_LIVE_NOW" or mb.get("label") == "LIVE":
                return vr.get("videoId")
        for ov in vr.get("thumbnailOverlays", []):
            ts = ov.get("thumbnailOverlayTimeStatusRenderer", {})
            if ts.get("style") == "LIVE":
                return vr.get("videoId")

    return None


def verify_live_video(video_id):
    """
    Verifies a candidate video_id using:
      1. Innertube Player API (/youtubei/v1/player)
      2. Innertube Next API (/youtubei/v1/next) — resilient on datacenter IPs when /player returns LOGIN_REQUIRED
      3. Watch page HTML fallback (ytInitialPlayerResponse and ytInitialData)
    Ensures the video belongs to @oagemono (UC9BRLn9BCnDYHaoXigXe0dA) and is currently LIVE.
    Returns a dict with video details if verified, else None.
    """
    if not video_id or not isinstance(video_id, str) or len(video_id) != 11:
        return None

    # Step 1: Innertube Player API (clean structured JSON)
    try:
        doc = _post_innertube("player", {"videoId": video_id}, timeout=10)
        result, definitive = _parse_player_data(doc, expected_video_id=video_id)
        if definitive:
            return result
        ps = doc.get("playabilityStatus", {})
        print(f"[Livestream Check] Notice: Player API returned no videoDetails for {video_id} (status={ps.get('status')}); trying fallbacks.")
    except Exception as e:
        print(f"[Livestream Check] Notice: Player API error for {video_id}: {e}")

    # Step 2: Innertube Next API (provides primary watch metadata even when /player is bot-gated)
    try:
        doc_next = _post_innertube("next", {"videoId": video_id}, timeout=10)
        result, definitive = _parse_watch_next_data(doc_next, expected_video_id=video_id)
        if definitive:
            return result
    except Exception as e:
        print(f"[Livestream Check] Notice: Next API error for {video_id}: {e}")

    # Step 3: HTML watch page fallback (ytInitialPlayerResponse + ytInitialData)
    try:
        html = _fetch_html(f"https://www.youtube.com/watch?v={video_id}", timeout=10)

        player_data = _extract_json_var(html, "ytInitialPlayerResponse")
        result, definitive = _parse_player_data(player_data, expected_video_id=video_id, unescape_title=True)
        if definitive:
            return result

        init_data = _extract_json_var(html, "ytInitialData")
        result, definitive = _parse_watch_next_data(init_data, expected_video_id=video_id)
        if definitive:
            return result
    except Exception as e:
        print(f"[Livestream Check] Notice: HTML watch verification error for {video_id}: {e}")

    return None


def _verify_candidate(video_id, checked_cache=None):
    if not video_id:
        return None
    if checked_cache is not None and video_id in checked_cache:
        return checked_cache[video_id]
    verified = verify_live_video(video_id)
    if checked_cache is not None:
        checked_cache[video_id] = verified
    return verified


def _scan_tab_for_live(tab_renderer, checked_cache=None):
    content = tab_renderer.get("content", {})
    for item in content.get("richGridRenderer", {}).get("contents", []):
        vid = _extract_live_video_id_from_item(item)
        verified = _verify_candidate(vid, checked_cache)
        if verified:
            return verified

    for sec in content.get("sectionListRenderer", {}).get("contents", []):
        for isec in sec.get("itemSectionRenderer", {}).get("contents", []):
            featured = isec.get("channelFeaturedContentRenderer", {})
            for item in featured.get("items", []):
                vid = _extract_live_video_id_from_item(item)
                verified = _verify_candidate(vid, checked_cache)
                if verified:
                    return verified

    return None


def check_innertube_channel(channel_id="UC9BRLn9BCnDYHaoXigXe0dA", checked_cache=None):
    """
    Checks channel status using YouTube Innertube Browse API.
    Inspects avatar live ring, Home featured content, and Streams tab.
    """
    try:
        doc = _post_innertube("browse", {"browseId": channel_id}, timeout=10)

        # 1. Header decorated avatar live ring
        avatar_vid = _extract_avatar_live_candidate(doc)
        verified = _verify_candidate(avatar_vid, checked_cache)
        if verified:
            return verified

        # 2. Initial tabs (e.g. Home featured content) & locate Streams tab params
        tabs = doc.get("contents", {}).get("twoColumnBrowseResultsRenderer", {}).get("tabs", [])
        streams_params = None
        for tab in tabs:
            tr = tab.get("tabRenderer", {})
            verified = _scan_tab_for_live(tr, checked_cache)
            if verified:
                return verified

            url_endpoint = tr.get("endpoint", {}).get("commandMetadata", {}).get("webCommandMetadata", {}).get("url", "")
            title = tr.get("title", "")
            if "/streams" in url_endpoint or "live" in title.lower():
                streams_params = tr.get("endpoint", {}).get("browseEndpoint", {}).get("params")

        # 3. Streams tab
        if streams_params:
            doc_streams = _post_innertube("browse", {"browseId": channel_id, "params": streams_params}, timeout=10)
            for tab_s in doc_streams.get("contents", {}).get("twoColumnBrowseResultsRenderer", {}).get("tabs", []):
                tr_s = tab_s.get("tabRenderer", {})
                if tr_s.get("selected"):
                    verified = _scan_tab_for_live(tr_s, checked_cache)
                    if verified:
                        return verified
    except Exception as e:
        print(f"[Livestream Check] Notice: Innertube channel browse error: {e}")

    return None


def extract_live_stream_from_html(html, checked_cache=None):
    """
    Extracts verified active livestream info for @oagemono from fetched YouTube HTML.
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
    player_data = _extract_json_var(html, "ytInitialPlayerResponse")
    result, definitive = _parse_player_data(player_data, unescape_title=True)
    if definitive and result:
        return result

    # Method 2: ytInitialData
    data = _extract_json_var(html, "ytInitialData")
    if data:
        # 2a. Header avatar live ring
        avatar_vid = _extract_avatar_live_candidate(data)
        verified = _verify_candidate(avatar_vid, checked_cache)
        if verified:
            return verified

        # 2b. Watch page primary results (never secondaryResults)
        result, _ = _parse_watch_next_data(data)
        if result:
            return result

        # 2c. Channel tabs (Streams or Home)
        tabs = data.get("contents", {}).get("twoColumnBrowseResultsRenderer", {}).get("tabs", [])
        for tab in tabs:
            verified = _scan_tab_for_live(tab.get("tabRenderer", {}), checked_cache)
            if verified:
                return verified

    return None


def check_youtube_live(handle_or_channel="@oagemono"):
    primary_cid = "UC9BRLn9BCnDYHaoXigXe0dA"
    checked_cache = {}

    # Strategy 1: Innertube channel browse API
    # Fastest and most accurate method; inspects avatar live ring, Home, and Streams tab
    info = check_innertube_channel(primary_cid, checked_cache=checked_cache)
    if info and info.get("video_id"):
        return info

    # Strategy 2: HTML scraping fallback across verified channel URLs
    candidate_urls = [
        "https://www.youtube.com/@oagemono/streams",
        "https://www.youtube.com/@oagemono",
        "https://www.youtube.com/@oagemono/live",
        f"https://www.youtube.com/channel/{primary_cid}/streams",
        f"https://www.youtube.com/channel/{primary_cid}/live",
    ]

    for url in candidate_urls:
        try:
            html = _fetch_html(url, timeout=12)
            live_info = extract_live_stream_from_html(html, checked_cache=checked_cache)
            if live_info and live_info.get("video_id"):
                return live_info
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
        if not line.lstrip().startswith("#") and "oage" in line.lower() and ("youtube.com" in line or "youtu.be" in line):
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
