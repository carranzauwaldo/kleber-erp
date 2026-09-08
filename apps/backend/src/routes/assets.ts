import { Router, Request, Response } from 'express'

const router = Router()

// GET /api/assets - Listar activos
router.get('/', (req: Request, res: Response) => {
  res.json({
    data: [],
    total: 0,
    message: 'Assets endpoint - conectar a Supabase',
  })
})

// POST /api/assets - Crear activo
router.post('/', (req: Request, res: Response) => {
  const { name, type, licensePlate } = req.body
  
  if (!name || !type) {
    return res.status(400).json({ error: 'Name and type required' })
  }
  
  res.status(201).json({
    id: 'temp-id',
    name,
    type,
    licensePlate,
    message: 'Asset created - save to Supabase in next step',
  })
})

export default router
