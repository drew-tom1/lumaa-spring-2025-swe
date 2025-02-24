import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).send('Access denied');
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            (req as any).user = decoded;
            next();
        } catch (err) {
            res.status(400).send('Invalid token');
        }
    }
};

export default authenticate;