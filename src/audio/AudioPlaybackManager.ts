import { SharedAudioContext } from "../utils/SharedAudioContext";

export class AudioPlaybackManager {
    private context: AudioContext;
    private gainNode: GainNode;
    private currentSource: AudioBufferSourceNode | null = null;
    
    constructor() {
        this.context = SharedAudioContext.getInstance();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
    }

    public play(data: Float32Array, duration: number): void {
        if (this.currentSource) {
            this.stop();
        }

        // Convert Float32Array to AudioBuffer
        const audioBuffer = this.context.createBuffer(1, data.length, this.context.sampleRate);
        audioBuffer.copyToChannel(data, 0);

        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.gainNode);
        bufferSource.start(this.context.currentTime);
        bufferSource.stop(this.context.currentTime + duration);

        this.currentSource = bufferSource;
    }

    public stop(): void {
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource.disconnect();
            this.currentSource = null;
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
