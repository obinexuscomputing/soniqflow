

import { AmplitudeController } from '../utils';

export class FluteSynthesizer extends Synthesizer {
    private amplitudeController: AmplitudeController;
    private sampleRate: number = 44100;

    constructor(sampleRate: number = 44100) {
        super(sampleRate);
        this.amplitudeController = new AmplitudeController();
    }

    synthesize(frequencies: number[], duration: number): Float32Array {
        if (frequencies.length !== 1) {
            throw new Error("FluteSynthesizer only supports single frequency tones.");
        }

        const frequency = frequencies[0];
        const length = Math.floor(this.sampleRate * duration);
        const fluteData = new Float32Array(length);

        for (let i = 0; i < length; i++) {
            const t = i / this.sampleRate;
            fluteData[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 5);
        }

        const normalizedFlute = this.amplitudeController.normalizeAmplitudes(fluteData);
        const envelope = this.amplitudeController.generateAmplitudeEnvelope(length);
        return this.amplitudeController.applyAmplitudeEnvelope(normalizedFlute, envelope);
    }
}
