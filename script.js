/* ==========================================================================
   Grih Udghaatan Reminder — script.js
   Pure vanilla JS. No backend, no APIs, no secrets.
   ========================================================================== */

/* ------------------------------------------------------------------------
   1. CONFIGURATION  — edit everything here
   ------------------------------------------------------------------------ */
const CONFIG = {
  event: {
    name: "Grih Udghaatan — Mamta Sweet Home",
    // ISO string with explicit +05:30 (IST) offset, so it's correct for every visitor's device.
    dateTimeISO: "2026-09-27T13:00:00+05:30",
    dateDisplay: "27 September 2026",
    timeDisplay: "1:00 PM",
    venueName: "Choudhary Farm House (Bagharpur Road)",
    venueAddress: "Choudhary Farm House, Bagharpur Road, Paigambarpur Sukhwasial, Uttar Pradesh 244501",
    courtesy: "Master Yograj Singh",
    contactNumbers: ["9719350184", "7906030720"]
  },

  // Friends to remind. Phone numbers are 10-digit Indian mobile numbers (no country code needed here).
  friends: [
    { name: "Dev", phone: "6398011761" },
    { name: "Adnan Masoori", phone: "9536960160" },
    { name: "Akin Siddiqui", phone: "7037384548" },
    { name: "Aman Kumar", phone: "8449009827" },
    { name: "Bittu Kumar", phone: "9690440504" },
    { name: "Lalit Kumar", phone: "7351900610" },
    { name: "Nigam Chouhan", phone: "7351048231" },
    { name: "Nikhil Kumar", phone: "8273154562" },
    { name: "Nipendra", phone: "8266964396" },
    { name: "Nitin Kumar", phone: "9027629793" },
    { name: "Sameer Malik", phone: "7454852834" },
    { name: "Shishansh Rathore", phone: "9410235839" },
    { name: "Vishwas Chouhan", phone: "7037506818" },
    { name: "Mohd Shami", phone: "8923591576" },
    { name: "Rajat Khirdoniya", phone: "9528057096" }
  ]
};

/* ------------------------------------------------------------------------
   2. UTILITIES
   ------------------------------------------------------------------------ */

/** Normalize + validate an Indian mobile number.
 *  Accepts input with spaces, dashes, +91, 0091, leading 0, etc.
 *  Returns { valid: bool, normalized: "91XXXXXXXXXX" | null, local: "XXXXXXXXXX" | null }
 */
function normalizeIndianMobile(raw) {
  if (!raw) return { valid: false, normalized: null, local: null };
  let digits = String(raw).replace(/[^\d]/g, "");

  // Strip leading country/trunk prefixes
  if (digits.startsWith("0091")) digits = digits.slice(4);
  else if (digits.startsWith("091")) digits = digits.slice(3);
  else if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);

  const validPattern = /^[6-9]\d{9}$/; // Indian mobile numbers: 10 digits, starts 6-9
  if (validPattern.test(digits)) {
    return { valid: true, normalized: `91${digits}`, local: digits };
  }
  return { valid: false, normalized: null, local: digits || null };
}

function formatLocalPhone(local) {
  if (!local || local.length !== 10) return local || "—";
  return `${local.slice(0, 5)} ${local.slice(5)}`;
}

function pad2(n) { return String(n).padStart(2, "0"); }

/* ------------------------------------------------------------------------
   3. COUNTDOWN
   ------------------------------------------------------------------------ */
const eventDate = new Date(CONFIG.event.dateTimeISO);

const els = {
  daysToGoMsg: document.getElementById("daysToGoMsg"),
  cdDays: document.getElementById("cd-days"),
  cdHours: document.getElementById("cd-hours"),
  cdMins: document.getElementById("cd-mins"),
  cdSecs: document.getElementById("cd-secs"),
  countdownGrid: document.getElementById("countdownGrid"),
  specialMsg: document.getElementById("specialMsg"),
  todayMessage: document.getElementById("todayMessage"),
  friendSearch: document.getElementById("friendSearch"),
  selectAllBtn: document.getElementById("selectAllBtn"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  selectedCount: document.getElementById("selectedCount"),
  friendsList: document.getElementById("friendsList"),
  smsPreview: document.getElementById("smsPreview"),
  sendReminderBtn: document.getElementById("sendReminderBtn"),
  nextFriendBtn: document.getElementById("nextFriendBtn"),
  sequenceProgressWrap: document.getElementById("sequenceProgressWrap"),
  sequenceProgressText: document.getElementById("sequenceProgressText"),
  sequenceProgressBar: document.getElementById("sequenceProgressBar"),
  smsStatusNote: document.getElementById("smsStatusNote"),
  shareBtn: document.getElementById("shareBtn"),
  shareFallbackNote: document.getElementById("shareFallbackNote"),
  venueBtn: document.getElementById("venueBtn")
};

function getDaysToGo() {
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  // Compare using calendar-day difference at local midnight for a friendlier "days to go"
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventLocal = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  return Math.round((eventLocal - startOfToday) / msPerDay);
}

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    els.countdownGrid.style.display = "none";
    els.daysToGoMsg.textContent = "🎉 The Grih Udghaatan is here — welcome home!";
    els.specialMsg.hidden = false;
    els.specialMsg.textContent = "Today is the day! We can't wait to celebrate this auspicious moment with you. 🪔🏡";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  els.cdDays.textContent = pad2(days);
  els.cdHours.textContent = pad2(hours);
  els.cdMins.textContent = pad2(mins);
  els.cdSecs.textContent = pad2(secs);

  const daysToGo = getDaysToGo();
  els.daysToGoMsg.textContent = daysToGo > 0
    ? `✨ ${daysToGo} Day${daysToGo === 1 ? "" : "s"} To Go ✨`
    : `🎉 The Grih Udghaatan is here!`;

  // Special messages
  let special = "";
  if (daysToGo === 7) {
    special = "📿 Just one week to go! Time to plan your visit to Mamta Sweet Home.";
  } else if (daysToGo === 3) {
    special = "🌼 Only 3 days left! We're eagerly preparing to welcome you.";
  } else if (daysToGo === 1) {
    special = "🪔 It's tomorrow! Please plan to arrive by 1:00 PM.";
  } else if (daysToGo === 0) {
    special = "🎉 Today's the day! See you at Choudhary Farm House by 1:00 PM.";
  }

  if (special) {
    els.specialMsg.hidden = false;
    els.specialMsg.textContent = special;
  } else {
    els.specialMsg.hidden = true;
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ------------------------------------------------------------------------
   4. MESSAGE GENERATION
   ------------------------------------------------------------------------ */
function buildReminderMessage() {
  const daysToGo = getDaysToGo();
  let opener;
  if (daysToGo > 1) {
    opener = `Just ${daysToGo} days to go for our Grih Udghaatan! 🏡🪔`;
  } else if (daysToGo === 1) {
    opener = `It's tomorrow! Our Grih Udghaatan is happening. 🏡🪔`;
  } else if (daysToGo === 0) {
    opener = `Today's the day — our Grih Udghaatan! 🏡🪔`;
  } else {
    opener = `Reminder: our Grih Udghaatan celebration. 🏡🪔`;
  }

  return (
`${opener}
We warmly invite you to the housewarming (Grih Udghaatan) of Mamta Sweet Home.

📅 Date: ${CONFIG.event.dateDisplay}
🕐 Time: ${CONFIG.event.timeDisplay}
📍 Venue: ${CONFIG.event.venueAddress}

By Courtesy: ${CONFIG.event.courtesy}
Contact: ${CONFIG.event.contactNumbers.join(" / ")}

Your presence and blessings will make this occasion truly auspicious. New home, new beginnings! 🙏`
  );
}

function refreshTodayMessage() {
  els.todayMessage.value = buildReminderMessage();
}
refreshTodayMessage();
// Keep today's message fresh if the tab stays open across midnight.
setInterval(refreshTodayMessage, 60 * 1000);

/* ------------------------------------------------------------------------
   5. FRIENDS LIST (search, select all, clear all, selection count)
   ------------------------------------------------------------------------ */
const friendState = CONFIG.friends.map((f, idx) => {
  const norm = normalizeIndianMobile(f.phone);
  return {
    id: `friend-${idx}`,
    name: f.name,
    rawPhone: f.phone,
    valid: norm.valid,
    normalized: norm.normalized,
    local: norm.local,
    selected: false
  };
});

function renderFriendsList(filterText = "") {
  const q = filterText.trim().toLowerCase();
  els.friendsList.innerHTML = "";

  const visible = friendState.filter(f => f.name.toLowerCase().includes(q));

  if (visible.length === 0) {
    const li = document.createElement("li");
    li.className = "no-results";
    li.textContent = "No friends match your search.";
    els.friendsList.appendChild(li);
    return;
  }

  visible.forEach(friend => {
    const li = document.createElement("li");
    li.className = "friend-item" + (friend.valid ? "" : " invalid");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = friend.id;
    checkbox.checked = friend.selected;
    checkbox.disabled = !friend.valid;
    checkbox.setAttribute("aria-describedby", `${friend.id}-phone`);
    checkbox.addEventListener("change", () => {
      friend.selected = checkbox.checked;
      updateSelectedCount();
      updateSmsPreviewAndButton();
    });

    const label = document.createElement("label");
    label.setAttribute("for", friend.id);

    const nameSpan = document.createElement("span");
    nameSpan.className = "friend-name";
    nameSpan.textContent = friend.name;

    const phoneSpan = document.createElement("span");
    phoneSpan.className = "friend-phone";
    phoneSpan.id = `${friend.id}-phone`;
    phoneSpan.textContent = friend.valid
      ? `+91 ${formatLocalPhone(friend.local)}`
      : `Invalid number: "${friend.rawPhone}"`;

    label.appendChild(nameSpan);
    label.appendChild(phoneSpan);

    li.appendChild(checkbox);
    li.appendChild(label);
    els.friendsList.appendChild(li);
  });
}

function updateSelectedCount() {
  const total = friendState.length;
  const selected = friendState.filter(f => f.selected).length;
  els.selectedCount.textContent = `${selected} of ${total} selected`;
}

function getSelectedFriends() {
  return friendState.filter(f => f.selected && f.valid);
}

els.friendSearch.addEventListener("input", () => {
  renderFriendsList(els.friendSearch.value);
});

els.selectAllBtn.addEventListener("click", () => {
  const q = els.friendSearch.value.trim().toLowerCase();
  friendState.forEach(f => {
    if (f.valid && f.name.toLowerCase().includes(q)) f.selected = true;
  });
  renderFriendsList(els.friendSearch.value);
  updateSelectedCount();
  updateSmsPreviewAndButton();
});

els.clearAllBtn.addEventListener("click", () => {
  friendState.forEach(f => (f.selected = false));
  renderFriendsList(els.friendSearch.value);
  updateSelectedCount();
  updateSmsPreviewAndButton();
});

renderFriendsList();
updateSelectedCount();

/* ------------------------------------------------------------------------
   6. SMS PREVIEW + SEQUENTIAL "sms:" COMPOSER FLOW
   ------------------------------------------------------------------------ */
let smsQueue = [];      // array of friend objects to message, in order
let smsQueueIndex = 0;  // pointer into the queue

function updateSmsPreviewAndButton() {
  const selected = getSelectedFriends();
  els.smsPreview.value = buildReminderMessage();
  els.sendReminderBtn.disabled = selected.length === 0;

  // If selection changes mid-sequence, reset the sequence UI.
  resetSequenceUI();
}

function resetSequenceUI() {
  smsQueue = [];
  smsQueueIndex = 0;
  els.sequenceProgressWrap.hidden = true;
  els.nextFriendBtn.hidden = true;
  els.sendReminderBtn.hidden = false;
  els.smsStatusNote.textContent = "";
}

function openSmsComposer(friend) {
  const message = buildReminderMessage();
  const encodedMsg = encodeURIComponent(message);
  // sms: URI — widely supported. Using ?&body= works across iOS/Android quirks.
  const smsUri = `sms:${friend.normalized}?&body=${encodedMsg}`;
  window.location.href = smsUri;
  els.smsStatusNote.textContent = `SMS composer opened for ${friend.name} (+91 ${formatLocalPhone(friend.local)}). Please press Send in your messaging app.`;
}

function startSmsSequence() {
  const selected = getSelectedFriends();
  if (selected.length === 0) return;

  smsQueue = selected;
  smsQueueIndex = 0;

  updateSequenceProgress();
  openSmsComposer(smsQueue[smsQueueIndex]);

  if (smsQueue.length > 1) {
    els.sequenceProgressWrap.hidden = false;
    els.nextFriendBtn.hidden = false;
    els.sendReminderBtn.hidden = true;
  } else {
    els.sequenceProgressWrap.hidden = true;
    els.nextFriendBtn.hidden = true;
  }
}

function updateSequenceProgress() {
  const current = smsQueueIndex + 1;
  const total = smsQueue.length;
  els.sequenceProgressText.textContent = `Reminder ${current} of ${total}`;
  els.sequenceProgressBar.style.width = `${(current / total) * 100}%`;
}

els.sendReminderBtn.addEventListener("click", startSmsSequence);

els.nextFriendBtn.addEventListener("click", () => {
  smsQueueIndex++;
  if (smsQueueIndex >= smsQueue.length) {
    els.smsStatusNote.textContent = "✅ All selected reminders have been opened. Sequence complete.";
    resetSequenceUI();
    return;
  }
  updateSequenceProgress();
  openSmsComposer(smsQueue[smsQueueIndex]);

  if (smsQueueIndex === smsQueue.length - 1) {
    els.nextFriendBtn.textContent = "Finish";
  }
});

updateSmsPreviewAndButton();

/* ------------------------------------------------------------------------
   7. SHARE INVITATION (Web Share API + fallback)
   ------------------------------------------------------------------------ */
els.shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: "Grih Udghaatan — Mamta Sweet Home",
    text: `You are cordially invited to the Grih Udghaatan of Mamta Sweet Home on ${CONFIG.event.dateDisplay} at ${CONFIG.event.timeDisplay}. Venue: ${CONFIG.event.venueAddress}.`,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      els.shareFallbackNote.hidden = true;
    } catch (err) {
      // User cancelled share or it failed — no need to alarm them.
      if (err && err.name !== "AbortError") {
        showShareFallback(shareData);
      }
    }
  } else {
    showShareFallback(shareData);
  }
});

function showShareFallback(shareData) {
  const fullText = `${shareData.text} ${shareData.url}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullText).then(() => {
      els.shareFallbackNote.hidden = false;
      els.shareFallbackNote.textContent = "Link copied to clipboard! Paste it anywhere to share the invitation.";
    }).catch(() => {
      els.shareFallbackNote.hidden = false;
      els.shareFallbackNote.textContent = `Copy this to share: ${fullText}`;
    });
  } else {
    els.shareFallbackNote.hidden = false;
    els.shareFallbackNote.textContent = `Copy this to share: ${fullText}`;
  }
}

/* ------------------------------------------------------------------------
   8. VENUE / GOOGLE MAPS LINK
   ------------------------------------------------------------------------ */
(function setVenueLink() {
  const query = encodeURIComponent(CONFIG.event.venueAddress);
  els.venueBtn.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
})();
