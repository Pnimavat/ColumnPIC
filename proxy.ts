import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/onboarding')
  const isDashboardRoute =
    pathname === '/' ||
    pathname.startsWith('/household') ||
    pathname.startsWith('/income') ||
    pathname.startsWith('/expenses') ||
    pathname.startsWith('/investments') ||
    pathname.startsWith('/accounts') ||
    pathname.startsWith('/overseas') ||
    pathname.startsWith('/projections') ||
    pathname.startsWith('/tax') ||
    pathname.startsWith('/actions') ||
    pathname.startsWith('/members') ||
    pathname.startsWith('/settings')

  const isDemoMode = request.cookies.get('demo_mode')?.value === '1'

  if (!user && isDashboardRoute && !isDemoMode) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && !isDemoMode && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Suppress unused variable warning — isAuthRoute used in comment below
  void isAuthRoute

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
