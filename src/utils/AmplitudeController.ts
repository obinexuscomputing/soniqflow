
// AmplitudeController Class
export class AmplitudeController {
    apply(sample: number): number {
        return sample;
    }

    normalizeAmplitudes(buffer: Float32Array): Float32Array {
        const maxAmplitude = Math.max(...buffer.map(Math.abs));
        if (maxAmplitude > 0) {
            for (let i = 0; i < buffer.length; i++) {
                buffer[i] /= maxAmplitude;
            }
        }
        return buffer;
    }

    generateAmplitudeEnvelope(length: number): Float32Array {
        const envelope = new Float32Array(length);
        const attack = Math.floor(length * 0.1);
        const release = Math.floor(length * 0.1);
        for (let i = 0; i < length; i++) {
            if (i < attack) {
                envelope[i] = i / attack;
            } else if (i > length - release) {
                envelope[i] = (length - i) / release;
            } else {
                envelope[i] = 1;
            }
        }
        return envelope;
    }

    applyAmplitudeEnvelope(buffer: Float32Array, envelope: Float32Array): Float32Array {
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] *= envelope[i];
        }
        return buffer;
    }

    applyGain(buffer: Float32Array, gain: number): Float32Array {
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] *= gain;
        }
        return buffer;
    }

    applyGainEnvelope(buffer: Float32Array, envelope: Float32Array, gain: number): Float32Array {
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] *= envelope[i] * gain;
        }
        return buffer;
    }

    controlAmplitude(buffer: Float32Array, envelope: Float32Array, gain: number): Float32Array {
        return this.applyGainEnvelope(this.applyAmplitudeEnvelope(buffer, envelope), envelope, gain);
    }
}