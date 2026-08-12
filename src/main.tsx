import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App.tsx'
import './index.css'

// Verificar configuración de Google Maps en desarrollo
if (import.meta.env.DEV) {
  import('./lib/verifyGoogleMapsConfig.ts')
}

export const createRoot = ViteReactSSG({ routes })
