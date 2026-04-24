import { NextFunction, Request, Response } from 'express'
import z from 'zod'

const validateRequest =
  (zodSchema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data) || req.body
      req.body = await zodSchema.parseAsync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }

export default validateRequest
