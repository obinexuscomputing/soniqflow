
import { Synthesizer } from "./Synthesizer";

export class GuitarSynthesizer extends Synthesizer {
    private static sharedContext: AudioContext = new AudioContext();
    protected gainNode: GainNode;
    private oscillator: OscillatorNode;

    constructor() {
        super();
        this.gainNode = GuitarSynthesizer.sharedContext.createGain();
        this.oscillator = GuitarSynthesizer.sharedContext.createOscillator();
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(GuitarSynthesizer.sharedContext.destination);
    }

    public play(frequency: number, duration: number): void {
        if (GuitarSynthesizer.sharedContext.state === 'suspended') {
            GuitarSynthesizer.sharedContext.resume().then(() => {
                this.startOscillator(frequency, duration);
            });
        } else {
            this.startOscillator(frequency, duration);
        }
    }

    private startOscillator(frequency: number, duration: number): void {
        this.oscillator.frequency.setValueAtTime(frequency, GuitarSynthesizer.sharedContext.currentTime);
        this.oscillator.start(GuitarSynthesizer.sharedContext.currentTime);
        this.oscillator.stop(GuitarSynthesizer.sharedContext.currentTime + duration);
    }
}
