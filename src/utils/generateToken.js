import crypto from 'crypto';

export default function generateToken(len = 48) {
  return crypto.randomBytes(len).toString('hex');
}
