import "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    roomId: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      roomId: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    roomId: string;
  }
}
