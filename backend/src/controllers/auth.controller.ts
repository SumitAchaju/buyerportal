import Controller from "../decorators/controller.decorator.js";
import { Get } from "../decorators/routes.decorator.js";
import { prisma } from "../lib/prisma.js";

@Controller("/api/v1/custom-auth")
class AuthController {
  @Get("/check-email")
  async checkEmail(req: Req, res: Res) {
    const email = req.query.email as string;
    console.log(email);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.error("Invalid email format", 400);
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });
    if (existing) {
      return res.success({ available: false });
    }
    return res.success({ available: true });
  }
}

export default AuthController;
