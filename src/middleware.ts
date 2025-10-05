import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    error: "/auth/error",
    signOut: "/logout"
  },
});

export const config = {
  matcher: ["/dashboard", "/product/upload", "/logout", "/admin"]
};
