import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 3000,
  //   host: true, // Listen on all addresses
  //   strictPort: true, // Throw error if port 3000 is not available
  //   hmr: {
  //     clientPort: 3000, // Explicitly set HMR client port
  //   }
  // },
  define: {
    // Ensure WebSocket URL is properly constructed
    'process.env.VITE_DEV_SERVER_HOST': JSON.stringify('localhost'),
    'process.env.VITE_DEV_SERVER_PORT': '3000'
  }
})
