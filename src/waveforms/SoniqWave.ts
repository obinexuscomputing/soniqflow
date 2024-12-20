import { NoiseGenerator } from '../prng/NoiseGenerator';
import { NoiseGeneratorSynthesizer } from '../prng/NoiseGeneratorSynthesizer';
import { AmplitudeController } from '../harmonics/AmplitudeController';
import { FrequencyTransformer } from '../harmonics/FrequencyTransformer';
import { HarmonicSynthesizer } from '../harmonics/HarmonicSynthesizer';
import { AudioDriver } from '../audio/AudioDriver';
import { AudioMixer } from '../audio/AudioMixer';
import { AudioProcessor } from '../audio/AudioProcessor';
import { AudioVisualizer } from '../audio/AudioVisualizer';

export class SoniqWave {
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

  public async generateHarmonicWave(): Promise<void> {
    try {
      // Step 1: Generate base noise
      const rawNoise = this.noiseGenerator.generateNoise('white', 1024);
      const rawNoiseArray = rawNoise instanceof Float32Array ? rawNoise : new Float32Array(rawNoise);
      const synthesizedNoise = this.synthesizer.synthesizeNoise('white', rawNoiseArray.length);

      // Step 2: Process harmonics
      const transformedFrequencies = this.frequencyTransformer.transformFrequencies(synthesizedNoise);
      const controlledAmplitude = this.amplitudeController.controlAmplitude(transformedFrequencies);
      const harmonics = this.harmonicSynthesizer.synthesizeHarmonics(controlledAmplitude);

      // Step 3: Process audio
      const mixedAudio = this.audioMixer.mixAudio(harmonics);
      const processedAudio = this.audioProcessor.processAudio(mixedAudio);

      // Step 4: Play audio
      await this.audioDriver.playAudio(processedAudio);

      // Step 5: Visualize audio
      this.audioVisualizer.visualizeAudio(processedAudio);
    } catch (error) {
      console.error('Error generating harmonic wave:', error);
    }
  }
}
