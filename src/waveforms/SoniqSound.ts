import { AudioPlaybackManager, AudioMixer, AudioProcessor, AudioVisualizer } from "../audio";
import { ViolinSynthesizer, PianoSynthesizer, GuitarSynthesizer, DrumSynthesizer, FluteSynthesizer } from "../harmonics";
import { Synthesizer, ConcreteSynthesizer } from "../harmonics/Synthesizer";
import { NoiseGenerator } from "../prng";
import { NoiseType } from "../prng/NoiseGenerator";
import { AmplitudeController, FrequencyTransformer } from "../utils";


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
  private frequencyTransformer: FrequencyTransformer;
  private audioPlaybackManager: AudioPlaybackManager;
  private audioVisualizer: AudioVisualizer;
  private audioMixer: AudioMixer;
  private audioProcessor: AudioProcessor;
  private instruments: { [key: string]: Synthesizer };

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
      drum: new DrumSynthesizer(new AudioContext()),
      flute: new FluteSynthesizer(),
    };
  }

  public async playHarmonicWave(config: HarmonicWaveConfig): Promise<void> {
    const { baseFrequency, harmonics, amplitudes, canvas } = config;
    try {
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

      // Audio context setup
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = audioCtx.createBuffer(1, transformedFrequencies.length, audioCtx.sampleRate);
      audioBuffer.copyToChannel(transformedFrequencies, 0);
      
      // Play audio
      this.audioPlaybackManager.play(transformedFrequencies, transformedFrequencies.length / audioCtx.sampleRate);

      this.audioPlaybackManager.play(transformedFrequencies, transformedFrequencies.length / audioCtx.sampleRate);
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

      this.audioPlaybackManager.play(combinedData, combinedData.length / 44100); // Assuming a sample rate of 44100 Hz
    } catch (error) {
      console.error("Error generating and playing noise:", error);
    }
  }

  public stopAll(): void {
    this.audioPlaybackManager.stop();
  }
}
