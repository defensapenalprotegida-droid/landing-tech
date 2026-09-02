import type { RouteRecord } from "vite-react-ssg";
import { getAllPosts } from "@/lib/blog";
import { getProductosPublicados } from "@/lib/productosJuridicos";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";
import Cookies from "./pages/Cookies";
import Servicio from "./pages/Servicio";
import Documentos from "./pages/Documentos";
import Documento from "./pages/Documento";
import { getDocumentos } from "@/lib/documentos";
import NotFound from "./pages/NotFound";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Index />, entry: "src/pages/Index.tsx" },
      { path: "blog", element: <Blog />, entry: "src/pages/Blog.tsx" },
      {
        path: "blog/:slug",
        element: <BlogPost />,
        entry: "src/pages/BlogPost.tsx",
        getStaticPaths: () => getAllPosts().map((p) => `/blog/${p.slug}`),
      },
      { path: "privacidad", element: <Privacidad /> },
      { path: "terminos", element: <Terminos /> },
      { path: "cookies", element: <Cookies /> },
      {
        path: "servicios/:slug",
        element: <Servicio />,
        entry: "src/pages/Servicio.tsx",
        getStaticPaths: () =>
          getProductosPublicados().map((p) => `/servicios/${p.seo!.slug}`),
      },
      { path: "documentos", element: <Documentos />, entry: "src/pages/Documentos.tsx" },
      {
        path: "documentos/:slug",
        element: <Documento />,
        entry: "src/pages/Documento.tsx",
        getStaticPaths: () => getDocumentos().map((d) => `/documentos/${d.slug}`),
      },
      // ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
      { path: "*", element: <NotFound /> },
    ],
  },
];
