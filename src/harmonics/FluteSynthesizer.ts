import { AmplitudeController, SharedAudioContext } from '../utils';
import { BaseSynthesizer } from './Synthesizer';

export class FluteSynthesizer extends BaseSynthesizer {
    private amplitudeController: AmplitudeController = new AmplitudeController();
    protected context: AudioContext;
    protected gainNode: GainNode;

    constructor() {
        super();
        this.context = SharedAudioContext.getInstance();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
        document.addEventListener('click', () => {
            if (this.context.state === 'suspended') {
                this.context.resume();
            }
        });
    }

    public synthesizeHarmonics(baseFrequency: number, harmonics: number[], amplitudes: number[]): Float32Array {
        const sampleRate = this.context.sampleRate;
        const bufferLength = sampleRate; // 1 second buffer
        const data = new Float32Array(bufferLength);

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
        const audioBuffer = this.context.createBuffer(1, buffer.length, this.context.sampleRate);
        audioBuffer.copyToChannel(buffer, 0);

        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.gainNode);
        bufferSource.start(this.context.currentTime);
        bufferSource.stop(this.context.currentTime + duration);
    }
}
