# Rohan Majumdar — Full-Stack & AI Developer Portfolio

<div align="center">

![Portfolio Banner](https://img.shields.io/badge/Focus-Full--Stack%20%7C%20AI%20%7C%20Robotics-5eead4?style=for-the-badge&labelColor=06130e)
![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20ES6%20%7C%20HTML5%20%7C%20CSS3-e0a06b?style=for-the-badge&labelColor=06130e)
![Status](https://img.shields.io/badge/Status-Open%20to%20Collaborations-e8b34d?style=for-the-badge&labelColor=06130e)
[![GitHub Profile](https://img.shields.io/badge/GitHub-rohancoder19-ffffff?style=for-the-badge&logo=github&labelColor=06130e)](https://github.com/rohancoder19)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Rohan%20Majumdar-0077b5?style=for-the-badge&logo=linkedin&labelColor=06130e)](https://www.linkedin.com/in/rohan-majumdar-774852359/)

</div>

---

## ⚡ Overview

Welcome to the personal portfolio repository of **Rohan Majumdar**, a B.Tech Electronics & Computer Science undergrad at **Narula Institute of Technology**. 

This portfolio is engineered to sit right at the intersection of a browser tab and a breadboard—bridging **Full-Stack Web Development**, **Applied Artificial Intelligence**, and **Autonomous Robotics**. Built with modern **Vanilla ES6 Modules** and **CSS3 Design Systems**, it delivers a state-of-the-art interactive user experience without the bloat of heavy framework bundle sizes.


---

## 🏗️ Modular Architecture ("Split Code")

The codebase follows a strict **Separation of Concerns (SoC)**, dividing data, presentation, and logic into clean, manageable modules. This eliminates monolithic files and allows content updates in seconds.

```text
My-Portfolio/
├── index.html                  # Semantic HTML5 root structure
├── styles/                     # Component-Scoped CSS Design System
│   ├── variables.css           # Global color tokens, typography & glassmorphism rules
│   ├── base.css                # Global reset, cyber grid background & scroll reveal rules
│   ├── navbar.css              # Sticky frosted header & responsive drawer menu
│   ├── hero.css                # Hero banner, status pill & animated SVG schematic
│   ├── about.css               # About section & terminal Spec Sheet styling
│   ├── skills.css              # Skill category trays & interactive tags
│   ├── projects.css            # Bento grid layout & 3D tilt card styling
│   ├── contact.css             # Connector J1 hardware pin-out interface
│   └── footer.css              # Minimalist footer styling
└── js/                         # ES6 JavaScript Modules
    ├── main.js                 # App orchestrator & Intersection Observer initialization
    ├── data/                   # Content Layer (separated from DOM markup)
    │   ├── profile.js          # Bio, titles, and spec sheet attributes
    │   ├── skills.js           # Categorized skills arrays
    │   ├── projects.js         # Project definitions, tech tags, and links
    │   └── contact.js          # Hardware connector pin-out definitions
    └── components/             # UI Rendering & Interactivity Layer
        ├── navbar.js           # Navigation drawer & scroll-active link highlighting
        ├── skillsSection.js    # Renders skill trays from data modules
        ├── projectsSection.js  # Renders project cards & attaches 3D tilt listeners
        ├── contactSection.js   # Renders contact pins
        ├── cardTilt.js         # 3D perspective mouse-tracking math
        ├── heroSchematic.js    # Interactive SVG circuit burst animations
        └── canvasBackground.js # Interactive cursor-reactive particle simulation
```

---

## 🚀 Featured Projects

| Project | Category | Tech Stack | Links |
| :--- | :--- | :--- | :--- |
| **Skill Bridge AI** | Career Tech · AI Platform | React, Node.js, Express, MongoDB, Python, AI APIs | [GitHub](https://github.com/rohancoder19/skill-bridge-ai) · [Live Demo](https://skill-bridge-ai-bx90.onrender.com) |
| **AI Marketing SaaS** | Marketing · SaaS | React, Node.js, Express, MongoDB, Python, AI APIs | [GitHub](https://github.com/rohancoder19/ai-marketing-saas) · [Live Demo](https://ai-marketing-saas-101.vercel.app/) |
| **RoadResQ** | Public Safety · Emergency | React, Node.js, Express, MongoDB, JavaScript | [GitHub](https://github.com/rohancoder19/roadresq) · [Live Demo](https://roadresq-app.onrender.com/) |
| **Autonomous Vigilance Bot** | Robotics · Swarm AI | Python, ESP32, Arduino, OpenCV, Computer Vision, IoT | *Private Repo (Research)* |

---

## 🛠️ How to Run Locally

Because this project utilizes native **ES6 JavaScript Modules** (`<script type="module">`), browsers require it to be served via an HTTP server rather than directly opening `file://index.html` (due to CORS security policies).

### 1. Clone the Repository
```bash
git clone https://github.com/rohancoder19/My-Portfolio.git
cd My-Portfolio
```

### 2. Start a Local Dev Server
You can use any zero-config local static server:

**Using Node.js (`npx`):**
```bash
npx serve .
# OR
npx live-server
```

**Using Python:**
```bash
python -m http.server 8000
```

Open your browser and navigate to `http://localhost:8000` (or the port shown in your terminal).

---

## ⚙️ Customization Guide

Want to update your skills, add a new project, or change your bio? **You don't need to touch `index.html` or any CSS files!**

1. **Add a Project**: Open `js/data/projects.js` and append a new object to the `projectsData` array:
   ```javascript
   {
     id: "my-new-app",
     eyebrow: "AI · Web App",
     title: "My New App",
     description: "Description of what the app does.",
     tags: ["React", "Next.js", "Tailwind", "OpenAI"],
     links: {
       github: "https://github.com/rohancoder19/my-new-app",
       demo: "https://my-new-app.vercel.app"
     }
   }
   ```
2. **Update Skills**: Open `js/data/skills.js` and add/remove tags under any category array.
3. **Update Profile / Bio**: Open `js/data/profile.js` to edit your bio or spec sheet items.

The changes will automatically render on page load!

---

## 📬 Contact & Connector J1

Reach out across any channel:

- 📧 **Email**: [rohanmaj.jpg@gmail.com](mailto:rohanmaj.jpg@gmail.com)
- 💼 **LinkedIn**: [/in/rohan-majumdar](https://www.linkedin.com/in/rohan-majumdar-774852359/)
- 🐙 **GitHub**: [/rohancoder19](https://github.com/rohancoder19)

---

<div align="center">
  <p><strong>© 2026 Rohan Majumdar</strong> · Built one component at a time.</p>
</div>
