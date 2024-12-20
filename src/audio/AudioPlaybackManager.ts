
export class AudioPlaybackManager {
  private audioContext: AudioContext;
  private source: AudioBufferSourceNode | null = null;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async play(data: Float32Array, bubble: boolean = true): Promise<void> {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    const buffer = this.audioContext.createBuffer(1, data.length, this.audioContext.sampleRate);
    buffer.copyToChannel(data, 0);

    if (this.source) {
      this.source.stop();
      this.source.disconnect();
    }

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = buffer;
    this.source.loop = true; // Enable looping for continuous playback
    this.source.connect(this.audioContext.destination);
    this.source.start();

    if (bubble) {
        console.log('Audio playback bubbled to connected nodes.');
    }
  }

  stop(): void {
    if (this.source) {
      this.source.stop();
      this.source.disconnect();
      this.source = null;
    }
  }
}