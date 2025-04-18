
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// This route runs on the server
export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.accessCookie) {
    return NextResponse.json(
      { error: "No cookie found in token" },
      { status: 400 }
    );
  }

  // Now we use that cookie string from the token
  const response = NextResponse.json({ message: "Cookie set from token" });

  // Set the cookie manually here using the actual cookie string
  response.headers.set("Set-Cookie", token.accessCookie);
  console.log(response.headers)
  return response;
}
