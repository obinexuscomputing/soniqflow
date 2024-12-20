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

  public playBuffer(buffer: Float32Array, duration: number): void {
      const audioBuffer = this.context.createBuffer(1, buffer.length, this.context.sampleRate);
      audioBuffer.copyToChannel(buffer, 0);

      const bufferSource = this.context.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(this.context.destination);
      bufferSource.start();
      bufferSource.stop(this.context.currentTime + duration);
  }
}
