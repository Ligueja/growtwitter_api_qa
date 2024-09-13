import bcrypt from "bcrypt";
import { HttpError } from "../erros/http.error";

export class Bcrypt {
  public async encoded(plainText: string): Promise<string> {
    const salt = process.env.BCRYPT_SALT;

    if (!salt) {
      throw new HttpError("BCRYPT_SALT is required", 500);
    }

    if (isNaN(Number(salt))) {
      throw new HttpError("BCRYPT_SALT should be a number", 500);
    }

    const hash = await bcrypt.hash(plainText, Number(salt));

    return hash;
  }

  public async verify(hash: string, plainText: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainText, hash);
    return isMatch;
  }
}
