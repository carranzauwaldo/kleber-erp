import { Router, Request, Response } from 'express'

const router = Router()

// GET /api/trips - Listar viajes
router.get('/', (req: Request, res: Response) => {
  res.json({
    data: [],
    total: 0,
    message: 'Trips endpoint - conectar a Supabase',
  })
})

// POST /api/trips - Crear viaje
router.post('/', (req: Request, res: Response) => {
  const { origin, destination, freightValue } = req.body
  
  if (!origin || !destination || !freightValue) {
    return res.status(400).json({ 
      error: 'Origin, destination, and freightValue required' 
    })
  }
  
  res.status(201).json({
    id: 'temp-id',
    origin,
    destination,
    freightValue,
    status: 'draft',
    message: 'Trip created - save to Supabase in next step',
  })
})

export default router
