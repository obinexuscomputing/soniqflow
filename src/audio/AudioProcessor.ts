export class AudioProcessor {
    process(data: Float32Array): Float32Array {
        return data;
    }

    processAudio(buffer: AudioBuffer | Float32Array): AudioBuffer {
        if (buffer instanceof AudioBuffer) {
            const data = buffer.getChannelData(0);
            const processedData = this.process(data);
            buffer.copyToChannel(processedData, 0);
            return buffer;
        } else {
            const audioCtx = new ((window.AudioContext) || (window as any).webkitAudioContext)();
            const audioBuffer = audioCtx.createBuffer(1, buffer.length, audioCtx.sampleRate);
            audioBuffer.copyToChannel(buffer, 0);
            const data = audioBuffer.getChannelData(0);
            const processedData = this.process(data);
            audioBuffer.copyToChannel(processedData, 0);
            return audioBuffer;
        }
    }

}   
