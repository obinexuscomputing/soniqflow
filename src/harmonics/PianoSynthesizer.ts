import { Synthesizer } from "./Systhesizer";

export class PianoSynthesizer extends Synthesizer {
    context: any;
    gainNode: GainNode = this.context.createGain();

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

    protected generateSineWaveBuffer(frequency: number, duration: number): Float32Array {
        const length = Math.floor(this.context.sampleRate * duration);
        const buffer = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            buffer[i] = Math.sin(2 * Math.PI * frequency * (i / this.context.sampleRate));
        }
        return buffer;
    }
}
