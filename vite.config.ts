import { execSync } from 'child_process';

/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';
import fs from 'node:fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    // Make sure release is set client-side, automatic release tagging did not work
    process.env.VITE_SENTRY_RELEASE = execSync('git rev-parse HEAD').toString().trim();

    const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
    console.log('DistPath', pdfjsDistPath);
    const pdfWorkerPath = path.join(pdfjsDistPath, 'build', 'pdf.worker.mjs');
    console.log('workerPath', pdfWorkerPath);
    fs.copyFileSync(pdfWorkerPath, './public/pdf.worker.js');

    return {
        build: {
            manifest: 'asset-manifest.json',
            outDir: 'build',
            sourcemap: true,
        },
        plugins: [
            react(),
            svgr(),
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        VITE_DEKORATOREN_URL: env.VITE_DEKORATOREN_URL,
                    },
                },
            }),
            visualizer({
                filename: 'bundle-stats.html',
            }),
        ],
        server: {
            port: 3000,
        },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/setupTests.jsx'],
        },
    };
});
