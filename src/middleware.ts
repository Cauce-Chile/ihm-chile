import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso libre a la página de login
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Para cualquier otra ruta /admin/*, verificar sesión
  const token = await getToken({ req: request });
  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
