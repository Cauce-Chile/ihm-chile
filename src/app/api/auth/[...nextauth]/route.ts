import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        // Credenciales del administrador
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials?.username === adminUser &&
          credentials?.password === adminPassword
        ) {
          return {
            id: '1',
            name: 'Administrador IHM Chile',
            email: 'cristobal@ihmchile.com',
          };
        }

        // Credenciales incorrectas
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };