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

import NoiseGenerator, { NoiseType } from "./NoiseGenerator";



class NoiseGeneratorSynthesizer {
    private noiseGenerator: NoiseGenerator;

    constructor(seed: number) {
        this.noiseGenerator = new DefaultNoiseGenerator(seed) as unknown as NoiseGenerator;
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

class DefaultNoiseGenerator implements NoiseGenerator {
    private seed: number;
    private permutation: number[];

    constructor(seed: number) {
        this.seed = seed;
        this.permutation = this.generatePermutation();
    }

    private generatePermutation(): number[] {
        const p = new Array(256).fill(0).map((_, i) => i);
        for (let i = p.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        return p.concat(p);
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

    generateNoise(type: NoiseType, length: number): Generator<number, void, unknown> | Float32Array {
        let x = Math.random() * 256;
        let y = Math.random() * 256;
        let z = Math.random() * 256;

        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);

        const A = this.permutation[X] + Y;
        const AA = this.permutation[A] + Z;
        const AB = this.permutation[A + 1] + Z;
        const B = this.permutation[X + 1] + Y;
        const BA = this.permutation[B] + Z;
        const BB = this.permutation[B + 1] + Z;

        return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.permutation[AA], x, y, z),
            this.grad(this.permutation[BA], x - 1, y, z)),
            this.lerp(u, this.grad(this.permutation[AB], x, y - 1, z),
                this.grad(this.permutation[BB], x - 1, y - 1, z))),
            this.lerp(v, this.lerp(u, this.grad(this.permutation[AA + 1], x, y, z - 1),
                this.grad(this.permutation[BA + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(this.permutation[AB + 1], x, y - 1, z - 1),
                    this.grad(this.permutation[BB + 1], x - 1, y - 1, z - 1))));
    }

    public generateWhiteNoise(length: number): Float32Array {
        const noise = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            noise[i] = Math.random() * 2 - 1;
        }
        return noise;
    }

    public generateBrownNoise(length: number): Float32Array {
        const noise = new Float32Array(length);
        let lastOut = 0.0;
        for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            noise[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = noise[i];
            noise[i] *= 3.5; // (roughly) compensate for gain
        }
        return noise;
    }

    *generatePerlinNoise(length: number): Generator<number, void, unknown> {
        // Simple Perlin noise implementation
        for (let i = 0; i < length; i++) {
            yield Math.random() * 2 - 1; // Placeholder for actual Perlin noise
        }
    }
}