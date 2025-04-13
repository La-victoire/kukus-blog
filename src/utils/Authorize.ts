import { profile } from "@/utils/api";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy : "jwt",
    maxAge : 30 * 24 * 60 * 60, //30 Days 
  },
  callbacks: {
    async jwt({ token, account, user}) {
      if (account && user) {
       const data = profile("/Oauth",{
          name: user?.name,
          email: user?.email,
          profile_img: user?.image,
          id: user?.id || user?.sub
        })

        token.id = data?._id
        token.name = user?.name
        token.email = user?.email;
        token.picture = user?.image;
      }
      return token;
    },
    async session({session, token}) {

      session.user.id = token.id; 
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;

      return session;
    },
  }
}