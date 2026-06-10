import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MODEL_PATH = "/models/shoulder-movable.glb";
const BASELINE_CONGRUENCY = 100;
const CAMERA_VIEW_MARGIN = 1.18;
const DEG = Math.PI / 180;

const directionVectors = {
  Superior: new THREE.Vector3(0, 1, 0),
  Inferior: new THREE.Vector3(0, -1, 0),
  Anterior: new THREE.Vector3(0.52, 0.08, 0.48),
  Posterior: new THREE.Vector3(-0.48, -0.05, -0.48)
};

export const SHOULDER_SCENARIOS = [
  {
    id: "shoulderAbduction",
    name: "Shoulder Abduction",
    mode: "quiz",
    joint: "Shoulder",
    motion: "Abduction",
    movingBone: "Humerus",
    surfaceRule: "Convex humeral head moving on concave glenoid fossa",
    correctRoll: "Superior",
    correctGlide: "Inferior",
    correctMobilization: "Inferior",
    idleFeedback: "Select Shoulder Abduction, toggle roll and glide, then click Apply Motion.",
    missingRollFeedback: "Shoulder abduction requires a roll selection first. For this motion, the roll should be superior.",
    wrongRollFeedback:
      "Shoulder abduction requires superior roll. Recheck the convex humeral head moving on the concave glenoid.",
    correctFeedback:
      "Correct: The humerus rolls superiorly and glides inferiorly to maintain joint congruency.",
    noGlideFeedback:
      "Not quite: Without the inferior glide, the humeral head rides superiorly and loses joint congruency.",
    wrongGlideFeedback(direction) {
      return `The glide direction is off. During shoulder abduction the humeral head should glide inferiorly, not ${direction.toLowerCase()}.`;
    },
    correctAnimation: {
      position: [0.0015, -0.0045, 0.002],
      rotation: [4 * DEG, 0, -7 * DEG]
    },
    wrongRollAnimation: {
      driftScale: 0.34,
      rotation: [0, 0, 0.22]
    },
    wrongGlideAnimation: {
      basePosition: [0.01, 0.014, 0.002],
      glideScale: 0.022,
      rotation: [3 * DEG, 0, -5 * DEG]
    },
    noGlideAnimation: {
      drift: [0.012, 0.026, 0.008],
      rotation: [4 * DEG, 0, -6 * DEG],
      dislocationThreshold: 1.08
    },
    wrongMigrationDirection: "Superior",
    wrongGlideCongruency: {
      Superior: 0,
      Inferior: 100,
      Anterior: 58,
      Posterior: 54
    },
    noGlideCongruency: 52,
    wrongRollCongruency: 56
  },
  {
    id: "shoulderExternalRotation",
    name: "Shoulder External Rotation — Arm at Side",
    mode: "quiz",
    joint: "Shoulder",
    motion: "External Rotation",
    movingBone: "Humerus",
    surfaceRule: "Convex humeral head moving on concave glenoid fossa",
    correctRoll: "Posterior",
    correctGlide: "Anterior",
    correctMobilization: "Anterior",
    idleFeedback: "Select Shoulder External Rotation, toggle roll and glide, then click Apply Motion.",
    missingRollFeedback:
      "Shoulder external rotation requires a roll selection first. For this motion, the roll should be posterior.",
    wrongRollFeedback:
      "Shoulder external rotation requires posterior roll. Recheck the convex humeral head moving on the concave glenoid fossa.",
    correctFeedback:
      "Correct: During shoulder external rotation, the humerus rolls posteriorly and glides anteriorly to maintain joint congruency.",
    noGlideFeedback:
      "Not quite: Without the anterior glide, the humeral head rides posteriorly and loses joint congruency.",
    wrongGlideFeedback(direction) {
      return `The glide direction is off. During shoulder external rotation the humeral head should glide anteriorly, not ${direction.toLowerCase()}.`;
    },
    correctAnimation: {
      position: [0.012, 0.008, 0.014],
      rotation: [3 * DEG, 7 * DEG, -4 * DEG]
    },
    wrongRollAnimation: {
      driftScale: 0.28,
      rotation: [0.08, -0.18, 0.16]
    },
    wrongGlideAnimation: {
      basePosition: [-0.01, 0.004, -0.012],
      glideScale: 0.022,
      rotation: [2 * DEG, 5 * DEG, -3 * DEG]
    },
    noGlideAnimation: {
      drift: [-0.024, 0.006, -0.026],
      rotation: [4 * DEG, 7 * DEG, -4 * DEG],
      dislocationThreshold: 1.1
    },
    wrongMigrationDirection: "Posterior",
    wrongGlideCongruency: {
      Superior: 58,
      Inferior: 54,
      Anterior: 100,
      Posterior: 0
    },
    noGlideCongruency: 52,
    wrongRollCongruency: 56
  },
  {
    id: "shoulderHorizontalAdduction",
    name: "Shoulder Horizontal Adduction",
    mode: "quiz",
    joint: "Shoulder",
    motion: "Horizontal Adduction",
    movingBone: "Humerus",
    surfaceRule: "Convex humeral head moving on concave glenoid fossa",
    correctRoll: "Anterior",
    correctGlide: "Posterior",
    correctMobilization: "Posterior",
    idleFeedback: "Select Shoulder Horizontal Adduction, toggle roll and glide, then click Apply Motion.",
    missingRollFeedback:
      "Shoulder horizontal adduction requires a roll selection first. For this motion, the roll should be anterior.",
    wrongRollFeedback:
      "Shoulder horizontal adduction requires anterior roll. Recheck the convex humeral head moving on the concave glenoid fossa.",
    correctFeedback:
      "Correct: During shoulder horizontal adduction, the convex humeral head rolls anteriorly and glides posteriorly on the concave glenoid.",
    noGlideFeedback:
      "Not quite: Without the posterior glide, the humeral head rides anteriorly and loses joint congruency.",
    wrongGlideFeedback(direction) {
      return `The glide direction is off. During shoulder horizontal adduction the humeral head should glide posteriorly, not ${direction.toLowerCase()}.`;
    },
    correctAnimation: {
      position: [0.014, 0.01, 0.02],
      rotation: [3 * DEG, -5 * DEG, -6 * DEG]
    },
    wrongRollAnimation: {
      driftScale: 0.32,
      rotation: [0.06, 0.12, 0.12]
    },
    wrongGlideAnimation: {
      basePosition: [0.008, 0.004, 0.014],
      glideScale: 0.022,
      rotation: [2 * DEG, -4 * DEG, -4 * DEG]
    },
    noGlideAnimation: {
      drift: [0.026, 0.008, 0.02],
      rotation: [4 * DEG, -5 * DEG, -4 * DEG],
      dislocationThreshold: 1.08
    },
    wrongMigrationDirection: "Anterior",
    wrongGlideCongruency: {
      Superior: 56,
      Inferior: 52,
      Anterior: 0,
      Posterior: 100
    },
    noGlideCongruency: 52,
    wrongRollCongruency: 56
  }
];

const scenarioMap = Object.fromEntries(SHOULDER_SCENARIOS.map((scenario) => [scenario.id, scenario]));

export class ShoulderModule {
  constructor({ mount, onStateChange }) {
    this.mount = mount;
    this.onStateChange = onStateChange;
    this.loader = new GLTFLoader();
    this.clock = new THREE.Clock();
    this.animationFrame = null;
    this.isDisposed = false;
    this.isModelLoaded = false;
    this.humerusMoving = null;
    this.shoulderStatic = null;
    this.originalHumerusPosition = null;
    this.originalHumerusRotation = null;
    this.originalHumerusQuaternion = null;
    this.selectedScenarioId = SHOULDER_SCENARIOS[0].id;
    this.motionSelection = { roll: null, glide: null };
    this.appliedMotion = null;
    this.animationState = this.createAnimationState();
    this.feedbackTone = "neutral";
    this.feedbackMessage = this.scenario.idleFeedback;
    this.state = {
      congruency: BASELINE_CONGRUENCY,
      statusLabel: `Ready to test ${this.scenario.motion.toLowerCase()}`
    };

    this.initScene();
    this.loadModel();
    this.publishState();
    this.startLoop();
  }

  get scenario() {
    return scenarioMap[this.selectedScenarioId];
  }

  createAnimationState(overrides = {}) {
    return {
      mode: "idle",
      phase: 0,
      dislocationTriggered: false,
      dislocationDirection: null,
      ...overrides
    };
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f2e7);
    this.scene.fog = new THREE.Fog(0xf5f2e7, 18, 34);

    const width = this.mount.clientWidth || 960;
    const height = this.mount.clientHeight || 560;

    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0.9, 1.25, 6.4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.mount.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.minDistance = 2.4;
    this.controls.maxDistance = 12;
    this.controls.target.set(0, 0.95, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(5, 6, 4);
    const fill = new THREE.DirectionalLight(0xf6d36a, 0.9);
    fill.position.set(-4, 3, -3);
    const rim = new THREE.DirectionalLight(0xffffff, 0.7);
    rim.position.set(-2, 5, 5);

    this.scene.add(ambient, key, fill, rim);

    const pedestal = new THREE.Mesh(
      new THREE.CircleGeometry(2.1, 64),
      new THREE.MeshStandardMaterial({
        color: 0xe3ddc9,
        transparent: true,
        opacity: 0.9
      })
    );
    pedestal.rotation.x = -Math.PI / 2;
    pedestal.position.y = -1.05;
    this.scene.add(pedestal);

    window.addEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    if (this.isDisposed) {
      return;
    }

    const width = this.mount.clientWidth || 960;
    const height = this.mount.clientHeight || 560;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  loadModel() {
    this.loader.load(
      MODEL_PATH,
      (gltf) => {
        this.modelRoot = gltf.scene;
        gltf.scene.traverse((obj) => {
          console.log("GLB object:", obj.name, obj.type);
        });
        this.modelRoot.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(this.modelRoot);

        const shoulderStatic = gltf.scene.getObjectByName("shoulder_static");
        const humerusMoving = gltf.scene.getObjectByName("humerus_moving");

        this.shoulderStatic = shoulderStatic;
        this.humerusMoving = humerusMoving;

        if (!humerusMoving) {
          console.error("humerus_moving not found. Check GLB object names.");
        }
        if (!shoulderStatic) {
          console.error("shoulder_static not found. Check GLB object names.");
        }

        if (humerusMoving) {
          console.log("Found humerus_moving");
        }
        if (shoulderStatic) {
          console.log("Found shoulder_static");
        }

        if (this.humerusMoving) {
          this.originalHumerusPosition = this.humerusMoving.position.clone();
          this.originalHumerusRotation = this.humerusMoving.rotation.clone();
          this.originalHumerusQuaternion = this.humerusMoving.quaternion.clone();
        }
        this.fitCameraToCurrentModel();
        this.isModelLoaded = Boolean(this.humerusMoving);
        this.setFeedback("neutral", `${this.scenario.idleFeedback}`);
        this.publishState();
      },
      undefined,
      (error) => {
        console.error("Failed to load GLB:", error);
        this.isModelLoaded = false;
        this.setFeedback(
          "warning",
          "The shoulder GLB could not be loaded. Check that /models/shoulder-movable.glb is present in the public folder."
        );
        this.publishState();
      }
    );
  }

  fitCameraToCurrentModel() {
    if (!this.modelRoot) {
      return;
    }

    const bounds = new THREE.Box3().setFromObject(this.modelRoot);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const halfHeight = size.y / 2;
    const halfWidth = size.x / 2;
    const vFov = THREE.MathUtils.degToRad(this.camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);

    const fitHeightDistance = halfHeight / Math.tan(vFov / 2);
    const fitWidthDistance = halfWidth / Math.tan(hFov / 2);
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * CAMERA_VIEW_MARGIN;

    const viewDirection = new THREE.Vector3(0.22, 0.16, 1).normalize();
    const cameraPosition = center.clone().add(viewDirection.multiplyScalar(distance));

    this.camera.position.copy(cameraPosition);
    this.camera.near = Math.max(distance / 100, 0.1);
    this.camera.far = Math.max(distance * 10, 100);
    this.camera.updateProjectionMatrix();

    this.controls.target.copy(center);
    this.controls.minDistance = Math.max(distance * 0.45, 1.8);
    this.controls.maxDistance = Math.max(distance * 2.2, this.controls.minDistance + 2);
    this.controls.update();
  }

  startLoop() {
    const tick = () => {
      if (this.isDisposed) {
        return;
      }

      this.animationFrame = requestAnimationFrame(tick);
      const delta = this.clock.getDelta();
      this.controls.update();
      this.updateAnimation(delta);
      this.renderer.render(this.scene, this.camera);
    };

    tick();
  }

  updateAnimation(delta) {
    if (!this.isModelLoaded || !this.humerusMoving) {
      return;
    }

    const target = this.originalHumerusPosition.clone();
    const rotation = {
      x: this.originalHumerusRotation.x,
      y: this.originalHumerusRotation.y,
      z: this.originalHumerusRotation.z
    };
    const phase = this.stepAnimation(delta);

    if (this.animationState.mode === "correct") {
      this.applyAnimationProfile(target, rotation, this.scenario.correctAnimation, phase);
    } else if (this.animationState.mode === "wrong-roll") {
      const rollVector = this.getDirectionVector(this.scenario.wrongMigrationDirection).multiplyScalar(
        this.scenario.wrongRollAnimation.driftScale * phase
      );
      target.add(rollVector);
      this.applyRotation(rotation, this.scenario.wrongRollAnimation.rotation, phase);
    } else if (this.animationState.mode === "wrong-glide") {
      const glideVector = this.getDirectionVector(this.scenario.wrongMigrationDirection).multiplyScalar(
        this.scenario.wrongGlideAnimation.glideScale * phase
      );
      target.add(glideVector);
      target.add(this.arrayToVector(this.scenario.wrongGlideAnimation.basePosition).multiplyScalar(phase));
      this.applyRotation(rotation, this.scenario.wrongGlideAnimation.rotation, phase);
    } else if (this.animationState.mode === "no-glide") {
      const drift = this.animationState.phase;
      const driftVector = this.arrayToVector(this.scenario.noGlideAnimation.drift).multiplyScalar(drift);
      const funnyBounce = Math.sin(this.clock.elapsedTime * 13) * 0.025 * Math.min(drift, 1);
      target.add(driftVector);
      target.y += funnyBounce;
      this.applyRotation(rotation, this.scenario.noGlideAnimation.rotation, Math.min(drift, 1));

      if (drift > this.scenario.noGlideAnimation.dislocationThreshold) {
        this.dislocateJoint(this.arrayToVector(this.scenario.noGlideAnimation.drift));
      }
    } else if (this.animationState.mode === "dislocation") {
      const drift = this.animationState.phase;
      const direction = this.animationState.dislocationDirection || new THREE.Vector3(0, 1, 0);
      const settled = this.easeOut(drift / 1.65);
      const bounce = Math.sin(this.clock.elapsedTime * 10) * 0.004 * Math.min(settled, 1);
      target.add(direction.clone().multiplyScalar(0.05 * settled));
      target.add(new THREE.Vector3(0.008 * settled, bounce, 0.01 * settled));
      rotation.x = this.originalHumerusRotation.x + 4 * DEG * Math.min(settled, 1);
      rotation.y = this.originalHumerusRotation.y + 6 * DEG * Math.min(settled, 1);
      rotation.z = this.originalHumerusRotation.z - 5 * DEG * Math.min(settled, 1);
    }

    this.animateDirection(target, rotation, delta);
  }

  stepAnimation(delta) {
    const speed = this.animationState.mode === "dislocation" ? 0.58 : 0.45;
    const cap = this.animationState.mode === "no-glide" || this.animationState.mode === "dislocation" ? 1.65 : 1;
    this.animationState.phase = Math.min(this.animationState.phase + delta * speed, cap);
    return this.animationState.mode === "correct" ? this.easeInOut(this.animationState.phase) : this.animationState.phase;
  }

  applyAnimationProfile(target, rotation, profile, phase) {
    target.add(this.arrayToVector(profile.position).multiplyScalar(phase));
    this.applyRotation(rotation, profile.rotation, phase);
  }

  applyRotation(rotation, values, phase) {
    rotation.x = this.originalHumerusRotation.x + values[0] * phase;
    rotation.y = this.originalHumerusRotation.y + values[1] * phase;
    rotation.z = this.originalHumerusRotation.z + values[2] * phase;
  }

  arrayToVector(values) {
    return new THREE.Vector3(values[0], values[1], values[2]);
  }

  easeInOut(value) {
    return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  easeOut(value) {
    const clamped = THREE.MathUtils.clamp(value, 0, 1);
    return 1 - Math.pow(1 - clamped, 3);
  }

  getDirectionVector(direction) {
    return directionVectors[direction]?.clone() || new THREE.Vector3();
  }

  animateDirection(targetPosition, targetRotation, delta) {
    if (!this.humerusMoving) {
      return;
    }

    const easing = 1 - Math.pow(0.002, delta);
    const rotationEase = 1 - Math.pow(0.008, delta);
    this.humerusMoving.position.lerp(targetPosition, easing);
    this.humerusMoving.rotation.x = THREE.MathUtils.lerp(this.humerusMoving.rotation.x, targetRotation.x, rotationEase);
    this.humerusMoving.rotation.y = THREE.MathUtils.lerp(this.humerusMoving.rotation.y, targetRotation.y, rotationEase);
    this.humerusMoving.rotation.z = THREE.MathUtils.lerp(this.humerusMoving.rotation.z, targetRotation.z, rotationEase);
  }

  setScenario(scenarioId) {
    if (!scenarioMap[scenarioId]) {
      return;
    }

    this.selectedScenarioId = scenarioId;
    this.reset();
    this.state.statusLabel = `${this.scenario.name} selected`;
    this.setFeedback(
      "neutral",
      `${this.scenario.surfaceRule}. Correct roll: ${this.scenario.correctRoll}. Correct glide: ${this.scenario.correctGlide}. Correct mobilization: ${this.scenario.correctMobilization}.`
    );
    this.publishState();
  }

  toggleRoll(direction) {
    this.motionSelection.roll = this.motionSelection.roll === direction ? null : direction;
    this.state.statusLabel = this.motionSelection.roll ? `Roll ${this.motionSelection.roll} selected` : "Roll cleared";
    this.publishState();
  }

  toggleGlide(direction) {
    this.motionSelection.glide = this.motionSelection.glide === direction ? null : direction;
    this.state.statusLabel = this.motionSelection.glide ? `Glide ${this.motionSelection.glide} selected` : "Glide cleared";
    this.publishState();
  }

  applyMotion() {
    const { roll, glide } = this.motionSelection;

    if (!roll) {
      this.state.statusLabel = "Roll needed";
      this.setFeedback("warning", this.scenario.missingRollFeedback);
      this.publishState();
      return;
    }

    console.log("Animating ONLY:", this.humerusMoving?.name);
    this.appliedMotion = { roll, glide };
    this.animationState = this.createAnimationState();

    if (roll !== this.scenario.correctRoll) {
      this.state.congruency = this.scenario.wrongRollCongruency;
      this.state.statusLabel = "Wrong roll direction";
      this.animationState.mode = "wrong-roll";
      this.setFeedback("warning", this.scenario.wrongRollFeedback);
      this.publishState();
      return;
    }

    if (glide === this.scenario.correctGlide) {
      this.state.congruency = 100;
      this.state.statusLabel = "Joint centered";
      this.animationState.mode = "correct";
      this.setFeedback("positive", this.scenario.correctFeedback);
      this.publishState();
      return;
    }

    if (!glide) {
      this.state.congruency = this.scenario.noGlideCongruency;
      this.state.statusLabel = `${this.scenario.correctRoll} drift developing`;
      this.animationState.mode = "no-glide";
      this.setFeedback("warning", this.scenario.noGlideFeedback);
      this.publishState();
      return;
    }

    const congruency = this.scenario.wrongGlideCongruency[glide] ?? 20;
    this.state.congruency = congruency;
    this.state.statusLabel = `Wrong glide: ${glide}`;

    if (congruency <= 0) {
      this.dislocateJoint(
        this.getDirectionVector(this.scenario.wrongMigrationDirection),
        this.scenario.wrongGlideFeedback(glide)
      );
      this.state.statusLabel = "Comedic dislocation";
      this.publishState();
      return;
    }

    this.animationState.mode = "wrong-glide";
    this.setFeedback("warning", this.scenario.wrongGlideFeedback(glide));
    this.publishState();
  }

  dislocateJoint(direction, feedbackMessage = this.scenario.noGlideFeedback) {
    if (this.animationState.dislocationTriggered) {
      return;
    }

    console.log("Animating ONLY:", this.humerusMoving?.name);
    this.animationState = this.createAnimationState({
      mode: "dislocation",
      dislocationTriggered: true,
      dislocationDirection: direction.clone().normalize()
    });
    this.state.congruency = 0;
    this.state.statusLabel = "Comedic dislocation";
    this.setFeedback("warning", feedbackMessage);
    this.publishState();
  }

  showCorrectMotion() {
    console.log("Animating ONLY:", this.humerusMoving?.name);
    this.motionSelection = {
      roll: this.scenario.correctRoll,
      glide: this.scenario.correctGlide
    };
    this.appliedMotion = { ...this.motionSelection };
    this.animationState = this.createAnimationState({ mode: "correct" });
    this.state.congruency = 100;
    this.state.statusLabel = "Correct motion demo";
    this.setFeedback("positive", this.scenario.correctFeedback);
    this.publishState();
  }

  resetMotion() {
    this.motionSelection = { roll: null, glide: null };
    this.appliedMotion = null;
    this.animationState = this.createAnimationState();
    this.state.congruency = BASELINE_CONGRUENCY;
    if (this.humerusMoving && this.originalHumerusPosition && this.originalHumerusRotation && this.originalHumerusQuaternion) {
      this.humerusMoving.position.copy(this.originalHumerusPosition);
      this.humerusMoving.rotation.copy(this.originalHumerusRotation);
      this.humerusMoving.quaternion.copy(this.originalHumerusQuaternion);
    }
    this.state.statusLabel = "Reset and ready";
    this.setFeedback("neutral", this.scenario.idleFeedback);
    this.publishState();
  }

  reset() {
    this.resetMotion();
  }

  setFeedback(tone, message) {
    this.feedbackTone = tone;
    this.feedbackMessage = message;
  }

  publishState() {
    this.onStateChange?.({
      scenarioId: this.selectedScenarioId,
      scenario: this.scenario,
      scenarioOptions: SHOULDER_SCENARIOS.map((scenario) => ({
        id: scenario.id,
        name: scenario.name
      })),
      congruency: this.state.congruency,
      statusLabel: this.state.statusLabel,
      feedbackTone: this.feedbackTone,
      feedbackMessage: this.feedbackMessage,
      motionSelection: { ...this.motionSelection },
      appliedMotion: this.appliedMotion ? { ...this.appliedMotion } : null
    });
  }

  dispose() {
    this.isDisposed = true;
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.handleResize);
    this.controls?.dispose();
    this.renderer?.dispose();

    if (this.renderer?.domElement?.parentNode === this.mount) {
      this.mount.removeChild(this.renderer.domElement);
    }

    this.scene?.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material?.dispose();
        }
      }
    });
  }
}
