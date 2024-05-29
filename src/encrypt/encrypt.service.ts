import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  hashGenerate(password: string) {
    return bcrypt.hash(password, 10);
  }

  hashCompare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
