export class FrequencyTransformer {
    transformFrequencies(synthesizedNoise: Float32Array<ArrayBufferLike> | Generator<number, void, unknown>) {
        throw new Error('Method not implemented.');
    }
    applyFrequencyRange(data: Float32Array, range: [number, number]): Float32Array {
      const [min, max] = range;
      return data.map(value => value * (max - min) + min);
    }
  
    shiftFrequencies(data: Float32Array, shiftAmount: number): Float32Array {
      return data.map(value => value + shiftAmount);
    }

    applyFrequencyEnvelope(data: Float32Array, envelope: number[]): Float32Array {
      if (data.length !== envelope.length) {
        throw new Error("Data and envelope length must match.");
      }
      return data.map((value, index) => value * envelope[index]);
    }

    applyFrequencyMultiplier(data: Float32Array, multiplier: number): Float32Array {
      return data.map(value => value * multiplier);
    }

    applyFrequencyDivider(data: Float32Array, divider: number): Float32Array {
      return data.map(value => value / divider);
    }
    
  }
  