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

    generateAndPlayNoise(type: NoiseType, length: number, baseFrequency: number, harmonics: number[], amplitudes: number[]): void {
        const noise = this.noiseGenerator.generateNoise(type, length);
        const noiseArray = noise instanceof Float32Array ? noise : Float32Array.from(noise);
        const harmonicsData = this.harmonicSynthesizer.synthesizeHarmonics(baseFrequency, harmonics, amplitudes);
        const combinedData = noiseArray.map((value, index) => value + harmonicsData[index % harmonicsData.length]);
        this.audioPlaybackManager.play(combinedData);
    }
}