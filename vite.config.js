// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// export default defineConfig({
//     plugins: [react()],
//     server: {
//         port: 3000,
//         open: true
//     }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import src from "*.aac";


export default defineConfig({
    plugins: [react()],
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(src, './src'),
            '@components': path.resolve(components, './src/components'),
            '@pages': path.resolve(pages, './src/pages'),
            '@contexts': path.resolve(contexts, './src/contexts'),
            '@services': path.resolve(services, './src/services'),
        },
    },
    server: {
        port: 3000,
        open: true,
    }
})