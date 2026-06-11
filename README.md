# DPT 6331 Arthrokinematics Simulator

An interactive web-based educational simulator developed to support Doctor of Physical Therapy (DPT) learners as they visualize and practice foundational arthrokinematic principles. The project emphasizes roll, glide, joint congruency, and mobilization direction through a responsive browser-based experience grounded in musculoskeletal education.

## Project Purpose

The `DPT 6331 Arthrokinematics Simulator` is designed as an instructional prototype for Baylor-style academic use in physical therapy coursework. Its primary aim is to help learners connect convex-concave rule concepts to visible joint behavior in a way that is more intuitive, repeatable, and interactive than static diagrams alone.

This repository is structured for continued instructional design and development handoff, allowing future collaborators to extend the simulator with additional joints, motion scenarios, and course-aligned learning features.

## Current Features

- Interactive 3D shoulder model
- Shoulder Abduction scenario
- Shoulder External Rotation (Arm at Side)
- Shoulder Horizontal Adduction
- Roll direction selection
- Glide direction selection
- Congruency feedback
- Correct motion demonstration
- Reset functionality
- Visual dislocation feedback for incorrect pairings
- Responsive browser-based interface

## Educational Goals

- Reinforce convex-concave rule concepts
- Visualize arthrokinematic roll and glide relationships
- Provide immediate learner feedback
- Support DPT musculoskeletal coursework

## Technology Stack

- Vite
- JavaScript
- Three.js
- Blender-created GLB assets
- GitHub
- Vercel

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Deployment

This project is intended for deployment through Vercel. In its current structure, the Vite application can be connected directly to a GitHub repository and deployed using Vercel's standard static front-end workflow.

A typical deployment flow is:

1. Push updates to the `main` branch on GitHub.
2. Connect the repository to Vercel.
3. Configure the build command as `npm run build`.
4. Configure the output directory as `dist`.

## Repository Structure

This project currently centers on the shoulder module as a proof of concept. Key repository areas include:

- `src/`
  Core front-end application code, simulator logic, and Three.js scene setup
- `src/joints/`
  Joint-specific simulation modules, including the shoulder scenarios
- `public/models/`
  Production-served GLB assets for the browser experience

## Known Limitations

- Prototype version
- Shoulder module currently serves as proof of concept
- Bone segmentation and animation remain simplified
- Not intended for clinical decision making

## Future Roadmap

- Additional shoulder motions
- Hip module
- Knee module
- More anatomically accurate joint mechanics
- Assessment and scoring
- SCORM integration
- Faculty-driven enhancements

## Intended Use

This simulator is best understood as an educational support tool for coursework, lab preparation, and conceptual reinforcement. It is not a substitute for faculty instruction, anatomical lab experience, or clinical reasoning practice. As the project matures, additional anatomical fidelity and instructional assessment features may be incorporated in collaboration with faculty, instructional designers, and software contributors.

## Handoff Notes

For future instructional designers or developers joining the project:

- The current implementation prioritizes clarity of teaching interaction over biomechanical completeness.
- Scenario logic is modular and designed to support future expansion by joint and motion type.
- Three.js rendering and GLB asset workflows are already in place, making it practical to extend the simulator with additional anatomically segmented assets.
- Future improvements should be coordinated with course objectives, faculty review, and learner usability testing.

## License / Academic Use

No license has been specified in this repository at this time. If this project will be distributed outside an internal instructional setting, a formal license and asset-use review should be added as part of the next development phase.
