import NextAuth from "next-auth";
import { profile } from "@/utils/api";
import GithubProvider from "next-auth/providers/github";
import { authOptions } from "@/utils/Authorize";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };