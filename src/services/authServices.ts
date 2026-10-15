import { verifyGoogleIdToken } from "../lib/google";
import { prisma } from "../lib/prisma";
import { encrypt } from "../utils/encryption";

export class AuthService {
  public async getOrCreateUser(googleAccessToken: string, username: string) {
    if (!googleAccessToken) {
      return;
    }
    const userData = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
      },
    });
    if (userData) {
      return {
        success: false,
        message: "username is taken",
      };
    }
    const { subjectId, name, email, profile } =
      await verifyGoogleIdToken(googleAccessToken);
    const encryptedSubjectId = encrypt(subjectId);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          email: email,
          googleSubjectId: encryptedSubjectId,
          username: username,
          name: name,
          profileUrl: profile,
        },
      });
      const { googleSubjectId, ...userDetails } = newUser;
      return { success: true, data: userDetails };
    }
    const { googleSubjectId, ...userDetails } = user;
    return { success: true, data: userDetails };
  }

  public async updateUsername(username: string, userId: string) {
    const userDetails = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
      },
    });
    if (userDetails) {
      return {
        success: false,
        message: "username is taken",
      };
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: username,
      },
    });
    return {
      success: true,
      message: "username updated",
    };
  }
}
