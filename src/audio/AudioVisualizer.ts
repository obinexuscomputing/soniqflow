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

    visualizeFrequency(data: Uint8Array, canvas: HTMLCanvasElement): void {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context is not available');
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      const sliceWidth = canvas.width / data.length;
      let x = 0;
  
      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = v * canvas.height / 2;
  
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
  
        x += sliceWidth;
      }
  
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }

    visualizeSpectrogram(data: Uint8Array, canvas: HTMLCanvasElement): void {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context is not available');
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / data.length) * 2.5;
      let barHeight;
      let x = 0;
  
      for (let i = 0; i < data.length; i++) {
        barHeight = data[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    visualizeVolume(data: Uint8Array, canvas: HTMLCanvasElement): void {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context is not available');
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / data.length) * 2.5;
      let barHeight;
      let x = 0;
  
      for (let i = 0; i < data.length; i++) {
        barHeight = data[i] / 2;
        ctx.fillStyle = `rgb(50, ${barHeight + 100}, 50)`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    visualizePanning(data: Uint8Array, canvas: HTMLCanvasElement): void {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context is not available');
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / data.length) * 2.5;
      let barHeight;
      let x = 0;
  
      for (let i = 0; i < data.length; i++) {
        barHeight = data[i] / 2;
        ctx.fillStyle = `rgb(50, 50, ${barHeight + 100})`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    visualize(data: Float32Array, canvas: HTMLCanvasElement): void {
      this.visualizeWaveform(data, canvas);
    }
    
  }
  