%% Reset workspace, console and figures
clear; clc; close all;

%% Step 1: Read audio file
[file, path] = uigetfile('*.wav', 'Select a WAV file');
if isequal(file,0)
    disp('No file selected. Exiting...');
    return; %% Stop Program if no file selected
end

filename = fullfile(path, file); % Build full path of the file
[y, Fs] = audioread(filename);   % Read audio with y samples and sample rate (Hz)

if size(y,2) > 1
    y = y(:,1); % Use first channel if stereo (convert to mono)
end

%% Step 2: Play raw audio
disp('Playing raw heart sound...');
sound(y, Fs);
pause(length(y)/Fs + 1); % Wait until playback is complete

%% Step 3: Ventilator-style scrolling display for RAW sound
windowLength = Fs * 5;  % 5-second display window
hFig1 = figure('Color','k'); 
ax1 = axes('Parent',hFig1,'Color','k'); 
hold(ax1,'on');
xlabel(ax1,'Time (s)','Color','w');
ylabel(ax1,'Amplitude','Color','w');
title(ax1,'Raw Heart Sound - Ventilator Style Display','Color','w');
set(ax1,'XColor','w','YColor','w');

plotLine1 = plot(ax1,nan,nan,'y'); % Yellow waveform for raw sound
xlim([0 5]); ylim([-1 1]);

disp('Displaying ventilator-style waveform for RAW sound...');
for idx = 1:windowLength:length(y)-windowLength
    segment = y(idx:idx+windowLength-1);
    t_seg = (0:length(segment)-1)/Fs;
    set(plotLine1,'XData',t_seg,'YData',segment);
    drawnow;
    pause(0.05);
end

%% Step 4: Low-pass filter (cutoff 200 Hz for heart sounds)
lpFilt = designfilt('lowpassiir', ...
    'FilterOrder', 8, ...
    'HalfPowerFrequency', 200, ...
    'SampleRate', Fs);
y_filt = filtfilt(lpFilt, y);  % Zero-phase filtering (no delay/distortion)

%% Step 5: Amplify & Normalize
y_amp = y_filt * 1000; 
y_norm = y_amp / max(abs(y_amp)); % Normalize to [-1, 1]

%% Step 6: Envelope extraction using Hilbert transform
analytic_signal = hilbert(y_norm);
envelope = abs(analytic_signal);

%% Step 7: Peak detection → Heart Rate (BPM)
minDist = round(0.3 * Fs); % Minimum distance between peaks (HR < 200 BPM)
[~, peakLocs] = findpeaks(envelope, ...
    'MinPeakHeight', 0.3 * max(envelope), ...
    'MinPeakDistance', minDist);

numPeaks = length(peakLocs);
duration_sec = length(y) / Fs;
HR_BPM = numPeaks / (duration_sec / 60);
fprintf('Detected Heart Rate: %.1f BPM\n', HR_BPM);

%% Step 8: Plot processed waveform and spectrogram
t = (0:length(y_norm)-1) / Fs;

figure('Color','w');
subplot(2,1,1);
plot(t, y_norm, 'b'); hold on;
plot(peakLocs/Fs, y_norm(peakLocs), 'ro'); % Mark detected peaks
xlabel('Time (s)'); ylabel('Amplitude');
title(sprintf('Processed Heart Sound (%.1f BPM)', HR_BPM));
legend('Waveform','Detected Beats');
grid on;

subplot(2,1,2);
spectrogram(y_norm, hamming(512), 256, 1024, Fs, 'yaxis');
title('Spectrogram of Processed Heart Sound');
colorbar;

%% Step 9: Save processed audio file
[~, name, ext] = fileparts(file);  % Get file name without extension
outputFile = fullfile(path, [name '_processed' ext]);
audiowrite(outputFile, y_norm, Fs);
fprintf('Processed audio saved as: %s\n', outputFile);

%% Step 10: Ventilator-style scrolling display for PROCESSED sound
hFig2 = figure('Color','k'); 
ax2 = axes('Parent',hFig2,'Color','k'); 
hold(ax2,'on');
xlabel(ax2,'Time (s)','Color','w');
ylabel(ax2,'Amplitude','Color','w');
title(ax2,sprintf('Processed Heart Sound - Ventilator Style Display (%.1f BPM)', HR_BPM),'Color','w');
set(ax2,'XColor','w','YColor','w');

plotLine2 = plot(ax2,nan,nan,'g'); % Green waveform for processed sound
xlim([0 5]); ylim([-1 1]);

disp('Displaying ventilator-style waveform for PROCESSED sound...');
for idx = 1:windowLength:length(y_norm)-windowLength
    segment = y_norm(idx:idx+windowLength-1);
    t_seg = (0:length(segment)-1)/Fs;
    set(plotLine2,'XData',t_seg,'YData',segment);
    drawnow;
    pause(0.05);
end

%% Step 11: Play processed heart sound
disp('Playing processed heart sound...');
sound(y_norm, Fs);
pause(length(y_norm)/Fs + 1); % Wait until playback finishes
disp('Playback complete.');