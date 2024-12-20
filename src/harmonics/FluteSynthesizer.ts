export class FluteSynthesizer extends BaseSynthesizer {
    private amplitudeController: AmplitudeController;
    private sampleRate: number = 44100;

    constructor() {
        super();
        this.amplitudeController = new AmplitudeController();
    }

    public synthesize(frequencies: number[], duration: number): Float32Array {
        if (frequencies.length !== 1) {
            throw new Error("FluteSynthesizer only supports single frequency tones.");
        }

        const frequency = frequencies[0];
        const length = Math.floor(this.sampleRate * duration);
        const fluteData = new Float32Array(length);

        for (let i = 0; i < length; i++) {
            const t = i / this.sampleRate;
            fluteData[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 5);
        }

        const normalizedFlute = this.amplitudeController.normalizeAmplitudes(fluteData);
        const envelope = this.amplitudeController.generateAmplitudeEnvelope(length);
        return this.amplitudeController.applyAmplitudeEnvelope(normalizedFlute, envelope);
    }

    public play(frequency: number, duration: number): void {
        const buffer = this.synthesize([frequency], duration);
        const audioBuffer = this.context.createBuffer(1, buffer.length, this.sampleRate);
        audioBuffer.copyToChannel(buffer, 0);

        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.gainNode);
        bufferSource.start();
        bufferSource.stop(this.context.currentTime + duration);
    }

    public setVolume(volume: number): void {
        this.gainNode.gain.setValueAtTime(volume, this.context.currentTime);
    }
}
