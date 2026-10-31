# Stage 5 — Submission Package & Final Verification Evidence

**Date:** 2026-10-31  
**Project:** A11ySTEM (Accessible Spatial Audio & Semantic Diagram Navigator)  
**Hackathon:** STEM2Connect AI Hackathon (Devpost: [https://stem2connect-online-hackathon.devpost.com/](https://stem2connect-online-hackathon.devpost.com/))  
**Status:** All submission fields, assets, documentation, and checklists compiled. Paused awaiting human video upload and final submission.

---

## 1. Verified Submission Package Assets

| Asset Name | Local File Path | Format / Ratio | File Size | Verification Status |
|---|---|---|---|---|
| **Thumbnail** | `submission/assets/thumbnail.png` | PNG (1200 x 800, 3:2) | 437 KB | Verified &lt; 5MB limit; crisp obsidian/amber contrast |
| **Demo Video** | `submission/assets/demo.mp4` | MP4 (1920x1080 @ 30 FPS, H.264/AAC) | 7.8 MB | Verified duration 1m 50s (&lt; 6 min rule), burned-in captions, 0 capture errors |
| **Gallery 01** | `submission/assets/gallery-01-opamp-circuit.png` | PNG (1200 x 800, 3:2) | 439 KB | Verified &lt; 5MB limit; caption: 121 chars |
| **Gallery 02** | `submission/assets/gallery-02-audio-sweep.png` | PNG (1200 x 800, 3:2) | 438 KB | Verified &lt; 5MB limit; caption: 107 chars |
| **Gallery 03** | `submission/assets/gallery-03-calculus-damped.png` | PNG (1200 x 800, 3:2) | 426 KB | Verified &lt; 5MB limit; caption: 104 chars |
| **Gallery 04** | `submission/assets/gallery-04-bst-tree.png` | PNG (1200 x 800, 3:2) | 417 KB | Verified &lt; 5MB limit; caption: 103 chars |
| **Gallery 05** | `submission/assets/gallery-05-svg-importer.png` | PNG (1200 x 800, 3:2) | 302 KB | Verified &lt; 5MB limit; caption: 103 chars |
| **Gallery 06** | `submission/assets/gallery-06-keyboard-guide.png` | PNG (1200 x 800, 3:2) | 320 KB | Verified &lt; 5MB limit; caption: 99 chars |
| **Gallery 07** | `submission/assets/gallery-07-real-world-validation.png` | PNG (1920 x 1080, 16:9) | 420 KB | Verified &lt; 5MB limit; caption: 103 chars |
| **Gallery 08** | `submission/assets/gallery-08-mobile-experience.png` | PNG (780 x 1688, Mobile) | 220 KB | Verified &lt; 5MB limit; caption: 101 chars |

---

## 2. External Links Verification

| Link Purpose | Target URL | HTTP Response | Functional Verification |
|---|---|---|---|
| **Live Deployed Web App** | [https://stem2connect-ai-hackathon.vercel.app](https://stem2connect-ai-hackathon.vercel.app) | **HTTP 200 OK** | Verified with Playwright: all Web Audio synthesis, SVG canvas rendering, and 2D keyboard navigation working live. |
| **Public GitHub Repository** | [https://github.com/Georgefifth/stem2connect-a11ystem](https://github.com/Georgefifth/stem2connect-a11ystem) | **HTTP 200 OK** | Verified public repository, MIT license, clean commit history, zero secrets/credentials. |
| **Hackathon Devpost Portal** | [https://stem2connect-online-hackathon.devpost.com/](https://stem2connect-online-hackathon.devpost.com/) | **Active** | Verified submission deadline: Nov 21, 2026 @ 11:59 PM EST. |

---

## 3. Self-Contained Deliverables Directory

- **`submission/fields.md`**: Direct copy-paste markdown for Devpost: project name, elevator pitch, about the project story, built-with tags, try-it-out links, and image captions.
- **`submission/checklist.md`**: Human action checklist with exact steps for uploading the demo video to YouTube/Vimeo and submitting on Devpost.
- **`submission/assets/`**: All binary media assets (thumbnail, demo video, and 8 gallery images).

---

## 4. Human Submission Checkpoint

As strictly mandated by `AGENTS.md` and `prompts/05-submission.md`:
- The AI Agent does not log in, enter passwords, handle 2FA, or click "Submit project" on Devpost.
- Everything is prepared in `submission/` for the human user to paste and submit.
