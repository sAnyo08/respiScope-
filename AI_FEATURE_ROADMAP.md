# RespiScope AI Feature Roadmap: Abnormal Sound Detection & Classification

## Phase 1: Python AI Service Setup
- [ ] Initialize Python environment (`requirements.txt` with `librosa`, `scipy`, `fastapi`).
- [ ] Create an API endpoint `POST /analyze` that accepts a WAV file.

## Phase 2: Feature Extraction Pipeline
- [ ] **Peak Detection**: Implement `scipy.signal.find_peaks` logic to identify transient anomalies.
- [ ] **Feature Extraction**:
    - [ ] Calculate MFCCs.
    - [ ] Generate Mel Spectrogram images.
    - [ ] Compute Spectral Centroid & Zero Crossing Rate.
- [ ] **Segmentation**: Slice audio into windows centered around detected peaks.

## Phase 3: Classification (The Brain)
- [ ] Load a Pre-trained CNN (ResNet/Custom) for respiratory sound classification.
- [ ] Map model outputs to human-readable labels: Normal, Wheezing, Crackles, Rhonchi.

## Phase 4: Integration
- [ ] **Node.js Bridge**: Update `audioController.js` to send processed files to the Python AI Service.
- [ ] **DB Schema**: Add `aiInsights` field to the `Message` model in MongoDB.
- [ ] **Socket.io**: Emit an `ai-analysis-complete` event to the frontend when processing finishes.

## Phase 5: UI/UX (Frontend)
- [ ] **Visual Markers**: Update `AudioWaveform.js` to draw timestamp markers for AI-detected peaks.
- [ ] **Diagnostics Card**: Create a new UI component to display classification results and confidence scores.
- [ ] **Spectrogram Modal**: Allow doctors to view the generated AI Spectrogram for clinical validation.
