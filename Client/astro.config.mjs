// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

import tailwindcss from '@tailwindcss/vite';

// import { createRequire } from 'module';
//
// const require = createRequire(import.meta.url);

// https://astro.build/config
export default defineConfig({
    integrations: [
        preact({
            compat: true, // This enables Preact's compatibility layer
        }),
    ],

    vite: {
        plugins: [tailwindcss()],
        server: {
            watch: {
                usePolling: true,
            },

        },
        // resolve: {
        //     alias: [
        //         {
        //             find: 'preact/hooks',
        //             replacement: require.resolve('preact/hooks')
        //         }
        //     ]
        // }
    }
});
