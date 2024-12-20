import { AmplitudeController } from '../utils';
import { BaseSynthesizer, Synthesizer } from './Synthesizer';


export class PianoSynthesizer extends BaseSynthesizer implements Synthesizer {
    protected context: AudioContext;
    protected gainNode: GainNode;
    protected amplitudeController: AmplitudeController;

    constructor() {
        super();
        this.context = new AudioContext();
        this.resumeContext();

        this.amplitudeController = new AmplitudeController();
        this.gainNode = this.context.createGain();
            this.gainNode.connect(this.context.destination);
        }

    private resumeContext(): void {
        if (this.context.state === 'suspended') {
            const resume = () => {
                this.context.resume();
                document.removeEventListener('click', resume);
                document.removeEventListener('keydown', resume);
            };
            document.addEventListener('click', resume);
            document.addEventListener('keydown', resume);
        }
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
