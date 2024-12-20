import { AmplitudeController } from "../utils";

// Synthesizer Interface
export interface Synthesizer {
    play(frequency: number, duration: number): void;
    synthesizeHarmonics(baseFrequency: number, harmonics: number[], amplitudes: number[]): Float32Array;
}


// Abstract Synthesizer Class
export abstract class Synthesizer {
    protected context: AudioContext = new AudioContext();
    protected gainNode: GainNode;

    constructor() {
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);

        // Ensure AudioContext resumes on user gesture
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
}

// Concrete Synthesizer Implementation
export class ConcreteSynthesizer extends Synthesizer {
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

export class ChordSynthesizer extends Synthesizer {
    private amplitudeController: AmplitudeController = new AmplitudeController();
    private sampleRate: number;

    constructor(sampleRate: number = 44100) {
        super();
        this.sampleRate = sampleRate;
    }

    synthesize(frequencies: number[], duration: number): Float32Array {
        const length = Math.floor(this.sampleRate * duration);
        const chordData = new Float32Array(length);

        frequencies.forEach(frequency => {
            const sineWave = this.generateSineWave(frequency, length);
            for (let i = 0; i < length; i++) {
                chordData[i] += sineWave[i];
            }
        });

        const normalizedChord = this.amplitudeController.normalizeAmplitudes(chordData);
        const envelope = this.amplitudeController.generateAmplitudeEnvelope(length);
        return this.amplitudeController.applyAmplitudeEnvelope(normalizedChord, envelope);
    }

    private generateSineWave(frequency: number, length: number): Float32Array {
        const sineWave = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            sineWave[i] = Math.sin(2 * Math.PI * frequency * i / this.sampleRate);
        }
        return sineWave;
    }

    playAudioBuffer(buffer: Float32Array): void {
        const audioBuffer = this.context.createBuffer(1, buffer.length, this.sampleRate);
        audioBuffer.copyToChannel(buffer, 0);
        const source = this.context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.context.destination);
        source.start();
    }

    playChord(frequencies: number[], duration: number): void {
        const buffer = this.synthesize(frequencies, duration);
        this.playAudioBuffer(buffer);
    }

    playMajorChord(root: number, duration: number): void {
        const frequencies = [root, root * 5 / 4, root * 3 / 2];
        this.playChord(frequencies, duration);
    }

    playMinorChord(root: number, duration: number): void {
        const frequencies = [root, root * 6 / 5, root * 3 / 2];
        this.playChord(frequencies, duration);
    }

    playDiminishedChord(root: number, duration: number): void {
        const frequencies = [root, root * 6 / 5, root * 3 / 2];
        this.playChord(frequencies, duration);
    }
}
