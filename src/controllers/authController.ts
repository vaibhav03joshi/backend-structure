import { Request, Response } from "express";
import { AuthService } from "../services/authServices";

export class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idToken, username } = req.body;

      if (!idToken || !username) {
        res.status(400).json({
          success: false,
          message: "Access token and username required",
        });
        return;
      }
      const user = await this.authService.getOrCreateUser(idToken, username);
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Wrong Access token",
        });
        return;
      }
      if (!user.success) {
        res.status(400).json({
          success: false,
          message: user.message,
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "user details",
        data: user,
      });
      return;
    } catch (error) {
      console.log("login error: ", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  public changeUsername = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const username = req.body.username;

      if (!username) {
        res.status(400).json({
          success: false,
          message: "username required",
        });
        return;
      }
      if (!req.user || !req.user.id) {
        res.status(404).json({
          success: false,
          message: "user not found",
        });
        return;
      }
      const result = await this.authService.updateUsername(
        username,
        req.user.id,
      );
      res.status(result.success ? 200 : 400).json({
        success: result.success,
        message: result.message,
      });
      return;
    } catch (error) {
      console.log("login error: ", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
