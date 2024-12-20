# SoniqWave

SoniqWave is a powerful JavaScript library designed to generate and visualize harmonic waves from background noise. This project aims to provide an interactive and educational experience for users interested in sound wave generation and visualization.

## Features

- Generate harmonic waves based on a base frequency and its harmonics.
- Visualize the generated waves on an HTML canvas.
- Interactive demo to play and visualize harmonic music.

## Installation

To use SoniqWave in your project, include the library in your HTML file:

```html
<script src="../dist/index.umd.js" defer></script>
```

## Usage

Here's a basic example of how to use SoniqWave to generate and visualize harmonic waves:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SoniqWave Demo</title>
    <script src="../dist/index.umd.js" defer></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            console.log("SoniqWave library loaded:", SoniqWave);

            const initializeSoniqWave = async () => {
                try {
                    // Initialize SoniqWave with a seed
                    const seed = Math.floor(Math.random() * 1000);
                    const soniqWave = new SoniqWave.SoniqSound(seed);

                    // Get canvas element for visualization
                    const canvas = document.getElementById("visualization");
                    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
                        throw new Error("Canvas element not found or invalid.");
                    }

                    // Setup parameters
                    const baseFrequency = 440; // A4 in Hz
                    const harmonics = [1, 2, 3, 4, 5]; // Multiples of the base frequency
                    const amplitudes = [1.5, 1.2, 1.0, 1.8, 1.6]; // Increased amplitudes for louder sound

                    // Generate harmonic wave from background noise
                    await soniqWave.generateHarmonicWave({
                        baseFrequency,
                        harmonics,
                        amplitudes,
                        canvas, // Pass canvas to generateHarmonicWave
                    });

                    // Create an audio context
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(baseFrequency, audioContext.currentTime); // Set frequency to baseFrequency

                    // Connect oscillator to the audio context's destination (speakers)
                    oscillator.connect(audioContext.destination);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 2); // Play sound for 2 seconds

                } catch (error) {
                    console.error("Error initializing SoniqWave:", error);
                }
            };

            initializeSoniqWave();
        });
    </script>
</head>
<body>
    <canvas id="visualization" width="800" height="600"></canvas>
</body>
</html>
```

## API

### `SoniqSound(seed)`

Creates a new instance of SoniqSound.

- `seed`: A number used to initialize the random number generator.

### `generateHarmonicWave(options)`

Generates and visualizes a harmonic wave.

- `options`: An object containing the following properties:
  - `baseFrequency`: The base frequency in Hz.
  - `harmonics`: An array of harmonic multipliers.
  - `amplitudes`: An array of amplitudes corresponding to each harmonic.
  - `canvas`: The HTML canvas element where the wave will be visualized.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Contact

For any questions or inquiries, please contact the project maintainer.
