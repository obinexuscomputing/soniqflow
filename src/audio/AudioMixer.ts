export class AudioMixer {
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
  