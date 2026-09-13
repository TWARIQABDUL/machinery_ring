import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("pages/publiclayout.tsx", [
        index("pages/homepage.tsx"),
        route("about", "pages/aboutpage.tsx"),
        route("services", "pages/servicespage.tsx"),
        route("our-work", "pages/ourworkpage.tsx"),
        route("gallery", "pages/gallerypage.tsx"),
        route("blog", "pages/blogpage.tsx"),
        route("contact", "pages/contactpage.tsx"),
    ]),

    route("dashboard", "routes/dashboard.tsx", [
        index("routes/dashboard-home.tsx"),
        route("requests", "routes/dashboard-requests.tsx"),
        route("services", "routes/dashboard-services.tsx"),
        route("gallery", "routes/dashboard-gallery.tsx"),
        route("blog", "routes/dashboard-blog.tsx"),
        route("rings", "routes/dashboard-rings.tsx"),
        route("logout", "routes/dashboard-logout.tsx"),
    ]),

    layout("pages/authlayout.tsx", [
        route("login", "pages/loginpage.tsx"),
        route("register", "pages/registerpage.tsx"),
    ]),
] satisfies RouteConfig;
