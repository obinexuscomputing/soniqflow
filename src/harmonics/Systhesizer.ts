export interface Synthesizer {
    play(frequency: number, duration: number): void;
    synthesizeHarmonics(baseFrequency: number, harmonics: number[], amplitudes: number[]): Float32Array;
  }

  
export abstract class Synthesizer {
  protected context: AudioContext;
  protected gainNode: GainNode;

  constructor() {
      this.context = new AudioContext();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);

      // Resume AudioContext after a user gesture
      document.addEventListener('click', () => {
          if (this.context.state === 'suspended') {
              this.context.resume();
          }
      });
  }


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

export class ConcreteSynthesizer extends Synthesizer {
    public play(frequency: number, duration: number): void {
            const buffer = this.generateSineWaveBuffer(frequency, duration);
            const audioBuffer = this.context.createBuffer(1, buffer.length, this.context.sampleRate);
            audioBuffer.copyToChannel(buffer, 0);

            const bufferSource = this.context.createBufferSource();
            bufferSource.buffer = audioBuffer;
            bufferSource.connect(this.gainNode);
            bufferSource.start();
            bufferSource.stop(this.context.currentTime + duration);
    }
}