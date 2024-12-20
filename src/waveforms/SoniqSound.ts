import { AudioPlaybackManager, AudioMixer, AudioProcessor, AudioVisualizer } from "../audio";
import { ViolinSynthesizer, PianoSynthesizer, GuitarSynthesizer, DrumSynthesizer, FluteSynthesizer } from "../harmonics";
import { Synthesizer, ConcreteSynthesizer } from "../harmonics/Synthesizer";
import { NoiseGenerator } from "../prng";
import { NoiseType } from "../prng/NoiseGenerator";
import { AmplitudeController, FrequencyTransformer } from "../utils";
import { SharedAudioContext } from "../utils/";

export let sharedAudioContext: AudioContext;
sharedAudioContext = SharedAudioContext.getInstance();

export interface HarmonicWaveConfig {
  baseFrequency: number;
  harmonics: number[];
  amplitudes: number[];
  canvas?: HTMLCanvasElement;
}

export class SoniqSound {
  private noiseGenerator: NoiseGenerator;
  private harmonicSynthesizer: Synthesizer;
  private amplitudeController: AmplitudeController;
  private audioVisualizer: AudioVisualizer;
  private audioProcessor: AudioProcessor;
  private audioMixer: AudioMixer;
  private instruments: { [key: string]: Synthesizer };
  public sharedAudioContext: AudioContext = sharedAudioContext;
  frequencyTransformer: FrequencyTransformer;
  audioPlaybackManager: AudioPlaybackManager;

  constructor(seed: number = Math.random() * 1000) {
    this.noiseGenerator = new NoiseGenerator(seed);
    this.harmonicSynthesizer = new ConcreteSynthesizer();
    this.amplitudeController = new AmplitudeController();
    this.frequencyTransformer = new FrequencyTransformer();
    this.audioPlaybackManager = new AudioPlaybackManager();
    this.audioMixer = new AudioMixer();
    this.audioProcessor = new AudioProcessor();
    this.audioVisualizer = new AudioVisualizer();

    this.instruments = {
      violin: new ViolinSynthesizer(),
      piano: new PianoSynthesizer(),
      guitar: new GuitarSynthesizer(),
      drum: new DrumSynthesizer(),
      flute: new FluteSynthesizer(),
    };
  }

  public async initializeAudioContext(): Promise<void> {
    if (sharedAudioContext.state === "suspended") {
      try {
        await sharedAudioContext.resume();
      } catch (error) {
        console.error("Error resuming AudioContext:", error);
      }
    }
  }

  public async playHarmonicWave(config: HarmonicWaveConfig): Promise<void> {
    const { baseFrequency, harmonics, amplitudes, canvas } = config;
    try {
      // Ensure AudioContext is ready
      await this.initializeAudioContext();

      // Generate harmonics
      const harmonicWave = this.harmonicSynthesizer.synthesizeHarmonics(
        baseFrequency,
        harmonics,
        amplitudes
      );

      // Process harmonics
      const envelope = new Float32Array(harmonicWave.length).fill(1); // Example envelope
      const gain = 1; // Example gain
      const controlledAmplitude = this.amplitudeController.controlAmplitude(harmonicWave, envelope, gain);
      const transformedFrequencies = this.frequencyTransformer.transformFrequencies(
        controlledAmplitude
      );

      // Play audio
      this.audioPlaybackManager.play(transformedFrequencies, transformedFrequencies.length / sharedAudioContext.sampleRate);

      if (canvas) {
        this.audioVisualizer.visualizeAudio(transformedFrequencies, canvas);
      }
    } catch (error) {
      console.error("Error playing harmonic wave:", error);
    }
  }

  public playInstrument(instrument: string, frequency: number, duration: number): void {
    const synth = this.instruments[instrument];
    if (!synth) {
      throw new Error(`Instrument ${instrument} is not available.`);
    }
    synth.play(frequency, duration);
  }

  public generateAndPlayNoise(
    type: NoiseType,
    length: number,
    baseFrequency: number,
    harmonics: number[],
    amplitudes: number[]
  ): void {
    try {
      const noise = this.noiseGenerator.generateNoise(type, length);
      const noiseArray = noise instanceof Float32Array ? noise : Float32Array.from(noise);

      const harmonicsData = this.harmonicSynthesizer.synthesizeHarmonics(baseFrequency, harmonics, amplitudes);
      const combinedData = noiseArray.map(
        (value, index) => value + harmonicsData[index % harmonicsData.length]
      );

      this.audioPlaybackManager.play(combinedData, combinedData.length / sharedAudioContext.sampleRate); // Assuming a sample rate of 44100 Hz
    } catch (error) {
      console.error("Error generating and playing noise:", error);
    }
  }

  public stopAll(): void {
    this.audioPlaybackManager.stop();
  }
}
