
import { Synthesizer } from "./Synthesizer";

export class DrumSynthesizer extends Synthesizer {
    play(frequency: number, duration: number): void {
        // Default implementation to play a kick drum sound
        this.playKick(frequency, duration);
    }
    protected context: AudioContext;
    protected gainNode: GainNode;

    constructor(context: AudioContext) {
        super();
        this.context = context;
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
    }

    public playKick(frequency: number = 150, duration: number = 0.5): void {
        const oscillator = this.context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        oscillator.connect(this.gainNode);
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    }

    public playSnare(frequency: number = 200, duration: number = 0.2): void {
        const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * duration, this.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.context.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.setValueAtTime(frequency, this.context.currentTime);

        noise.connect(noiseFilter);
        noiseFilter.connect(this.gainNode);
        noise.start(this.context.currentTime);
        noise.stop(this.context.currentTime + duration);
    }

    public playHiHat(frequency: number = 10000, duration: number = 0.05): void {
        const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * duration, this.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.context.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.setValueAtTime(frequency, this.context.currentTime);

        noise.connect(noiseFilter);
        noiseFilter.connect(this.gainNode);
        noise.start(this.context.currentTime);
        noise.stop(this.context.currentTime + duration);
    }
}
