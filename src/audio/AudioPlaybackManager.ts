import { SharedAudioContext } from './SharedAudioContext';

export class AudioPlaybackManager {
    private context: AudioContext;
    private gainNode: GainNode;

    constructor() {
        this.context = SharedAudioContext.getInstance();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
    }

    public playBuffer(audioBuffer: AudioBuffer, startTime: number = 0, duration?: number): void {
        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.gainNode);

        if (duration) {
            bufferSource.start(this.context.currentTime + startTime);
            bufferSource.stop(this.context.currentTime + startTime + duration);
        } else {
            bufferSource.start(this.context.currentTime + startTime);
        }
    }

    public setVolume(volume: number): void {
        this.gainNode.gain.setValueAtTime(volume, this.context.currentTime);
    }

    public fadeOut(duration: number): void {
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + duration);
    }

    public fadeIn(volume: number, duration: number): void {
        this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(volume, this.context.currentTime + duration);
    }
}
