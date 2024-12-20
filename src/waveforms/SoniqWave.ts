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

  constructor() {
    this.noiseGenerator = new NoiseGenerator();
    this.synthesizer = new NoiseGeneratorSynthesizer();
    this.amplitudeController = new AmplitudeController();
    this.frequencyTransformer = new FrequencyTransformer();
    this.harmonicSynthesizer = new HarmonicSynthesizer();
    this.audioDriver = new AudioDriver();
    this.audioMixer = new AudioMixer();
    this.audioProcessor = new AudioProcessor();
    this.audioVisualizer = new AudioVisualizer();
  }

  public async generateHarmonicWave(): Promise<void> {
    try {
      // Step 1: Generate base noise
      const rawNoise = this.noiseGenerator.generate();
      const synthesizedNoise = this.synthesizer.synthesize(rawNoise);

      // Step 2: Process harmonics
      const transformedFrequencies = this.frequencyTransformer.transform(synthesizedNoise);
      const controlledAmplitude = this.amplitudeController.control(transformedFrequencies);
      const harmonics = this.harmonicSynthesizer.synthesize(controlledAmplitude);

      // Step 3: Process audio
      const mixedAudio = this.audioMixer.mix(harmonics);
      const processedAudio = this.audioProcessor.process(mixedAudio);

      // Step 4: Play audio
      await this.audioDriver.play(processedAudio);

      // Step 5: Visualize audio
      this.audioVisualizer.visualize(processedAudio);
    } catch (error) {
      console.error('Error generating harmonic wave:', error);
    }
  }
}
