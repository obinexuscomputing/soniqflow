/**
import { ScaleMapper } from './harmonics/ScaleMapper';
import { FrequencyTransformer } from './harmonics/FrequencyTransformer';
import { AmplitudeController } from './harmonics/AmplitudeController';
import { HarmonicSynthesizer } from './harmonics/HarmonicSynthesizer';

const scaleMapper = new ScaleMapper();
const frequencyTransformer = new FrequencyTransformer();
const amplitudeController = new AmplitudeController();
const harmonicSynthesizer = new HarmonicSynthesizer();

const whiteNoise = new Float32Array([0.2, 0.4, 0.6, 0.8]); // Example input
const scaledData = scaleMapper.mapToScale(whiteNoise, 'major');
const frequencyData = frequencyTransformer.applyFrequencyRange(scaledData, [200, 2000]);
const normalizedData = amplitudeController.normalizeAmplitudes(frequencyData);
const harmonicData = harmonicSynthesizer.synthesizeHarmonics(440, [1, 2, 3], [1, 0.5, 0.25]);

console.log('Harmonic Data:', harmonicData);

 */
export {AmplitudeController} from './AmplitudeController';
export {FrequencyTransformer} from './FrequencyTransformer';
export {HarmonicSynthesizer} from './HarmonicSynthesizer';
export {ScaleMapper} from './ScaleMapper';
