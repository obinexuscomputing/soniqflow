
export class GuitarSynthesizer extends BaseSynthesizer {
    private oscillator: OscillatorNode;

    constructor() {
        super();
        this.oscillator = this.context.createOscillator();
        this.oscillator.connect(this.gainNode);
    }

    public play(frequency: number, duration: number): void {
        if (this.context.state === "suspended") {
            this.context.resume().then(() => {
                this.startOscillator(frequency, duration);
            });
        } else {
            this.startOscillator(frequency, duration);
        }
    }

    private startOscillator(frequency: number, duration: number): void {
        this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        this.oscillator.start(this.context.currentTime);
        this.oscillator.stop(this.context.currentTime + duration);
    }
}

export class PianoSynthesizer extends BaseSynthesizer {
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
