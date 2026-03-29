function createWavHeader(dataLength, sampleRate = 8000, channels = 1, bitsPerSample = 16) {
  const header = Buffer.alloc(44);

  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);

  // RIFF chunk descriptor
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataLength, 4);
  header.write("WAVE", 8);

  // fmt subchunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // PCM header size
  header.writeUInt16LE(1, 20);  // Audio format = PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  // data subchunk
  header.write("data", 36);
  header.writeUInt32LE(dataLength, 40);

  return header;
}

module.exports = createWavHeader;