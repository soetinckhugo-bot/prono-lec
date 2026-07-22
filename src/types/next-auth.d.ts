import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    rememberMe?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      rememberMe?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    rememberMe?: boolean;
  }
}
