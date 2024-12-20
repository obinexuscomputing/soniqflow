export class AmplitudeController {
    controlAmplitude(data: Float32Array): Float32Array {
      const normalizedData = this.normalizeAmplitudes(data);
      const envelope = this.generateAmplitudeEnvelope(data.length);
      return this.applyAmplitudeEnvelope(normalizedData, envelope);
    }

    generateAmplitudeEnvelope(length: number): number[] {
      const envelope = new Array(length).fill(1);
      const attackTime = Math.floor(length * 0.1);
      const decayTime = Math.floor(length * 0.2);
      const sustainTime = Math.floor(length * 0.5);
      const releaseTime = Math.floor(length * 0.2);
  
      for (let i = 0; i < attackTime; i++) {
        envelope[i] = i / attackTime;
      }
      for (let i = attackTime; i < attackTime + decayTime; i++) {
        envelope[i] = 1 - (1 - 0.5) * (i - attackTime) / decayTime;
      }
      for (let i = attackTime + decayTime; i < attackTime + decayTime + sustainTime; i++) {
        envelope[i] = 0.5;
      }
      for (let i = attackTime + decayTime + sustainTime; i < length; i++) {
        envelope[i] = 0.5 - 0.5 * (i - attackTime - decayTime - sustainTime) / releaseTime;
      }
  
      return envelope;
    }

    
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
  