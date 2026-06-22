import { Router } from 'express'
import * as controller from '../controllers/pontos.controller.js'

const router = Router()

router.get('/pontos', (req, res) => {
  const result = controller.listPontos({
    busca: req.query.busca as string | undefined,
    tipo: req.query.tipo as string | undefined,
    incluirInativos: req.query.incluirInativos as string | undefined,
  })
  res.status(result.status).json(result.body)
})

router.get('/pontos/:id', (req, res) => {
  const result = controller.getPontoById(req.params.id)
  res.status(result.status).json(result.body)
})

router.post('/pontos', (req, res) => {
  const result = controller.createPonto(req.body)
  res.status(result.status).json(result.body)
})

router.put('/pontos/:id', (req, res) => {
  const result = controller.updatePonto(req.params.id, req.body)
  res.status(result.status).json(result.body)
})

router.delete('/pontos/:id', (req, res) => {
  const result = controller.deletePonto(req.params.id)
  if (result.body === null) {
    res.status(result.status).end()
  } else {
    res.status(result.status).json(result.body)
  }
})

router.get('/resumo', (_req, res) => {
  const result = controller.getResumo()
  res.status(200).json(result)
})

export { router }
