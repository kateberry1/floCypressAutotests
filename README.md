# 🧪 FloWrestling.org Cypress E2E Tests

This project contains Cypress-based automated end-to-end tests for the [2025 EIWA Championship](https://www.flowrestling.org/events/12932757-2025-eiwa-championship) event page on FloWrestling.org.

---

## 📌 Features Covered

- ✅ **Page Load Validation** — checks title, banner, and event dates
- ✅ **Navigation Tabs** — verifies URL/content for Results, Videos, News, Schedule
- ✅ **Event Filters** — tests dropdown filters by Team, Weight Class, Round
- ✅ **Search Functionality** — checks input behavior and edge cases
- ✅ **Video Playback** — confirms replay and video controls work correctly

---

## ⚙️ Installation

```bash
npm install
```

---

## 🚀 Run Tests

To launch the Cypress Test Runner (interactive UI):

```bash
npx cypress open
```

To run tests in headless mode (useful for CI):

```bash
npm run test:run:local
```

---

## 🧪 GitHub Actions Integration

This project uses **GitHub Actions** for automated testing on every push.

- ✅ CI pipeline runs Cypress tests in headless mode
- 🧾 Generates a **Mochawesome HTML Report**
- 📎 Artifacts (including reports) are **available for download** in the GitHub Actions tab

**CI report sample output:**

```
✔  All specs passed!                        00:52       10       10        -        -        -
[mochawesome] Report HTML saved to /mochawesome-report/mochawesome.html
```

---

## ⚡ Speed Optimization

To improve test performance, external third-party scripts were blocked:

- ❌ `pagead2.googlesyndication.com`
- ❌ Analytics/tracking requests

✅ **Result**: faster page load and reduced flakiness in CI runs.

This was achieved using Cypress's `blockHosts` to stub/block unnecessary network traffic.

---

## 📁 Project Structure

```plaintext
.
├── cypress/
│   ├── e2e/
│   │   └── eventPage.spec.cy.js         # Test scenarios
│   ├── support/
│   │   ├── commands.js                  # Custom Cypress commands (optional)
│   │   └── eventPage.js                 # Page Object Model file
│   └── reports/
│       └── mochawesome-report/          # HTML reports output
├── .github/
│   └── workflows/
│       └── cypress.yml                  # GitHub Actions CI config
├── package.json
├── cypress.config.js
└── README.md
```

---

## 🙌 Contribution

Pull requests, feature suggestions, and issue reports are welcome!

---

## 🧠 Author Notes

Built with ❤️ by Kate using Cypress and GitHub Actions.
