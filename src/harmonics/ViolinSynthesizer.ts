import { Synthesizer } from "./Systhesizer";

export class ViolinSynthesizer extends Synthesizer {
    private oscillator: OscillatorNode;
    protected gainNode: GainNode;

    constructor() {
        super();
        this.oscillator = this.context.createOscillator();
        this.gainNode = this.context.createGain();
        this.oscillator.connect(this.gainNode);
        this.oscillator.connect(this.gainNode);
    }

    public play(frequency: number, duration: number): void {
        this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        this.oscillator.start(this.context.currentTime);
        this.oscillator.stop(this.context.currentTime + duration);
    }
}
