
/**
 * The `NoiseGenerator` class generates different types of noise, including Perlin noise, white noise, and brown noise.
 * 
 * @class
 * @example
 * // Create a new NoiseGenerator instance
 * const noiseGen = new NoiseGenerator(42);
 * 
 * // Generate white noise
 * const whiteNoise = noiseGen.generateNoise('white', 100);
 * for (const value of whiteNoise) {
 *     console.log(value);
 * }
 * 
 * // Generate brown noise
 * const brownNoise = noiseGen.generateNoise('brown', 100);
 * console.log(brownNoise);
 * 
 * // Generate Perlin noise
 * const perlinNoise = noiseGen.generateNoise('perlin', 100);
 * for (const value of perlinNoise) {
 *     console.log(value);
 * }
 * 
 * @param {number} seed - The seed value for the noise generator.
 * 
 * @method generateNoise
 * @param {NoiseType} type - The type of noise to generate ('brown', 'white', 'perlin').
 * @param {number} length - The length of the noise array or generator.
 * @returns {Float32Array | Generator<number, void, unknown>} The generated noise.
 * 
 * @method generatePerlinNoise
 * @param {number} size - The size of the Perlin noise array.
 * @returns {Generator<number, void, unknown>} The generated Perlin noise.
 * 
 * @method generateWhiteNoise
 * @param {number} size - The size of the white noise array.
 * @returns {Generator<number, void, unknown>} The generated white noise.
 * 
 * @method generateBrownNoise
 * @param {number} length - The length of the brown noise array.
 * @returns {Float32Array} The generated brown noise.
 */

export type NoiseType = 'brown' | 'white' | 'perlin';
export interface NoiseGenerator {
    generateWhiteNoise(length: number): Generator<number, void, unknown>;
    generateBrownNoise(length: number): Generator<number, void, unknown>;
    generatePerlinNoise(length: number): Generator<number, void, unknown>;
}

export class NoiseGenerator {
    private permutation: number[];

    constructor(seed: number) {
        this.permutation = [];
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = i;
        }

        for (let i = 0; i < 256; i++) {
            const j = Math.floor(Math.random() * 256);
            [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
        }

        this.permutation = this.permutation.concat(this.permutation);
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

    private grad(hash: number, x: number, y: number, z: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    public *generatePerlinNoise(size: number): Generator<number, void, unknown> {
        for (let i = 0; i < size; i++) {
            yield Math.random();
        }
    }

    public *generateBrownNoise(length: number): Generator<number, void, unknown> {
        const output = new Float32Array(length);
        let lastOut = 0.0;

        for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // (roughly) compensate for gain
        }

        for (const value of output) {
            yield value;
        }
    }

    public generateNoise(type: NoiseType, length: number): Float32Array | Generator<number, void, unknown> {
        switch (type) {
            case 'brown':
                return this.generateBrownNoise(length);
            case 'white':
                return this.generateWhiteNoise(length);
            case 'perlin':
                return this.generatePerlinNoise(length);
            default:
                throw new Error('Unsupported noise type');
        }
    }

    public *generateWhiteNoise(size: number): Generator<number, void, unknown> {
        for (let i = 0; i < size; i++) {
            yield Math.random() * 2 - 1; // Generates a value between -1 and 1
        }
    }

    
}