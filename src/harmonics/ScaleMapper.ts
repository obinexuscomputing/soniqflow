export class ScaleMapper {
  private scales: Record<string, number[]> = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonic: [0, 2, 4, 7, 9],
  };

  mapToScale(data: Float32Array, scaleName: string): Float32Array {
    const scale = this.scales[scaleName.toLowerCase()];
    if (!scale) {
      throw new Error(`Scale "${scaleName}" not found`);
    }

    return data.map(value => {
      const note = Math.round(value * scale.length);
      return scale[Math.abs(note % scale.length)];
    });
  }

  getAvailableScales(): string[] {
    return Object.keys(this.scales);
  }

  addScale(name: string, intervals: number[]): void {
    this.scales[name] = intervals;
  }

  removeScale(name: string): void {
    delete this.scales[name];
  }

  clearScales(): void {
    this.scales = {};
  }
  
}
