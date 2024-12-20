export class FrequencyTransformer {
    applyFrequencyRange(data: Float32Array, range: [number, number]): Float32Array {
      const [min, max] = range;
      return data.map(value => value * (max - min) + min);
    }
  
    shiftFrequencies(data: Float32Array, shiftAmount: number): Float32Array {
      return data.map(value => value + shiftAmount);
    }
  }
  