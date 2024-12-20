
export class GuitarSynthesizer extends Synthesizer {
    private oscillator: OscillatorNode;
    context: AudioContext;
    gainNode: GainNode;
    constructor() {
        super();
        this.gainNode = this.context.createGain();
        this.oscillator = this.context.createOscillator();
        this.oscillator.connect(this.gainNode);
    }
    

    public play(frequency: number, duration: number): void {
        this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        this.oscillator.start(this.context.currentTime);
        this.oscillator.stop(this.context.currentTime + duration);
    }
}
