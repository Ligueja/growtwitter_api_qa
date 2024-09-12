import { NextFunction, Request, Response } from 'express';
import { validate } from 'uuid';

export class ValidUuidParamsMiddleware {
    public static validate(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if(!validate(id)) {
            return res.status(400).json({
                ok: false,
                message: "UUID inválido"
            })
        }

        return next()
    }
}