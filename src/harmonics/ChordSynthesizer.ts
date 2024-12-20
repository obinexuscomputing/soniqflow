
import { AmplitudeController } from '../utils';
import { Synthesizer } from './Systhesizer';

export class ChordSynthesizer extends Synthesizer {
    private amplitudeController: AmplitudeController = new AmplitudeController();
    sampleRate: number;
    private audioContext: AudioContext;

    constructor(sampleRate: number = 44100) {
        super();
        this.sampleRate = sampleRate;
        this.audioContext = new AudioContext();
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
        const audioBuffer = this.audioContext.createBuffer(1, buffer.length, this.sampleRate);
        audioBuffer.copyToChannel(buffer, 0);
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
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

