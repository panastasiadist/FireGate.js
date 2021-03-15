import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [{
        file: 'dist/firegate.js',
        format: 'iife',
        sourcemap: true,
        name: 'FireGate'
    }, {
        file: 'dist/firegate.min.js',
        format: 'iife',
        sourcemap: true,
        name: 'FireGate',
        plugins: [terser()]
    }],
    plugins: [
        typescript(),
    ],
};
