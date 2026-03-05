%% Reset workspace, console and figures
clear; clc; close all;

%% Step 1: Read lung sound audio file
[file, path] = uigetfile('*.wav', 'Select a LUNG sound WAV file');
if isequal(file,0)
    disp('No file selected. Exiting...');
    return;
end

filename = fullfile(path, file);
[y, Fs] = audioread(filename);

if size(y,2) > 1
    y = y(:,1); % Convert stereo to mono
end

%% Step 2: Play raw lung sound
disp('Playing raw lung sound...');
sound(y, Fs);
pause(length(y)/Fs + 1);

%% Step 3: Ventilator-style scrolling display for RAW sound
windowLength = Fs * 5;

hFig1 = figure('Color','k'); 
ax1 = axes('Parent',hFig1,'Color','k'); 
hold(ax1,'on');
xlabel(ax1,'Time (s)','Color','w');
ylabel(ax1,'Amplitude','Color','w');
title(ax1,'Raw Lung Sound - Ventilator Style Display','Color','w');
set(ax1,'XColor','w','YColor','w');

plotLine1 = plot(ax1,nan,nan,'c'); % Cyan waveform
xlim([0 5]); ylim([-1 1]);

disp('Displaying ventilator-style waveform for RAW lung sound...');
for idx = 1:windowLength:length(y)-windowLength
    segment = y(idx:idx+windowLength-1);
    t_seg = (0:length(segment)-1)/Fs;
    set(plotLine1,'XData',t_seg,'YData',segment);
    drawnow;
    pause(0.05);
end

%% Step 4: Band-pass filter (100–2000 Hz for lung sounds)
bpFilt = designfilt('bandpassiir', ...
    'FilterOrder', 8, ...
    'HalfPowerFrequency1', 100, ...
    'HalfPowerFrequency2', 2000, ...
    'SampleRate', Fs);

y_filt = filtfilt(bpFilt, y);

%% Step 5: Amplify & Normalize
y_amp = y_filt * 2000;
y_norm = y_amp / max(abs(y_amp));

%% Step 6: Envelope extraction (Hilbert)
analytic_signal = hilbert(y_norm);
envelope = abs(analytic_signal);

%% Step 7: Smooth envelope
env_smooth = movmean(envelope, round(0.05*Fs));

%% Step 8: Breath peak detection → Respiratory Rate
minDist = round(1.5 * Fs);  % Min gap ~1.5s (RR < 40 BPM)
[~, peakLocs] = findpeaks(env_smooth, ...
    'MinPeakHeight', 0.35 * max(env_smooth), ...
    'MinPeakDistance', minDist);

numBreaths = length(peakLocs);
duration_sec = length(y)/Fs;
RR_BPM = numBreaths / (duration_sec/60);

fprintf('Detected Respiratory Rate: %.1f breaths/min\n', RR_BPM);

%% Step 9: Plot waveform + envelope + detected breaths
t = (0:length(y_norm)-1)/Fs;

figure('Color','w');
subplot(3,1,1);
plot(t, y_norm);
xlabel('Time (s)'); ylabel('Amplitude');
title('Processed Lung Sound');
grid on;

subplot(3,1,2);
plot(t, env_smooth, 'r'); hold on;
plot(peakLocs/Fs, env_smooth(peakLocs), 'ko');
xlabel('Time (s)'); ylabel('Envelope');
title(sprintf('Envelope + Detected Breaths (%.1f BPM)', RR_BPM));
grid on;

subplot(3,1,3);
spectrogram(y_norm, hamming(512), 256, 1024, Fs, 'yaxis');
title('Spectrogram of Lung Sound');
colorbar;

%% Step 10: Save processed lung audio
[~, name, ext] = fileparts(file);
outputFile = fullfile(path, [name '_processed_lung' ext]);
audiowrite(outputFile, y_norm, Fs);
fprintf('Processed lung sound saved as: %s\n', outputFile);

%% Step 11: Ventilator-style scrolling display for PROCESSED lung sound
hFig2 = figure('Color','k'); 
ax2 = axes('Parent',hFig2,'Color','k'); 
hold(ax2,'on');
xlabel(ax2,'Time (s)','Color','w');
ylabel(ax2,'Amplitude','Color','w');
title(ax2,sprintf('Processed Lung Sound - Ventilator Style Display (%.1f BPM)', RR_BPM),'Color','w');
set(ax2,'XColor','w','YColor','w');

plotLine2 = plot(ax2,nan,nan,'g');
xlim([0 5]); ylim([-1 1]);

disp('Displaying ventilator-style waveform for PROCESSED lung sound...');
for idx = 1:windowLength:length(y_norm)-windowLength
    segment = y_norm(idx:idx+windowLength-1);
    t_seg = (0:length(segment)-1)/Fs;
    set(plotLine2,'XData',t_seg,'YData',segment);
    drawnow;
    pause(0.05);
end

%% Step 12: Play processed lung sound
disp('Playing processed lung sound...');
sound(y_norm, Fs);
pause(length(y_norm)/Fs + 1);
disp('Playback complete.');