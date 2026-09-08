// Types compartidos entre frontend y backend
// Se actualizarán conforme el proyecto crezca

export interface HealthResponse {
  status: 'ok' | 'error'
  timestamp: string
  environment?: string
}

// Agregar más tipos según sea necesario
