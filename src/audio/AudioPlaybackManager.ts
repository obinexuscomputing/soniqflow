export class AudioPlaybackManager {
  private context: AudioContext;

  constructor() {
      this.context = new AudioContext();
      this.setupAudioContextResume();
  }

  private setupAudioContextResume(): void {
      const resumeContext = () => {
          if (this.context.state === 'suspended') {
              this.context.resume();
          }
      };
      document.addEventListener('click', resumeContext);
      document.addEventListener('keydown', resumeContext);
  }

  public play(buffer: Float32Array, duration: number): void {
      this.playBuffer(buffer, duration);
  }
  public playBuffer(buffer: Float32Array, duration: number): void {
      const audioBuffer = this.context.createBuffer(1, buffer.length, this.context.sampleRate);
      audioBuffer.copyToChannel(buffer, 0);

      const bufferSource = this.context.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(this.context.destination);
      bufferSource.start();
      bufferSource.stop(this.context.currentTime + duration);
  }

  static async loadAudioBuffer(url: string): Promise<Float32Array> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await AudioPlaybackManager.decodeAudioData(arrayBuffer);
        return audioBuffer.getChannelData(0);
    }

    private static async decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
        const context = new AudioContext();
        return new Promise((resolve, reject) => {
            context.decodeAudioData(arrayBuffer, resolve, reject);
        });
    }

    public async playAudioBufferFromURL(url: string, duration: number): Promise<void> {
        const audioBuffer = await AudioPlaybackManager.loadAudioBuffer(url);
        this.playBuffer(audioBuffer, duration);
    }

    stop(){
        this.context.close();
    }
}
