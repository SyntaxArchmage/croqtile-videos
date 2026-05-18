#!/bin/bash
# Patch Remotion Studio AudioWaveform to log decode errors instead of crashing.
# The waveform renderer uses OfflineAudioContext which fails on some MP3 formats,
# but actual audio playback via <audio> element works fine.
FILE="node_modules/@remotion/studio/dist/components/AudioWaveform.js"
if [ -f "$FILE" ]; then
  sed -i 's/setError(new Error(event\.data\.message));/console.debug(event.data.message);/' "$FILE"
  echo "Patched AudioWaveform.js: decode errors now logged instead of crashing"
fi
