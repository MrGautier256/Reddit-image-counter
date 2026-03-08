README.md

# 🖼️ Reddit Image Counter

A Chrome extension that displays an image counter (e.g. **3 / 10**) on Reddit gallery posts, so you always know which image you're viewing out of the total.

![Chrome](https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome) ![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)

## Features

- Displays a **"X / Y"** badge on every Reddit image gallery
- Updates in real time as you navigate between images
- Popup menu with customizable options:
  - **Size** of the counter (small, medium, large)
  - **Opacity** of the background (10% to 100%)
  - **Position** (top-left, top-right, bottom-left, bottom-right)
  - **Visibility** toggle (show/hide the counter)
- Live preview in the popup
- Preferences saved and synced across devices

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-user/reddit-image-counter.git
   ```

Open chrome://extensions/ in Chrome
Enable Developer mode (top right)
Click Load unpacked
Select the project folder
Project Structure
reddit-image-counter/
├── manifest.json # Extension config (Manifest V3)
├── content.js # Script injected on Reddit (reads galleries)
├── popup.html # Popup menu UI
├── popup.js # Popup logic (saves preferences)
└── README.md

## How It Works

Reddit uses nested Shadow DOMs for its galleries:

gallery-carousel
└─ shadowRoot
└─ faceplate-carousel
└─ shadowRoot
└─ faceplate-pagination-indicator [pages="10" page-index="0"]

The extension traverses these shadow boundaries to read the pages and page-index attributes, then injects the badge directly into the gallery-carousel shadow root.

A 500ms polling interval is used because MutationObserver cannot observe across Shadow DOM boundaries.
