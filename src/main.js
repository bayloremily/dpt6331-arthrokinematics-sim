import "./styles.css";
import { SHOULDER_SCENARIOS, ShoulderModule } from "./joints/shoulderModule.js";

const app = document.querySelector("#app");

const tabs = ["Shoulder", "Ankle", "Hip", "Knee"];
let activeTab = "Shoulder";
let shoulderModule = null;

const state = {
  scenarioId: "shoulderAbduction",
  scenario: SHOULDER_SCENARIOS[0],
  scenarioOptions: SHOULDER_SCENARIOS.map((scenario) => ({
    id: scenario.id,
    name: scenario.name
  })),
  congruency: 100,
  statusLabel: "Ready to test abduction",
  feedbackTone: "neutral",
  feedbackMessage: SHOULDER_SCENARIOS[0].idleFeedback,
  motionSelection: {
    roll: null,
    glide: null
  },
  appliedMotion: null
};

function renderApp() {
  app.innerHTML = `
    <div class="app-shell">
      <div class="app-frame">
        <header class="topbar">
          <div class="brand-lockup">
            <h1>Baylor Arthrokinematics Simulator</h1>
            <p>Interactive joint mechanics lab for DPT learners</p>
          </div>
          <div class="status-pill">
            <span>Live Scenario</span>
            <span class="live-scenario-label">${activeTab === "Shoulder" ? state.scenario.name : `${activeTab} Module`}</span>
          </div>
        </header>

        <nav class="tabs" aria-label="Joint navigation">
          ${tabs
            .map(
              (tab) => `
                <button class="tab ${tab === activeTab ? "active" : ""}" type="button" data-tab="${tab}">
                  ${tab}
                </button>
              `
            )
            .join("")}
        </nav>

        ${activeTab === "Shoulder" ? renderShoulderLayout() : renderComingSoon(activeTab)}
      </div>
    </div>
  `;

  bindTabEvents();

  if (activeTab === "Shoulder") {
    bindShoulderControls();
    mountShoulderScene();
    syncShoulderUI();
  } else {
    destroyShoulderScene();
  }
}

function renderShoulderLayout() {
  return `
    <main class="content-grid">
      <section class="panel-stack">
        <article class="panel">
          <span class="eyebrow">Scenario</span>
          <h2>Choose Motion Scenario</h2>
          <label class="scenario-select-wrap">
            <span class="sr-only">Shoulder scenario</span>
            <select class="scenario-select" data-scenario-select>
              ${state.scenarioOptions
                .map(
                  (scenario) => `
                    <option value="${scenario.id}" ${state.scenarioId === scenario.id ? "selected" : ""}>
                      ${scenario.name}
                    </option>
                  `
                )
                .join("")}
            </select>
          </label>
          <p data-scenario-summary>${state.scenario.surfaceRule}. Moving bone: ${state.scenario.movingBone}.</p>
        </article>

        <article class="panel">
          <span class="eyebrow">Roll</span>
          <h3>Select Roll Direction</h3>
          <div class="button-grid direction-grid">
            ${["Superior", "Inferior", "Anterior", "Posterior"]
              .map(
                (direction) => `
                  <button
                    class="action-button ${state.motionSelection.roll === direction ? "active" : ""}"
                    type="button"
                    data-roll="${direction}"
                  >
                    Roll ${direction}
                  </button>
                `
              )
              .join("")}
          </div>
        </article>

        <article class="panel">
          <span class="eyebrow">Glide</span>
          <h3>Select Glide Direction</h3>
          <div class="button-grid direction-grid">
            ${["Superior", "Inferior", "Anterior", "Posterior"]
              .map(
                (direction) => `
                  <button
                    class="action-button ${state.motionSelection.glide === direction ? "active" : ""}"
                    type="button"
                    data-glide="${direction}"
                  >
                    Glide ${direction}
                  </button>
                `
              )
              .join("")}
          </div>
          <div class="button-stack">
            <button class="reset-button primary-button" type="button" data-apply>Apply Motion</button>
            <button class="reset-button secondary-button" type="button" data-show-correct>Show Correct Motion</button>
            <button class="reset-button" type="button" data-reset>Try Again / Reset</button>
          </div>
        </article>

        <article class="status-card">
          <span class="eyebrow">Joint Congruency</span>
          <h2>${state.statusLabel}</h2>
          <div class="meter-caption">
            <span>100%</span>
            <span>0%</span>
          </div>
          <div class="meter-track" aria-label="Joint congruency meter">
            <div class="meter-fill" style="width: ${state.congruency}%"></div>
          </div>
          <div class="meter-scale">
            <span>Separated</span>
            <span>Centered</span>
          </div>
        </article>

        <article class="feedback-banner ${state.feedbackTone}">
          <p>${state.feedbackMessage}</p>
        </article>
      </section>

      <section class="viewer-shell">
        <div class="scene-header">
          <div>
            <span class="eyebrow">3D Lab</span>
            <h2>${state.scenario.name}</h2>
            <p>Orbit around the model, apply the motion, and watch the humeral head respond to your roll-glide pairing.</p>
          </div>
          <div class="scene-badge">Mobilization: ${state.scenario.correctMobilization}</div>
        </div>
        <div class="viewer-canvas" id="shoulder-viewer">
          <div class="viewer-overlay">
            <div class="overlay-chip">Correct roll: ${state.scenario.correctRoll}</div>
            <div class="overlay-chip">Correct glide: ${state.scenario.correctGlide}</div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderComingSoon(tab) {
  return `
    <section class="coming-soon">
      <div class="coming-soon-card">
        <span class="eyebrow">Module In Development</span>
        <h2>${tab} simulator coming soon</h2>
        <p>The shared simulator framework is ready for new joint modules, but only the shoulder experience is active right now.</p>
      </div>
    </section>
  `;
}

function bindTabEvents() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTab = button.dataset.tab;
      if (nextTab === activeTab) {
        return;
      }

      activeTab = nextTab;
      renderApp();
    });
  });
}

function bindShoulderControls() {
  document.querySelector("[data-scenario-select]")?.addEventListener("change", (event) => {
    shoulderModule?.setScenario(event.target.value);
  });

  document.querySelectorAll("[data-roll]").forEach((button) => {
    button.addEventListener("click", () => {
      shoulderModule?.toggleRoll(button.dataset.roll);
    });
  });

  document.querySelectorAll("[data-glide]").forEach((button) => {
    button.addEventListener("click", () => {
      shoulderModule?.toggleGlide(button.dataset.glide);
    });
  });

  document.querySelector("[data-apply]")?.addEventListener("click", () => {
    shoulderModule?.applyMotion();
  });

  document.querySelector("[data-show-correct]")?.addEventListener("click", () => {
    shoulderModule?.showCorrectMotion();
  });

  document.querySelector("[data-reset]")?.addEventListener("click", () => {
    shoulderModule?.reset();
  });
}

function mountShoulderScene() {
  const mount = document.querySelector("#shoulder-viewer");
  if (!mount) {
    return;
  }

  if (shoulderModule) {
    return;
  }

  shoulderModule = new ShoulderModule({
    mount,
    onStateChange(nextState) {
      Object.assign(state, nextState);
      syncShoulderUI();
    }
  });
}

function destroyShoulderScene() {
  shoulderModule?.dispose();
  shoulderModule = null;
}

function syncShoulderUI() {
  const meterFill = document.querySelector(".meter-fill");
  const statusHeading = document.querySelector(".status-card h2");
  const feedbackBanner = document.querySelector(".feedback-banner");
  const feedbackText = feedbackBanner?.querySelector("p");
  const scenarioSelect = document.querySelector("[data-scenario-select]");
  const sceneTitle = document.querySelector(".scene-header h2");
  const sceneBadge = document.querySelector(".scene-badge");
  const overlayChips = document.querySelectorAll(".overlay-chip");
  const scenarioSummary = document.querySelector("[data-scenario-summary]");
  const liveScenarioLabel = document.querySelector(".live-scenario-label");

  if (meterFill) {
    meterFill.style.width = `${state.congruency}%`;
  }

  if (statusHeading) {
    statusHeading.textContent = state.statusLabel;
  }

  if (feedbackBanner && feedbackText) {
    feedbackBanner.className = `feedback-banner ${state.feedbackTone}`;
    feedbackText.textContent = state.feedbackMessage;
  }

  if (scenarioSelect) {
    scenarioSelect.value = state.scenarioId;
  }

  if (sceneTitle) {
    sceneTitle.textContent = state.scenario.name;
  }

  if (liveScenarioLabel) {
    liveScenarioLabel.textContent = state.scenario.name;
  }

  if (sceneBadge) {
    sceneBadge.textContent = `Mobilization: ${state.scenario.correctMobilization}`;
  }

  if (scenarioSummary) {
    scenarioSummary.textContent = `${state.scenario.surfaceRule}. Moving bone: ${state.scenario.movingBone}.`;
  }

  if (overlayChips[0]) {
    overlayChips[0].textContent = `Correct roll: ${state.scenario.correctRoll}`;
  }

  if (overlayChips[1]) {
    overlayChips[1].textContent = `Correct glide: ${state.scenario.correctGlide}`;
  }

  document.querySelectorAll("[data-roll]").forEach((button) => {
    button.classList.toggle("active", button.dataset.roll === state.motionSelection.roll);
  });

  document.querySelectorAll("[data-glide]").forEach((button) => {
    button.classList.toggle("active", button.dataset.glide === state.motionSelection.glide);
  });
}

renderApp();
