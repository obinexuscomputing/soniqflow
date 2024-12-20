import { HarmonicSynthesizer } from "../harmonics";
import { NoiseGenerator } from "../prng";
import { NoiseType } from "../prng/NoiseGenerator";
import { AudioPlaybackManager } from "./AudioPlaybackManager";

export class AudioDriver {
  private noiseGenerator: NoiseGenerator;
  private harmonicSynthesizer: HarmonicSynthesizer;
  private audioPlaybackManager: AudioPlaybackManager;

  constructor(seed: number) {
    this.noiseGenerator = new NoiseGenerator(seed);
    this.harmonicSynthesizer = new HarmonicSynthesizer();
    this.audioPlaybackManager = new AudioPlaybackManager();
  }

  
  public async playAudio(audioBuffer: AudioBuffer): Promise<void> {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();

  }

  generateAndPlayNoise(type: NoiseType, length: number, baseFrequency: number, harmonics: number[], amplitudes: number[]): void {
    const noise = this.noiseGenerator.generateNoise(type, length);
    const noiseArray = noise instanceof Float32Array ? noise : Float32Array.from(noise);

    if (!noiseArray.length) {
      throw new Error("No noise data generated.");
    }

    const harmonicsData = this.harmonicSynthesizer.synthesizeHarmonics(baseFrequency, harmonics, amplitudes);

    if (!harmonicsData.length) {
      throw new Error("No harmonics data generated.");
    }

    const combinedData = noiseArray.map((value, index) => value + harmonicsData[index % harmonicsData.length]);

    if (!combinedData.length) {
      throw new Error("Combined data is empty or undefined.");
    }

    this.audioPlaybackManager.play(combinedData);
  }

  stop(): void {
    this.audioPlaybackManager.stop();
  }
}
