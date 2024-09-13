import jwt from "jsonwebtoken";
import { UserLoggedDTO } from "../dtos/user-logged.dto";
import { HttpError } from "../erros/http.error";

export class JWT {
  public generateToke(data: UserLoggedDTO): string {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new HttpError("JWT_SECRET env is required", 500);
    }

    const token = jwt.sign(data, secretKey, { expiresIn: "1h" });

    return token;
  }

  public decodedToken(token: string): UserLoggedDTO | null {
    try {
      const data = jwt.decode(token) as any;

      return data;
    } catch (error) {
      return null;
    }
  }
}
