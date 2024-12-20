import { Synthesizer } from "./Synthesizer";

export class PianoSynthesizer extends Synthesizer {
    constructor() {
        super();
    }

    public play(frequency: number, duration: number): void {
        const oscillator = this.context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(1, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.gainNode);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    }

    public setVolume(volume: number): void {
        this.gainNode.gain.setValueAtTime(volume, this.context.currentTime);
    }
}