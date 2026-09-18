# Grih Udghaatan Reminder Website — Mamta Sweet Home

A premium, static, single-page website for the housewarming (Grih Udghaatan)
invitation of **Mamta Sweet Home**, held on **27 September 2026, 1:00 PM**,
at Choudhary Farm House (Bagharpur Road), Paigambarpur Sukhwasial, Uttar
Pradesh 244501.

Pure **HTML + CSS + Vanilla JavaScript**. No backend, no server, no API keys,
no third-party messaging services of any kind. Fully deployable as a static
site on **GitHub Pages**.

---

## ✨ Features

- Elegant traditional Indian invitation styling (cream / beige / mocha / gold)
- Embedded invitation card image
- Live countdown (days / hours / minutes / seconds) to the event
- Dynamic "X Days To Go" banner with special messages at 7 days, 3 days,
  1 day, and on the event day itself
- Auto-generated, always-current SMS reminder text
- Friends list with search, checkboxes, Select All, Clear All, and a live
  selected-count
- SMS preview box showing exactly what will be sent
- **"📱 Send Reminder"** button that opens the phone's native SMS app via an
  `sms:` URI, with the message and number pre-filled
- For multiple selected friends, the site walks through them **one at a
  time** with a "Next Friend" button and a progress indicator (e.g. "3 of 15")
- Indian mobile number validation & normalization (handles `+91`, `091`,
  leading `0`, spaces, dashes, etc.)
- "Share Invitation" button using the Web Share API, with a clipboard-copy
  fallback for unsupported browsers
- "Get Directions" button that opens the venue in Google Maps
- Mobile-first, fully responsive layout with no horizontal scrolling
- Accessible markup (ARIA labels, live regions, focus styles) and full
  support for `prefers-reduced-motion`

---

## ⚠️ Important limitation: this website CANNOT silently send SMS

Browsers and static websites have **no ability to send SMS messages on
their own**. There is no JavaScript API, and there is intentionally no
backend or third-party SMS/WhatsApp API wired into this project (per the
project requirements — no secrets, no API keys, no server).

What the **"Send Reminder"** button actually does:

1. It builds an `sms:<number>?&body=<message>` link.
2. It sets `window.location.href` to that link.
3. Your phone's **operating system** intercepts this and opens your
   **default SMS/Messages app**, with the recipient and message text
   already filled in.
4. **You** must tap **Send** inside that app. The website has no way to do
   this step for you, and it never claims otherwise — you'll always see the
   phrase **"SMS composer opened"**, never "SMS sent."

This is standard, expected behavior for any static website — it is a
platform-level restriction on every mobile OS (iOS and Android), not a bug
or limitation of this project's code.

### Why it works one friend at a time

Because `sms:` links only support **one action at a time** on most devices,
sending to multiple friends requires opening the composer once per friend.
The site keeps track of your selected friends as a queue and shows a
**"Next Friend"** button plus a `3 / 15`-style progress bar so you can move
through the whole list — pressing **Send** yourself in each composer window,
then returning to the site (or switching back to the browser tab) and
tapping **Next Friend**.

---

## 📁 Project Structure

```
grih-udgahatan-reminder/
├── index.html      # Page structure & content
├── style.css       # Premium traditional visual design
├── script.js       # Countdown, SMS composer flow, friends list, share, maps
├── README.md        # This file
└── assets/
    └── invitation.png   # The invitation card image
```

---

## 🛠 Editing the configuration

All editable data lives in **one place**: the `CONFIG` object at the top of
`script.js`.

```js
const CONFIG = {
  event: {
    name: "Grih Udghaatan — Mamta Sweet Home",
    dateTimeISO: "2026-09-27T13:00:00+05:30",   // Event date/time (IST)
    dateDisplay: "27 September 2026",
    timeDisplay: "1:00 PM",
    venueName: "Choudhary Farm House (Bagharpur Road)",
    venueAddress: "Choudhary Farm House, Bagharpur Road, Paigambarpur Sukhwasial, Uttar Pradesh 244501",
    courtesy: "Master Yograj Singh",
    contactNumbers: ["9719350184", "7906030720"]
  },
  friends: [
    { name: "Dev", phone: "6398011761" },
    // ...add, remove, or edit friends here
  ]
};
```

- To **change the event date/time**, edit `dateTimeISO` (keep the `+05:30`
  IST offset so the countdown is correct for every visitor, wherever they
  are).
- To **add/remove a friend**, add or remove an object in the `friends`
  array — only `name` and a 10-digit Indian mobile `phone` are required.
- To **replace the invitation image**, overwrite
  `assets/invitation.png` (keep the same filename, or update the `<img
  src="...">` in `index.html`).

No other file needs to change for typical updates.

---

## 🚀 Deploying to GitHub Pages

1. **Create a new GitHub repository** (e.g. `grih-udgahatan-reminder`).
2. **Upload all files**, keeping the folder structure intact:
   ```
   index.html
   style.css
   script.js
   README.md
   assets/invitation.png
   ```
   You can do this via the GitHub web UI ("Add file" → "Upload files") or
   via git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Grih Udghaatan reminder site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/grih-udgahatan-reminder.git
   git push -u origin main
   ```
3. In your repository, go to **Settings → Pages**.
4. Under **"Build and deployment"**, set:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (or `master`) and folder `/ (root)`
5. Click **Save**. GitHub will publish your site at:
   ```
   https://<your-username>.github.io/grih-udgahatan-reminder/
   ```
   (It may take 1–2 minutes for the first deployment to go live.)
6. Open that URL on your phone to test the **Send Reminder** and **Share
   Invitation** buttons — both work best on an actual mobile device with a
   default SMS app configured.

That's it — no build step, no server, no environment variables required.

---

## 🔒 Privacy & security notes

- All contact data (names & phone numbers) lives in plain view inside
  `script.js`. This is a **public, static site** — if your repository is
  public, this data is public too. If you'd like the friends list to stay
  private, either:
  - keep the GitHub repository **private** (GitHub Pages supports this on
    paid plans), or
  - remove the hard-coded friends list and instead ask users to type in
    their own numbers before deploying it more broadly.
- No API keys, tokens, or credentials are used anywhere in this project.
- No analytics, tracking, or third-party scripts are included.

---

## 🧪 Browser support notes

- The Web Share API (`navigator.share`) is supported on most modern mobile
  browsers (Chrome/Safari on Android/iOS) but not on most desktop browsers —
  the site automatically falls back to copying the invitation link/text to
  the clipboard.
- The `sms:` URI scheme is supported on iOS and Android. On desktop
  browsers without a paired messaging app, clicking "Send Reminder" may do
  nothing or prompt to choose an app — this feature is designed primarily
  for mobile use.

---

New home, new beginnings. 🪔🏡
