export class AudioExporter {
    exportToWav(data: Float32Array, sampleRate: number): Blob {
      const header = this.createWavHeader(data.length, sampleRate);
      const audioData = new Uint8Array(header.length + data.length * 2);
      audioData.set(header);
  
      for (let i = 0; i < data.length; i++) {
        const sample = Math.max(-1, Math.min(1, data[i]));
        audioData[header.length + i * 2] = (sample * 32767) & 0xff;
        audioData[header.length + i * 2 + 1] = ((sample * 32767) >> 8) & 0xff;
      }
  
      return new Blob([audioData], { type: 'audio/wav' });
    }
  
    private createWavHeader(dataLength: number, sampleRate: number): Uint8Array {
      const buffer = new ArrayBuffer(44);
      const view = new DataView(buffer);
  
      const writeString = (offset: number, str: string): void => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };
  
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + dataLength * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, dataLength * 2, true);
  
      return new Uint8Array(buffer);
    }
  }
  