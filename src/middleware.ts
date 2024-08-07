/*
TODO: 这个中间件主要用来管理Clerk对于路由的权限管理
MARK: - Clerk Config
*/


import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(
    /*
    TODO: 在这里可以控制没有登陆之前可以访问的页面
    TODO: 下面有的就是你可以不用登录就能访问的页面
    MARK: - 开放访问控制
    */
    [
        '/sign-in(.*)',
        '/sign-up(.*)',
        '/',
        '/api/webhook'
        // '/dashboard',
        // '/api/clerk-webhook',
        // '/api/drive-activity/nitification'
    ]
);

export default clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) {
        auth().protect();
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};