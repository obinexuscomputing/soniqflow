export class AudioMixer {
    mixAudio(buffers: AudioBuffer[]): AudioBuffer {
      const maxLength = Math.max(...buffers.map(buffer => buffer.length));
      const mixed = new Float32Array(maxLength);
  
      buffers.forEach(buffer => {
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          mixed[i] += data[i];
        }
      });
  
      // Normalize
      const maxAmplitude = Math.max(...mixed.map(Math.abs));
      mixed.forEach((value, i) => mixed[i] = value / maxAmplitude);
  
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const mixedBuffer = audioCtx.createBuffer(1, mixed.length, audioCtx.sampleRate);
      mixedBuffer.copyToChannel(mixed, 0);
      return mixedBuffer;
    }


    mix(tracks: Float32Array[]): Float32Array {
      const maxLength = Math.max(...tracks.map(track => track.length));
      const mixed = new Float32Array(maxLength);
  
      tracks.forEach(track => {
        for (let i = 0; i < track.length; i++) {
          mixed[i] += track[i];
        }
      });
  
      // Normalize
      const maxAmplitude = Math.max(...mixed.map(Math.abs));
      return maxAmplitude > 0 ? mixed.map(value => value / maxAmplitude) : mixed;
    } 

    mixTracks(tracks: Float32Array[]): Float32Array {
      const maxLength = Math.max(...tracks.map(track => track.length));
      const mixed = new Float32Array(maxLength);
  
      tracks.forEach(track => {
        for (let i = 0; i < track.length; i++) {
          mixed[i] += track[i];
        }
      });
  
      // Normalize
      const maxAmplitude = Math.max(...mixed.map(Math.abs));
      return maxAmplitude > 0 ? mixed.map(value => value / maxAmplitude) : mixed;
    }
  }
  