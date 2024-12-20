export class AudioVisualizer {
    visualizeWaveform(data: Float32Array, canvas: HTMLCanvasElement): void {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context is not available');
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      const step = Math.ceil(data.length / canvas.width);
  
      for (let i = 0; i < canvas.width; i++) {
        const value = data[i * step] * (canvas.height / 2);
        const x = i;
        const y = canvas.height / 2 - value;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
  
      ctx.stroke();
    }
  }
  