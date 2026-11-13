import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mockServerPlugin } from './server/server.js'

export default defineConfig({
  plugins: [react(), mockServerPlugin()],
})
