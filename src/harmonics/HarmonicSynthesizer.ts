export class HarmonicSynthesizer {
    synthesizeHarmonics(baseFrequency: number, harmonics: number[], amplitudes: number[]): Float32Array {
      const sampleRate = 44100;
      const duration = 1; // 1 second
      const totalSamples = sampleRate * duration;
  
      const result = new Float32Array(totalSamples);
      for (let i = 0; i < harmonics.length; i++) {
        const freq = baseFrequency * harmonics[i];
        const amp = amplitudes[i];
        for (let j = 0; j < totalSamples; j++) {
          result[j] += amp * Math.sin((2 * Math.PI * freq * j) / sampleRate);
        }
      }
  
      return result;
    }

    synthesizeHarmonicsWithEnvelope(baseFrequency: number, harmonics: number[], amplitudes: number[], envelope: number[]): Float32Array {
      const sampleRate = 44100;
      const duration = 1; // 1 second
      const totalSamples = sampleRate * duration;
  
      const result = new Float32Array(totalSamples);
      for (let i = 0; i < harmonics.length; i++) {
        const freq = baseFrequency * harmonics[i];
        const amp = amplitudes[i];
        for (let j = 0; j < totalSamples; j++) {
          result[j] += amp * Math.sin((2 * Math.PI * freq * j) / sampleRate) * envelope[j];
        }
      }
  
      return result;
    }
    
  }
  