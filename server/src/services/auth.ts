import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import dotenv from 'dotenv'
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
  wife: boolean;
}

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err:any, user:any) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user as JwtPayload;
      return next();
    });
  } else {
    res.sendStatus(401);
  }
};

export const signToken = (username: string, email: string, _id:unknown, wife: boolean) => {
  const id = (_id as string).toString();
  const payload = { username, email, id, wife };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '365d' }); //365 day expiration
}