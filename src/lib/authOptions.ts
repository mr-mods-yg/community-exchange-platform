import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user }) {
            if (!user.email) {
                console.error("Google did not return email : ", user)
                return false // stop login
            }
            try {
                // Save user manually in DB (example with Prisma)
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                })

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            name: user.name || "user",
                            email: user.email,
                            image: user.image
                        },
                    })
                }
                return true
            } catch (err) {
                console.error("Error saving user:", err)
                return false // reject login if save fails
            }
        },
        async jwt({ token, user }) {
            if (user) {
                // Prisma id is not automatically added, so we fetch it
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                })

                if (dbUser) {
                    token.id = dbUser.id
                    token.name = dbUser.name
                    token.email = dbUser.email
                    token.picture = dbUser.image ?? undefined
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture as string
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/logout"
    }
}