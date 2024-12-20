// Synthesizer Interface
export interface Synthesizer {
    play(frequency: number, duration: number): void;
    synthesizeHarmonics(baseFrequency: number, harmonics: number[], amplitudes: number[]): Float32Array;
}


// Abstract Synthesizer Class
export abstract class BaseSynthesizer implements Synthesizer {
    protected context: AudioContext;
    protected gainNode: GainNode;

    constructor() {
        this.context = SharedAudioContext.getInstance();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
    }

    abstract play(frequency: number, duration: number): void;

    public synthesizeHarmonics(baseFrequency: number, harmonics: number[], amplitudes: number[]): Float32Array {
        const length = Math.floor(this.context.sampleRate * 1); // Default 1 second buffer
        const buffer = new Float32Array(length);

        harmonics.forEach((harmonic, index) => {
            const amplitude = amplitudes[index] || 1;
            for (let i = 0; i < length; i++) {
                buffer[i] += amplitude * Math.sin(2 * Math.PI * (baseFrequency * harmonic) * (i / this.context.sampleRate));
            }
        });

        // Normalize buffer
        const maxAmplitude = Math.max(...buffer.map(Math.abs));
        if (maxAmplitude > 0) {
            for (let i = 0; i < buffer.length; i++) {
                buffer[i] /= maxAmplitude;
            }
        }

        return buffer;
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

// Concrete Synthesizer Implementation
export class ConcreteSynthesizer extends BaseSynthesizer {
    public play(frequency: number, duration: number): void {
        const buffer = this.generateSineWaveBuffer(frequency, duration);
        const audioBuffer = this.context.createBuffer(1, buffer.length, this.context.sampleRate);
        audioBuffer.copyToChannel(buffer, 0);

        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.gainNode);
        bufferSource.start();
        bufferSource.stop(this.context.currentTime + duration);
    }
}


export class ChordSynthesizer extends BaseSynthesizer {
    public play(frequency: number, duration: number): void {
        this.playChord([frequency], duration);
    }
    private amplitudeController: AmplitudeController = new AmplitudeController();
    private sampleRate: number;

    constructor(sampleRate: number = 44100) {
        super();
        this.sampleRate = sampleRate;
    }

    public synthesize(frequencies: number[], duration: number): Float32Array {
        const length = Math.floor(this.sampleRate * duration);
        const chordData = new Float32Array(length);

        frequencies.forEach(frequency => {
            const sineWave = this.generateSineWaveBuffer(frequency, duration);
            for (let i = 0; i < length; i++) {
                chordData[i] += sineWave[i];
            }
        });

        const normalizedChord = this.amplitudeController.normalizeAmplitudes(chordData);
        const envelope = this.amplitudeController.generateAmplitudeEnvelope(length);
        return this.amplitudeController.applyAmplitudeEnvelope(normalizedChord, envelope);
    }

    public playAudioBuffer(buffer: Float32Array): void {
        const audioBuffer = this.context.createBuffer(1, buffer.length, this.sampleRate);
        audioBuffer.copyToChannel(buffer, 0);
        const source = this.context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.gainNode);
        source.start();
    }

    public playChord(frequencies: number[], duration: number): void {
        const buffer = this.synthesize(frequencies, duration);
        this.playAudioBuffer(buffer);
    }

    public playMajorChord(root: number, duration: number): void {
        const frequencies = [root, root * 5 / 4, root * 3 / 2];
        this.playChord(frequencies, duration);
    }

    public playMinorChord(root: number, duration: number): void {
        const frequencies = [root, root * 6 / 5, root * 3 / 2];
        this.playChord(frequencies, duration);
    }

    public playDiminishedChord(root: number, duration: number): void {
        const frequencies = [root, root * 6 / 5, root * 3 / 2];
        this.playChord(frequencies, duration);
    }
}