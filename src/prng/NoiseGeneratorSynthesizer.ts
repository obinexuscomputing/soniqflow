import { NoiseGenerator, NoiseType } from './NoiseGenerator';

/**
 * The `NoiseGeneratorSynthesizer` class utilizes the `NoiseGenerator` class to synthesize different types of noise.
 * 
 * @class
 * @example
 * // Create a new NoiseGeneratorSynthesizer instance
 * const noiseSynth = new NoiseGeneratorSynthesizer(42);
 * 
 * // Synthesize white noise
 * const whiteNoise = noiseSynth.synthesizeNoise('white', 100);
 * for (const value of whiteNoise) {
 *     console.log(value);
 * }
 * 
 * // Synthesize brown noise
 * const brownNoise = noiseSynth.synthesizeNoise('brown', 100);
 * console.log(brownNoise);
 * 
 * // Synthesize Perlin noise
 * const perlinNoise = noiseSynth.synthesizeNoise('perlin', 100);
 * for (const value of perlinNoise) {
 *     console.log(value);
 * }
 * 
 * @param {number} seed - The seed value for the noise generator.
 * 
 * @method synthesizeNoise
 * @param {NoiseType} type - The type of noise to synthesize ('brown', 'white', 'perlin').
 * @param {number} length - The length of the noise array or generator.
 * @returns {Float32Array | Generator<number, void, unknown>} The synthesized noise.
 */
export class NoiseGeneratorSynthesizer {
    private noiseGenerator: NoiseGenerator;

    constructor(seed: number) {
        this.noiseGenerator = new NoiseGenerator    (seed);
    }


    synthesizeNoise(type: NoiseType, length: number): Float32Array | Generator<number, void, unknown> {
        switch (type) {
            case 'white':
                return this.noiseGenerator.generateWhiteNoise(length);
            case 'brown':
                return this.noiseGenerator.generateBrownNoise(length);
            case 'perlin':
                return this.noiseGenerator.generatePerlinNoise(length);
            default:
                throw new Error(`Unknown noise type: ${type}`);
        }
    }
}

