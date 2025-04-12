import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const auth = {
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT as string,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET as string,
    })
  ]

}
export default NextAuth(auth)

