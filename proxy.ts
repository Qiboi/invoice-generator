import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;

        // halaman yang ingin di-disable
        const blockedPaths = ["/invoice", "/receipt", "/register"];

        if (blockedPaths.some((path) => pathname.startsWith(path))) {
            // opsi 1: redirect ke dashboard
            return NextResponse.redirect(new URL("/dashboard", req.url));

            // opsi 2: return 404 (lebih clean)
            // return new NextResponse("Not Found", { status: 404 });

            // opsi 3: forbidden
            // return new NextResponse("Forbidden", { status: 403 });
        }
    },
    {
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: ["/", "/dashboard/:path*", "/invoice", "/receipt", "/register"],
};