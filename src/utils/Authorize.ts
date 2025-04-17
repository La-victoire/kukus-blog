import { Oauth } from "@/utils/api";
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
        try {
          const data = await Oauth("/Oauth",{
             name: user?.name,
             email: user?.email,
             profile_img: user?.image,
             id: user?.id || user?.sub
           });

           const setCookie = data?.headers["set-cookie"]?.map((cookie)=> cookie).join('');
           console.log(setCookie)
           token.name = user?.name
           token.email = user?.email;
           token.picture = user?.image;
           token.id = data?.data?.data?.user?._id;
           token.accessCookie = setCookie ;
           

   
        } catch (error) {
          console.log(error)
        }

      }
      return token;
    },
    async session({session, token}) {

      session.user.id = token.id; 
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
      session.accessCookie = token.accessCookie;
      

      return session;
    },
  }
}