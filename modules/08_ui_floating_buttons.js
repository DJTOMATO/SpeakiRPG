// FLOATING ACTION BUTTONS (Right-Click to Summon / Clean / LocalStorage Saved)
// ============================================================================

window.spkmodActiveFloatingButtons = new Map(); // sourceElement -> floatingElement

function spkmodGetButtonId(btn) {
    if (!btn) return null;
    if (btn.dataset && btn.dataset.spkmodBtnId) return btn.dataset.spkmodBtnId;
    if (btn.id) {
        btn.dataset.spkmodBtnId = "id:" + btn.id;
        return btn.dataset.spkmodBtnId;
    }

    if (typeof lunPanelElements === "object" && lunPanelElements) {
        for (const [key, el] of Object.entries(lunPanelElements)) {
            if (el === btn) {
                btn.dataset.spkmodBtnId = "panel:" + key;
                return btn.dataset.spkmodBtnId;
            }
        }
    }
    if (typeof editsModalElements === "object" && editsModalElements) {
        for (const [key, el] of Object.entries(editsModalElements)) {
            if (el === btn) {
                btn.dataset.spkmodBtnId = "edits:" + key;
                return btn.dataset.spkmodBtnId;
            }
        }
    }
    if (typeof lunHudElements === "object" && lunHudElements) {
        for (const [key, el] of Object.entries(lunHudElements)) {
            if (el === btn) {
                btn.dataset.spkmodBtnId = "hud:" + key;
                return btn.dataset.spkmodBtnId;
            }
        }
    }

    const parent = btn.closest("[id]");
    const parentId = parent ? parent.id : "body";
    const title = btn.title || "";
    const text = (btn.innerText || btn.textContent || "").trim();

    const domId = `dom:${parentId}|${title}|${text}`;
    if (btn.dataset) btn.dataset.spkmodBtnId = domId;
    return domId;
}

function spkmodFindButtonById(id) {
    if (!id) return null;

    if (id.startsWith("id:")) {
        return document.getElementById(id.slice(3));
    }
    if (id.startsWith("panel:")) {
        const key = id.slice(6);
        return (typeof lunPanelElements === "object" && lunPanelElements && lunPanelElements[key]) || null;
    }
    if (id.startsWith("edits:")) {
        const key = id.slice(6);
        return (typeof editsModalElements === "object" && editsModalElements && editsModalElements[key]) || null;
    }
    if (id.startsWith("hud:")) {
        const key = id.slice(4);
        return (typeof lunHudElements === "object" && lunHudElements && lunHudElements[key]) || null;
    }
    if (id.startsWith("dom:")) {
        const parts = id.slice(4).split("|");
        const parentId = parts[0];
        const title = parts[1];
        const text = parts[2];
        const root = (parentId && parentId !== "body") ? document.getElementById(parentId) : document.body;
        if (!root) return null;
        const allBtns = root.querySelectorAll("button, .spkmod-panel-btn, .spkmod-quick-btn");
        for (const b of allBtns) {
            if (title && b.title === title) return b;
            if (text && (b.innerText || b.textContent || "").trim() === text) return b;
        }
        return null;
    }
    return null;
}

function spkmodSaveFloatingButtons() {
    try {
        const list = [];
        for (const [sourceBtn, floatingBtn] of window.spkmodActiveFloatingButtons.entries()) {
            if (!floatingBtn || !floatingBtn.parentNode) continue;
            const btnId = spkmodGetButtonId(sourceBtn);
            if (!btnId) continue;
            const left = parseInt(floatingBtn.style.left, 10) || floatingBtn.offsetLeft;
            const top = parseInt(floatingBtn.style.top, 10) || floatingBtn.offsetTop;
            list.push({
                btnId,
                left,
                top
            });
        }
        localStorage.setItem("spkmod-floating-buttons", JSON.stringify(list));
    } catch (e) {
        console.warn("[SpeakiMod+] Failed to save floating buttons to localStorage:", e);
    }
}

function spkmodRestoreFloatingButtons() {
    try {
        const raw = localStorage.getItem("spkmod-floating-buttons");
        if (!raw) return;
        const list = JSON.parse(raw);
        if (!Array.isArray(list)) return;

        for (const item of list) {
            if (!item || !item.btnId) continue;
            const sourceBtn = spkmodFindButtonById(item.btnId);
            if (sourceBtn) {
                if (!window.spkmodActiveFloatingButtons.has(sourceBtn)) {
                    const left = Math.max(10, Math.min(window.innerWidth - 120, item.left));
                    const top = Math.max(10, Math.min(window.innerHeight - 40, item.top));
                    spkmodSpawnFloatingButton(sourceBtn, left, top, true);
                }
            }
        }
    } catch (e) {
        console.warn("[SpeakiMod+] Failed to restore floating buttons from localStorage:", e);
    }
}

function spkmodSpawnFloatingButton(sourceBtn, initialX, initialY, isRestoring = false) {
    if (!sourceBtn) return null;

    // Toggle: If a floating copy already exists for this button, remove it
    if (window.spkmodActiveFloatingButtons.has(sourceBtn)) {
        const existing = window.spkmodActiveFloatingButtons.get(sourceBtn);
        spkmodRemoveFloatingButton(existing);
        return null;
    }

    // Determine initial coordinates
    let spawnLeft = initialX || (window.innerWidth / 2 - 50);
    let spawnTop = initialY || (window.innerHeight / 2 - 20);

    if (initialX !== undefined && initialY !== undefined) {
        spawnLeft = Math.max(10, Math.min(window.innerWidth - 150, initialX + 12));
        spawnTop = Math.max(10, Math.min(window.innerHeight - 50, initialY + 8));
    }

    const floatingBtn = document.createElement("div");
    floatingBtn.className = "spkmod-floating-button";
    floatingBtn.dataset.spkmodFloating = "true";

    const baseColor = sourceBtn.style.color || "#ffd54a";

    floatingBtn.style.cssText = `
        position: fixed;
        left: ${spawnLeft}px;
        top: ${spawnTop}px;
        z-index: 2147483645;
        background: rgba(18, 22, 28, 0.92);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid ${sourceBtn.style.borderColor || "rgba(255, 213, 74, 0.65)"};
        border-radius: 6px;
        padding: 6px 12px;
        font-family: inherit;
        font-size: 11px;
        font-weight: bold;
        color: ${baseColor};
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.65), 0 0 10px rgba(255, 213, 74, 0.25);
        cursor: grab;
        user-select: none;
        touch-action: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease;
        max-width: 250px;
        white-space: nowrap;
    `;

    const rawTitle = sourceBtn.title || "";
    floatingBtn.title = (rawTitle ? rawTitle + "\n" : "") + "📌 Left-click: Use | Drag: Move | Right-click: Dismiss";

    // Text Label Container
    const labelSpan = document.createElement("span");
    const rawLabelText = (sourceBtn.innerText || sourceBtn.textContent || "").trim();
    if (rawLabelText) {
        labelSpan.innerText = rawLabelText;
    } else if (sourceBtn.innerHTML) {
        labelSpan.innerHTML = sourceBtn.innerHTML;
    } else {
        labelSpan.innerText = "Action";
    }
    floatingBtn.appendChild(labelSpan);

    // Subtle drag/pin badge
    const pinBadge = document.createElement("span");
    pinBadge.innerText = "📌";
    pinBadge.style.cssText = "font-size: 9px; opacity: 0.65; cursor: grab;";
    floatingBtn.appendChild(pinBadge);

    // Dynamic state synchronizer: keep label and style updated in real-time
    const observer = new MutationObserver(() => {
        if (sourceBtn) {
            const updatedText = (sourceBtn.innerText || sourceBtn.textContent || "").trim();
            if (updatedText) {
                labelSpan.innerText = updatedText;
            } else if (sourceBtn.innerHTML) {
                labelSpan.innerHTML = sourceBtn.innerHTML;
            }
            if (sourceBtn.style.color) {
                floatingBtn.style.color = sourceBtn.style.color;
            }
            if (sourceBtn.style.borderColor) {
                floatingBtn.style.borderColor = sourceBtn.style.borderColor;
            }
        }
    });
    observer.observe(sourceBtn, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    floatingBtn.__spkmodSourceBtn = sourceBtn;
    floatingBtn.__spkmodObserver = observer;
    window.spkmodActiveFloatingButtons.set(sourceBtn, floatingBtn);

    // Hover effect
    floatingBtn.onmouseenter = () => {
        if (document.pointerLockElement) {
            try { document.exitPointerLock(); } catch (_) {}
        }
        floatingBtn.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.8), 0 0 14px rgba(255, 213, 74, 0.5)";
        floatingBtn.style.borderColor = "#ffd54a";
    };
    floatingBtn.onmouseleave = () => {
        floatingBtn.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.65), 0 0 10px rgba(255, 213, 74, 0.25)";
        floatingBtn.style.borderColor = sourceBtn.style.borderColor || "rgba(255, 213, 74, 0.65)";
    };

    // Right-click: clean & dismiss
    floatingBtn.oncontextmenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        spkmodRemoveFloatingButton(floatingBtn);
    };

    // Drag vs Click handlers
    let isDragging = false;
    let startX = 0, startY = 0;
    let elemLeft = 0, elemTop = 0;

    function onPointerMove(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!isDragging && Math.hypot(dx, dy) > 4) {
            isDragging = true;
            floatingBtn.style.cursor = "grabbing";
        }
        if (isDragging) {
            const newLeft = Math.max(0, Math.min(window.innerWidth - floatingBtn.offsetWidth, elemLeft + dx));
            const newTop = Math.max(0, Math.min(window.innerHeight - floatingBtn.offsetHeight, elemTop + dy));
            floatingBtn.style.left = newLeft + "px";
            floatingBtn.style.top = newTop + "px";
        }
    }

    function onPointerUp(e) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        floatingBtn.style.cursor = "grab";

        if (isDragging) {
            spkmodSaveFloatingButtons();
        }

        if (!isDragging && e.button === 0) {
            if (spkmodTouchPinTriggered || floatingBtn.__spkmodDismissed || !floatingBtn.parentNode) {
                return;
            }
            // Click animation
            floatingBtn.style.transform = "scale(0.92)";
            setTimeout(() => {
                if (floatingBtn && floatingBtn.parentNode) floatingBtn.style.transform = "scale(1)";
            }, 120);

            // Execute action
            if (typeof sourceBtn.onclick === "function") {
                sourceBtn.onclick(e);
            } else {
                sourceBtn.click();
            }
        }
    }

    floatingBtn.onpointerdown = (e) => {
        if (e.button !== 0) return; // Only primary mouse button
        if (document.pointerLockElement) {
            try { document.exitPointerLock(); } catch (_) {}
        }
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        elemLeft = floatingBtn.offsetLeft;
        elemTop = floatingBtn.offsetTop;
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    };

    // Entrance animation
    floatingBtn.style.transform = "scale(0.75)";
    floatingBtn.style.opacity = "0";
    document.body.appendChild(floatingBtn);

    requestAnimationFrame(() => {
        floatingBtn.style.transition = "transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.18s ease";
        floatingBtn.style.transform = "scale(1)";
        floatingBtn.style.opacity = "1";
    });

    const btnName = (sourceBtn.innerText || sourceBtn.textContent || "Button").trim();
    if (!isRestoring && typeof chatLog === 'function') {
        chatLog(t("floatingBtnPinned", btnName) || `📌 Pinned "${btnName}" outside HUD! (Drag to move, Right-click to dismiss)`);
    }

    spkmodSaveFloatingButtons();
    return floatingBtn;
}

function spkmodRemoveFloatingButton(floatingBtn) {
    if (!floatingBtn) return;
    floatingBtn.__spkmodDismissed = true;
    if (floatingBtn.__spkmodObserver) {
        floatingBtn.__spkmodObserver.disconnect();
        floatingBtn.__spkmodObserver = null;
    }
    if (floatingBtn.__spkmodSourceBtn) {
        window.spkmodActiveFloatingButtons.delete(floatingBtn.__spkmodSourceBtn);
    }

    floatingBtn.style.transition = "transform 0.15s ease, opacity 0.15s ease";
    floatingBtn.style.transform = "scale(0.7)";
    floatingBtn.style.opacity = "0";

    const btnName = floatingBtn.innerText ? floatingBtn.innerText.replace("📌", "").trim() : "Button";

    setTimeout(() => {
        if (floatingBtn.parentNode) {
            floatingBtn.parentNode.removeChild(floatingBtn);
        }
    }, 160);

    spkmodSaveFloatingButtons();

    if (typeof chatLog === 'function') {
        chatLog(t("floatingBtnDismissed", btnName) || `🧹 Floating button "${btnName}" dismissed.`);
    }
}

window.spkmodSpawnFloatingButton = spkmodSpawnFloatingButton;
window.spkmodRemoveFloatingButton = spkmodRemoveFloatingButton;
window.spkmodSaveFloatingButtons = spkmodSaveFloatingButtons;
window.spkmodRestoreFloatingButtons = spkmodRestoreFloatingButtons;

// Auto-restore saved buttons on page load
setTimeout(spkmodRestoreFloatingButtons, 600);
setTimeout(spkmodRestoreFloatingButtons, 1800);
setTimeout(spkmodRestoreFloatingButtons, 3500);

// Mobile Touch "Hold to Pin" (Long-Press) Detector & Desktop Double Right-Click Delegate
let spkmodTouchHoldTimer = null;
let spkmodTouchHoldTarget = null;
let spkmodTouchStartX = 0;
let spkmodTouchStartY = 0;
let spkmodTouchPinTriggered = false;

function spkmodTriggerTouchPin(btn, clientX, clientY) {
    if (!btn) return;
    if (typeof lunDisableRightClickPinning !== "undefined" && lunDisableRightClickPinning) return;

    spkmodTouchPinTriggered = true;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
        try { navigator.vibrate(40); } catch (_) {}
    }

    if (btn.dataset.spkmodFloating === "true" || btn.classList.contains("spkmod-floating-button")) {
        spkmodRemoveFloatingButton(btn);
    } else {
        spkmodSpawnFloatingButton(btn, clientX, clientY);
    }

    setTimeout(() => {
        spkmodTouchPinTriggered = false;
    }, 450);
}

document.addEventListener("touchstart", (e) => {
    // Dismiss rich tooltip on mobile touch
    const tip = document.getElementById("spkmod-rich-tooltip");
    if (tip) tip.style.display = "none";

    if (!e.touches || e.touches.length !== 1) {
        if (spkmodTouchHoldTimer) {
            clearTimeout(spkmodTouchHoldTimer);
            spkmodTouchHoldTimer = null;
            spkmodTouchHoldTarget = null;
        }
        return;
    }

    const touch = e.touches[0];
    const btn = touch.target && touch.target.closest ? touch.target.closest("button.spkmod-panel-btn, #spkmod-effects-modal button, #spkmod-hud button, #spkmod-panel button, .spkmod-quick-btn, .spkmod-floating-button") : null;
    if (!btn) {
        if (spkmodTouchHoldTimer) {
            clearTimeout(spkmodTouchHoldTimer);
            spkmodTouchHoldTimer = null;
            spkmodTouchHoldTarget = null;
        }
        return;
    }

    // Ignore window close buttons, drag handles, or emoji picker items
    if (btn.innerText === "✕" || btn.id === "spkmod-drag-btn" || btn.id === "spkmod-close-btn" || btn.closest("#spkmod-emoji-picker")) return;

    if (typeof lunDisableRightClickPinning !== "undefined" && lunDisableRightClickPinning) return;

    spkmodTouchHoldTarget = btn;
    spkmodTouchStartX = touch.clientX;
    spkmodTouchStartY = touch.clientY;
    spkmodTouchPinTriggered = false;

    if (spkmodTouchHoldTimer) clearTimeout(spkmodTouchHoldTimer);
    spkmodTouchHoldTimer = setTimeout(() => {
        spkmodTouchHoldTimer = null;
        if (spkmodTouchHoldTarget) {
            spkmodTriggerTouchPin(spkmodTouchHoldTarget, spkmodTouchStartX, spkmodTouchStartY);
            spkmodTouchHoldTarget = null;
        }
    }, 500);
}, { passive: true, capture: true });

document.addEventListener("touchmove", (e) => {
    if (!spkmodTouchHoldTimer || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dist = Math.hypot(touch.clientX - spkmodTouchStartX, touch.clientY - spkmodTouchStartY);
    if (dist > 12) {
        clearTimeout(spkmodTouchHoldTimer);
        spkmodTouchHoldTimer = null;
        spkmodTouchHoldTarget = null;
    }
}, { passive: true, capture: true });

document.addEventListener("touchend", (e) => {
    if (spkmodTouchHoldTimer) {
        clearTimeout(spkmodTouchHoldTimer);
        spkmodTouchHoldTimer = null;
        spkmodTouchHoldTarget = null;
    }
    if (spkmodTouchPinTriggered) {
        e.preventDefault();
        e.stopPropagation();
    }
}, { capture: true });

document.addEventListener("touchcancel", () => {
    if (spkmodTouchHoldTimer) {
        clearTimeout(spkmodTouchHoldTimer);
        spkmodTouchHoldTimer = null;
        spkmodTouchHoldTarget = null;
    }
}, { passive: true, capture: true });

// Prevent accidental clicks on button release after holding to pin
document.addEventListener("click", (e) => {
    if (spkmodTouchPinTriggered) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
}, true);

// Global Double Right-Click Delegate for summoning buttons outside HUD (Desktop) & contextmenu handshake (Mobile)
let spkmodLastRightClickBtn = null;
let spkmodLastRightClickTime = 0;

document.addEventListener("contextmenu", (e) => {
    if (spkmodTouchPinTriggered) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }

    const btn = e.target.closest("button.spkmod-panel-btn, #spkmod-effects-modal button, #spkmod-hud button, #spkmod-panel button, .spkmod-quick-btn, .spkmod-floating-button");
    if (!btn) return;
    
    // Ignore window close buttons, drag handles, or emoji picker items
    if (btn.innerText === "✕" || btn.id === "spkmod-drag-btn" || btn.id === "spkmod-close-btn" || btn.closest("#spkmod-emoji-picker")) return;

    if (typeof lunDisableRightClickPinning !== "undefined" && lunDisableRightClickPinning) {
        return;
    }

    // Handshake: If mobile long-press dispatched a contextmenu while hold timer is active
    if (spkmodTouchHoldTimer && spkmodTouchHoldTarget === btn) {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(spkmodTouchHoldTimer);
        spkmodTouchHoldTimer = null;
        spkmodTouchHoldTarget = null;
        spkmodTriggerTouchPin(btn, e.clientX, e.clientY);
        return;
    }

    // If right-clicked a floating button itself on desktop, handled by its own listener
    if (btn.dataset.spkmodFloating === "true" || btn.classList.contains("spkmod-floating-button")) return;

    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    if (spkmodLastRightClickBtn === btn && (now - spkmodLastRightClickTime) <= 500) {
        spkmodLastRightClickBtn = null;
        spkmodLastRightClickTime = 0;
        spkmodSpawnFloatingButton(btn, e.clientX, e.clientY);
    } else {
        spkmodLastRightClickBtn = btn;
        spkmodLastRightClickTime = now;
    }
}, true);