%% Read input from ENV
inputFile = getenv('INPUT_AUDIO');
outputFile = getenv('OUTPUT_AUDIO');

[y, Fs] = audioread(inputFile);

if size(y,2) > 1
    y = y(:,1);
end

%% YOUR EXISTING PROCESSING LOGIC
lpFilt = designfilt('lowpassiir', ...
    'FilterOrder', 8, ...
    'HalfPowerFrequency', 200, ...
    'SampleRate', Fs);

y_filt = filtfilt(lpFilt, y);
y_amp = y_filt * 1000;
y_norm = y_amp / max(abs(y_amp));

%% SAVE PROCESSED AUDIO
audiowrite(outputFile, y_norm, Fs);
