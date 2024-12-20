# SoniqWave

SoniqWave is a powerful JavaScript library designed to generate and visualize harmonic waves from background noise. This project aims to provide an interactive and educational experience for users interested in sound wave generation and visualization.

## Features

- Generate harmonic waves based on a base frequency and its harmonics.
- Visualize the generated waves on an HTML canvas.
- Play instrument simulations including piano, drum, flute, guitar, and violin.
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
    <link rel="stylesheet" href="main.css">
    <script src="../dist/index.umd.js" defer></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            console.log("SoniqWave library loaded:", SoniqWave);

            const soniqSound = new SoniqWave.SoniqSound();

            document.getElementById('playWave').addEventListener('click', async () => {
                await soniqSound.playHarmonicWave({
                    baseFrequency: 440,
                    harmonics: [1, 2, 3],
                    amplitudes: [1, 0.5, 0.25],
                    canvas: document.getElementById('visualizer')
                });
            });

            document.getElementById('stopWave').addEventListener('click', () => {
                soniqSound.stopAll();
            });
        });
    </script>
</head>
<body>
    <h1>SoniqWave Audio Synthesis</h1>
    <button id="playWave">Play Harmonic Wave</button>
    <button id="stopWave">Stop Audio</button>
    <canvas id="visualizer" width="800" height="400"></canvas>
</body>
</html>
```

## API

### `SoniqSound(seed)`

Creates a new instance of SoniqSound.

- `seed`: A number used to initialize the random number generator.

### `playHarmonicWave(options)`

Plays and visualizes a harmonic wave.

- `options`: An object containing the following properties:
  - `baseFrequency`: The base frequency in Hz.
  - `harmonics`: An array of harmonic multipliers.
  - `amplitudes`: An array of amplitudes corresponding to each harmonic.
  - `canvas`: The HTML canvas element where the wave will be visualized.

### `playInstrument(instrument, frequency, duration)`

Plays a specified instrument.

- `instrument`: A string representing the instrument name (e.g., "piano", "drum").
- `frequency`: The frequency of the sound in Hz.
- `duration`: The duration of the sound in seconds.

### `stopAll()`

Stops all currently playing audio.

## Current Development

- Improving the audio synthesis logic to make instruments sound more realistic.
- Adding advanced wave visualization features.
- Enhancing the API for more flexibility and ease of use.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Contact

For any questions or inquiries, please contact the project maintainer.