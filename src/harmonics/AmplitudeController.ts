export class AmplitudeController {
    normalizeAmplitudes(data: Float32Array): Float32Array {
      const maxAmplitude = Math.max(...data.map(Math.abs));
      return maxAmplitude === 0 ? data : data.map(value => value / maxAmplitude);
    }
  
    applyAmplitudeEnvelope(data: Float32Array, envelope: number[]): Float32Array {
      if (data.length !== envelope.length) {
        throw new Error("Data and envelope length must match.");
      }
      return data.map((value, index) => value * envelope[index]);
    }
  }
  