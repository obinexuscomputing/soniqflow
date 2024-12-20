
import { AmplitudeController } from '../utils';
import { Synthesizer } from './Systhesizer';

export class ChordSynthesizer extends Synthesizer {
    private amplitudeController: AmplitudeController;
    sampleRate: number;

    constructor(sampleRate: number = 44100) {
        super();
        this.amplitudeController = new AmplitudeController();
    }

    synthesize(frequencies: number[], duration: number): Float32Array {
        const length = Math.floor(this.sampleRate * duration);
        const chordData = new Float32Array(length);

        frequencies.forEach(frequency => {
            const sineWave = this.generateSineWave(frequency, length);
            for (let i = 0; i < length; i++) {
                chordData[i] += sineWave[i];
            }
        });

        const normalizedChord = this.amplitudeController.normalizeAmplitudes(chordData);
        const envelope = this.amplitudeController.generateAmplitudeEnvelope(length);
        return this.amplitudeController.applyAmplitudeEnvelope(normalizedChord, envelope);
    }
    generateSineWave(frequency: number, length: number) {
        throw new Error('Method not implemented.');
    }
}
