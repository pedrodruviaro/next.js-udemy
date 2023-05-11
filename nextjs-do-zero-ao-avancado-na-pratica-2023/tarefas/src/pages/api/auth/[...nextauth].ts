import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// https://console.cloud.google.com/apis/credentials?pli=1&project=storybooks-329717
// Criar credenciais (oAuth)

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secred: process.env.JWT_SECRET as string,
};

export default NextAuth(authOptions);
