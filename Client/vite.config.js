// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from "path";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server : {
//     // proxy : {
//     //   '/employee': {
//     //     target: 'https://emp-flow-etm-u6a2.vercel.app',
//     //     changeOrigin: true,
//     //     secure: false,
//     //   },
//     //   '/task': {
//     //     target: 'https://emp-flow-etm-u6a2.vercel.app',
//     //     changeOrigin: true,
//     //     secure: false,
//     //   }
//     // },
//     historyApiFallback: true,
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     sourcemap: false, // Disable sourcemaps in production
//   },
// })



import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Ensure this is set to allow connections from outside the container
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
  }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0', // Ensure this is set to allow connections from outside the container
//     port: 5173,
//   }

// })



