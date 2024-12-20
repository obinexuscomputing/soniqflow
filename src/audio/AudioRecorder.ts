export class AudioRecorder {
    public audioContext: AudioContext;

    constructor() {
        this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
    }

    record(): Promise<Float32Array> {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    const chunks: Float32Array[] = [];

                    mediaRecorder.ondataavailable = event => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const buffer = reader.result as ArrayBuffer;
                            const data = new Float32Array(buffer);
                            chunks.push(data);
                        };
                        reader.readAsArrayBuffer(event.data);
                    };

                    mediaRecorder.onstop = () => {
                        const maxLength = Math.max(...chunks.map(chunk => chunk.length));
                        const recorded = new Float32Array(maxLength);

                        chunks.forEach(chunk => {
                            for (let i = 0; i < chunk.length; i++) {
                                recorded[i] += chunk[i];
                            }
                        });

                        resolve(recorded);
                    };

                    mediaRecorder.start();
                    setTimeout(() => mediaRecorder.stop(), 3000);
                })
                .catch(reject);
        });
    }

    stop(): void {
        this.audioContext.close();
    }

    
}

