import bcrypt from "bcrypt";

export class Bcrypt {
  public async encoded(plainText: string): Promise<string> {
    const salt = process.env.BCRYPT_SALT;

    if (!salt) {
      throw new Error("BCRYPT_SALT is required");
    }

    if (isNaN(Number(salt))) {
      throw new Error("BCRYPT_SALT should be a number");
    }

    const hash = await bcrypt.hash(plainText, Number(salt));

    return hash;
  }

  public async verify(hash: string, plainText: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainText, hash);
    return isMatch;
  }
}
