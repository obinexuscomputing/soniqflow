export abstract class Synthesizer {
  protected context: AudioContext;
  protected gainNode: GainNode;

  constructor() {
      this.context = new AudioContext();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
  }

  abstract play(frequency: number, duration: number): void;

  public setVolume(volume: number): void {
      this.gainNode.gain.setValueAtTime(volume, this.context.currentTime);
  }

  protected generateSineWaveBuffer(frequency: number, duration: number): Float32Array {
      const length = Math.floor(this.context.sampleRate * duration);
      const buffer = new Float32Array(length);
      for (let i = 0; i < length; i++) {
          buffer[i] = Math.sin(2 * Math.PI * frequency * (i / this.context.sampleRate));
      }
      return buffer;
  }
}
