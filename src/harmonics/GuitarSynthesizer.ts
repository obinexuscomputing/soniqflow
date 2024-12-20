import { Synthesizer } from "./Synthesizer";

export class GuitarSynthesizer extends Synthesizer {
    private oscillator: OscillatorNode;
    context: AudioContext;
    gainNode: GainNode;
    constructor() {
        super();
        this.context = new AudioContext();
        this.gainNode = this.context.createGain();
        this.oscillator = this.context.createOscillator();
        this.oscillator.connect(this.gainNode);
    }

    public play(frequency: number, duration: number): void {
        if (this.context.state === 'suspended') {
            this.context.resume().then(() => {
                this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
                this.oscillator.start();
                this.oscillator.stop(this.context.currentTime + duration);
            });
        } else {
            this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
            this.oscillator.start();
            this.oscillator.stop(this.context.currentTime + duration);
        }
    }
}
