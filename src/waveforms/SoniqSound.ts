import { NoiseGenerator } from '../prng/NoiseGenerator';
import { NoiseGeneratorSynthesizer } from '../prng/NoiseGeneratorSynthesizer';
import { AmplitudeController } from '../utils/AmplitudeController';
import { FrequencyTransformer } from '../utils/FrequencyTransformer';
import { HarmonicSynthesizer } from '../harmonics/instruments/HarmonicSysthesizer';
import { AudioDriver } from '../audio/AudioDriver';
import { AudioMixer } from '../audio/AudioMixer';
import { AudioProcessor } from '../audio/AudioProcessor';
import { AudioVisualizer } from '../audio/AudioVisualizer';

export class SoniqSound {
  private noiseGenerator: NoiseGenerator;
  private synthesizer: NoiseGeneratorSynthesizer;
  private amplitudeController: AmplitudeController;
  private frequencyTransformer: FrequencyTransformer;
  private harmonicSynthesizer: HarmonicSynthesizer;
  private audioDriver: AudioDriver;
  private audioMixer: AudioMixer;
  private audioProcessor: AudioProcessor;
  private audioVisualizer: AudioVisualizer;

  constructor(seed: number) {
    this.noiseGenerator = new NoiseGenerator(seed);
    this.synthesizer = new NoiseGeneratorSynthesizer(seed);
    this.amplitudeController = new AmplitudeController();
    this.frequencyTransformer = new FrequencyTransformer();
    this.harmonicSynthesizer = new HarmonicSynthesizer();
    this.audioDriver = new AudioDriver(seed);
    this.audioMixer = new AudioMixer();
    this.audioProcessor = new AudioProcessor();
    this.audioVisualizer = new AudioVisualizer();
  }

  public async generateHarmonicWave({
    baseFrequency,
    harmonics,
    amplitudes,
    canvas
  }: {
    baseFrequency: number;
    harmonics: number[];
    amplitudes: number[];
    canvas: HTMLCanvasElement;
  }): Promise<void> {
    try {
      // Step 1: Generate base noise
      const rawNoise = this.noiseGenerator.generateNoise('white', 1024);
      const rawNoiseArray = rawNoise instanceof Float32Array ? rawNoise : new Float32Array([...rawNoise]);
      const synthesizedNoise = this.synthesizer.synthesizeNoise('white', rawNoiseArray.length);

      // Step 2: Process harmonics
      const transformedFrequencies = this.frequencyTransformer.transformFrequencies(rawNoiseArray);
      const controlledAmplitude = this.amplitudeController.controlAmplitude(transformedFrequencies);
      const harmonicWave = this.harmonicSynthesizer.synthesizeHarmonics(baseFrequency, harmonics, amplitudes);

      // Step 3: Process audio
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = audioCtx.createBuffer(1, harmonicWave.length, audioCtx.sampleRate);
      audioBuffer.copyToChannel(harmonicWave, 0);
      const mixedAudio = this.audioMixer.mixAudio([audioBuffer]);
      const processedAudio = this.audioProcessor.processAudio(mixedAudio);

      // Step 4: Play audio
      if (this.audioDriver.playAudio) {
        await this.audioDriver.playAudio(processedAudio);
      } else {
        console.warn('playAudio method not implemented in AudioDriver. Skipping audio playback.');
      }

      // Step 5: Visualize audio
      if (this.audioVisualizer.visualizeAudio) {
        this.audioVisualizer.visualizeAudio(harmonicWave, canvas);
      } else {
        console.warn('visualizeAudio method not implemented in AudioVisualizer. Skipping visualization.');
      }
    } catch (error) {
      console.error('Error generating harmonic wave:', error);
    }
  }
}
