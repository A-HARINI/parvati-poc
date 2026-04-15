import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function loginAdmin(req: Request, res: Response) {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ adminId: adminUser }, process.env.JWT_SECRET || 'changeme', {
    expiresIn: '8h',
  });

  res.json({ token });
}
