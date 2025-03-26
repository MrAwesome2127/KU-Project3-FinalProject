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

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const  data : any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
    console.log(data)
    req.user = data;
  } catch (err) {
    console.log('Invalid token');
  }

  return req;
};

export const signToken = (username: string, email: string, _id:unknown, wife: boolean) => {
  const id = (_id as string).toString();
  const payload = { username, email, id, wife };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '365d' }); //365 day expiration
}