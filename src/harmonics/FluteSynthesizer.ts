import { AmplitudeController } from '../utils';
import { Synthesizer } from './synthesizer';

export class FluteSynthesizer extends Synthesizer {
    private amplitudeController: AmplitudeController;

    constructor() {
        super();
        this.amplitudeController = new AmplitudeController();
    }

    public synthesizeHarmonics(baseFrequency: number, harmonics: number[], amplitudes: number[]): Float32Array {
        const sampleRate = this.context.sampleRate;
        const bufferLength = sampleRate; // 1 second buffer
        const buffer = this.context.createBuffer(1, bufferLength, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferLength; i++) {
            let sample = 0;
            const time = i / sampleRate;

            for (let j = 0; j < harmonics.length; j++) {
                sample += amplitudes[j] * Math.sin(2 * Math.PI * harmonics[j] * baseFrequency * time);
            }

            data[i] = this.amplitudeController.apply(sample);
        }

        return data;
    }

    public play(frequency: number, duration: number): void {
        const buffer = this.synthesizeHarmonics(frequency, [1, 2, 3], [1, 0.5, 0.25]);
        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = this.context.createBuffer(1, buffer.length, this.context.sampleRate);
        bufferSource.connect(this.gainNode);
        bufferSource.start(this.context.currentTime);
        bufferSource.stop(this.context.currentTime + duration);
    }
}
