import * as React from "react";
import React__default, { forwardRef, useCallback, createContext, useContext, useState, useRef, useEffect } from "react";
import { createRoot as createRoot$1, hydrateRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useLinkClickHandler, Link as Link$1, NavLink as NavLink$1, matchRoutes, createBrowserRouter, RouterProvider, Outlet, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, ChevronDown, Phone, Menu, MessageCircle, ChevronLeft, ChevronRight, Circle, ChevronUp, Check, MapPin, Search, AlertCircle, Mail, Loader2, Send, Home, ShieldCheck, Scale, Landmark, LockKeyhole, AlertTriangle, Briefcase, Heart, Building2, ReceiptText, Plus, Linkedin, Quote, Star, FileText, CalendarDays, ArrowRight, Clock, Instagram, Facebook, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { z } from "zod";
import { faHouseUser, faKey, faBriefcase, faChartColumn, faDollarSign, faHeartBroken, faExclamationTriangle, faScaleBalanced, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
function documentReady(_passThrough) {
  if (document.readyState === "loading") {
    return new Promise((resolve) => {
      document.addEventListener("DOMContentLoaded", () => resolve(_passThrough));
    });
  }
  return Promise.resolve(_passThrough);
}
function Head(props) {
  return /* @__PURE__ */ React__default.createElement(Helmet, { ...props });
}
function deserializeState(state) {
  try {
    return JSON.parse(state || "{}");
  } catch (error) {
    console.error("[SSG] On state deserialization -", error, state);
    return {};
  }
}
function joinUrlSegments(a, b) {
  if (!a || !b)
    return a || b || "";
  if (a[a.length - 1] === "/")
    a = a.substring(0, a.length - 1);
  if (b[0] !== "/")
    b = `/${b}`;
  return a + b;
}
function stripBase(path, base) {
  if (path === base)
    return "/";
  const devBase = withTrailingSlash(base);
  return path.startsWith(devBase) ? path.slice(devBase.length - 1) : path;
}
function withTrailingSlash(path) {
  if (path[path.length - 1] !== "/")
    return `${path}/`;
  return path;
}
function withLeadingSlash(path) {
  if (path[0] !== "/")
    return `/${path}`;
  return path;
}
function convertRoutesToDataRoutes(routes2, mapRouteProperties, parentPath = []) {
  return routes2.map((route, index) => {
    const treePath = [...parentPath, String(index)];
    const id = typeof route.id === "string" ? route.id : treePath.join("-");
    route.id = id;
    if (isIndexRoute(route)) {
      const indexRoute = {
        ...route,
        ...mapRouteProperties(route),
        id
      };
      return indexRoute;
    } else {
      const pathOrLayoutRoute = {
        ...route,
        ...mapRouteProperties(route),
        id,
        children: void 0
      };
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(
          route.children,
          mapRouteProperties,
          treePath
          // manifest,
        );
      }
      return pathOrLayoutRoute;
    }
  });
}
function isIndexRoute(route) {
  return route.index === true;
}
const Link = forwardRef((props, ref) => {
  const {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    to,
    onClick
  } = props;
  const internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative
  });
  function handleClick(event) {
    if (onClick)
      onClick(event);
    if (!event.defaultPrevented) {
      React__default.startTransition(() => {
        internalOnClick(event);
      });
    }
    event.defaultPrevented = true;
    event.preventDefault();
  }
  return /* @__PURE__ */ React__default.createElement(Link$1, { ...props, ref, onClick: handleClick });
});
Link.displayName = "Link";
const NavLink = forwardRef((props, ref) => {
  const {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    to,
    onClick
  } = props;
  const internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative
  });
  function handleClick(event) {
    if (onClick)
      onClick(event);
    if (!event.defaultPrevented) {
      React__default.startTransition(() => {
        internalOnClick(event);
      });
    }
    event.defaultPrevented = true;
    event.preventDefault();
  }
  return /* @__PURE__ */ React__default.createElement(NavLink$1, { ...props, ref, onClick: handleClick });
});
NavLink.displayName = "NavLink";
function ViteReactSSG(routerOptions, fn, options = {}) {
  const {
    transformState,
    rootContainer = "#root",
    ssrWhenDev,
    getStyleCollector = null
  } = options;
  if (process.env.NODE_ENV === "development" && ssrWhenDev !== void 0)
    console.warn("[vite-react-ssg] `ssrWhenDev` option is no longer needed. If you want to use csr, just replace `vite-react-ssg dev` with `vite`.");
  const isClient = typeof window !== "undefined";
  const BASE_URL = routerOptions.basename ?? "/";
  async function createRoot$1$1(client = false, routePath) {
    const browserRouter = client ? createBrowserRouter(convertRoutesToDataRoutes(routerOptions.routes, transformStaticLoaderRoute), { basename: BASE_URL }) : void 0;
    const appRenderCallbacks = [];
    const onSSRAppRendered = client ? () => {
    } : (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      isClient,
      routes: routerOptions.routes,
      router: browserRouter,
      routerOptions,
      onSSRAppRendered,
      triggerOnSSRAppRendered,
      initialState: {},
      transformState,
      routePath,
      base: BASE_URL,
      getStyleCollector
    };
    if (client) {
      await documentReady();
      context.initialState = (transformState == null ? void 0 : transformState(window.__INITIAL_STATE__ || {})) || deserializeState(window.__INITIAL_STATE__);
    }
    await (fn == null ? void 0 : fn(context));
    const initialState = context.initialState;
    return {
      ...context,
      initialState
    };
  }
  if (isClient) {
    (async () => {
      var _a;
      const container = typeof rootContainer === "string" ? document.querySelector(rootContainer) : rootContainer;
      if (!container) {
        if (typeof $jsdom === "undefined")
          console.warn("[vite-react-ssg] Root container not found.");
        return;
      }
      const lazeMatches = (_a = matchRoutes(routerOptions.routes, window.location, BASE_URL)) == null ? void 0 : _a.filter(
        (m) => m.route.lazy
      );
      if (lazeMatches && (lazeMatches == null ? void 0 : lazeMatches.length) > 0) {
        await Promise.all(
          lazeMatches.map(async (m) => {
            const routeModule = await m.route.lazy();
            Object.assign(m.route, { ...routeModule, lazy: void 0 });
          })
        );
      }
      const { router } = await createRoot$1$1(true);
      const app = /* @__PURE__ */ React__default.createElement(HelmetProvider, null, /* @__PURE__ */ React__default.createElement(RouterProvider, { router }));
      const isSSR = document.querySelector("[data-server-rendered=true]") !== null;
      if (!isSSR && process.env.NODE_ENV === "development") {
        const root = createRoot$1(container);
        React__default.startTransition(() => {
          root.render(app);
        });
      } else {
        React__default.startTransition(() => {
          hydrateRoot(container, app);
        });
      }
    })();
  }
  return createRoot$1$1;
  function transformStaticLoaderRoute(route) {
    const loader = async ({ request }) => {
      var _a;
      {
        let staticLoadData;
        if (window.__VITE_REACT_SSG_STATIC_LOADER_DATA__) {
          staticLoadData = window.__VITE_REACT_SSG_STATIC_LOADER_DATA__;
        } else {
          const manifestUrl = joinUrlSegments(BASE_URL, `static-loader-data-manifest-${window.__VITE_REACT_SSG_HASH__}.json`);
          staticLoadData = await (await fetch(withLeadingSlash(manifestUrl))).json();
          window.__VITE_REACT_SSG_STATIC_LOADER_DATA__ = staticLoadData;
        }
        const { url } = request;
        let { pathname } = new URL(url);
        if (BASE_URL !== "/") {
          pathname = stripBase(pathname, BASE_URL);
        }
        const routeData = (_a = staticLoadData == null ? void 0 : staticLoadData[pathname]) == null ? void 0 : _a[route.id];
        return routeData ?? null;
      }
    };
    route.loader = loader;
    return route;
  }
}
const __vite_glob_0_0 = '---\ntitle: "¿Qué hacer si te citan a declarar por la Fiscalía?"\nslug: "citado-a-declarar"\ndate: "2026-07-10"\ncategory: "Derecho Penal"\nexcerpt: "Los primeros pasos si recibes una citación del Ministerio Público y por qué es clave contar con defensa desde el inicio."\ndescription: "Guía práctica sobre qué hacer si te citan a declarar por Fiscalía en Chile: tus derechos, plazos y por qué necesitas un abogado penalista desde el primer momento."\nauthor: "Arteaga & Aldunate"\n---\n\nRecibir una citación de la Fiscalía genera angustia. Lo primero: **no estás obligado a declarar sin un abogado**. Este artículo explica tus derechos y los pasos a seguir.\n\n## Tienes derecho a guardar silencio\n\nNadie está obligado a declarar contra sí mismo. Puedes ejercer tu derecho a guardar silencio hasta contar con defensa.\n\n## Antes de la audiencia\n\n- Contacta a un abogado penalista apenas recibas la citación.\n- Reúne todos los documentos relacionados.\n- No borres ni alteres información: puede agravar tu situación.\n\n## Por qué la defensa temprana es decisiva\n\nLa primera declaración puede condicionar todo el proceso. Un abogado prepara tu versión, evita autoincriminación y define la estrategia.\n\n¿Te citaron a declarar? [Cuéntanos tu caso](/#contacto) y te orientamos de inmediato.\n';
const __vite_glob_0_1 = '---\ntitle: "Despido injustificado: derechos del trabajador en Chile"\nslug: "despido-injustificado"\ndate: "2026-06-22"\ncategory: "Derecho Laboral"\nexcerpt: "Cuándo un despido es injustificado, qué indemnizaciones puedes reclamar y qué plazos existen para demandar."\ndescription: "Todo sobre el despido injustificado en Chile: causales, indemnizaciones, recargos y el plazo de 60 días hábiles para demandar ante el Juzgado del Trabajo."\nauthor: "Arteaga & Aldunate"\n---\n\nSi te despidieron y crees que no correspondía, la ley te protege. Conoce tus derechos antes de que venzan los plazos.\n\n## ¿Cuándo es injustificado?\n\nCuando el empleador invoca una causal que no puede probar, o no cumple las formalidades del aviso de término.\n\n## Indemnizaciones y recargos\n\n- Indemnización por años de servicio.\n- Indemnización sustitutiva del aviso previo.\n- Recargos legales según la causal invocada.\n\n## Plazo clave\n\nTienes **60 días hábiles** desde la separación para demandar (se suspende si reclamas en la Inspección del Trabajo).\n\n¿Crees que tu despido fue injustificado? [Evaluamos tu caso](/#contacto) sin costo inicial.\n';
const __vite_glob_0_2 = '---\ntitle: "Pensión de alimentos: cómo solicitar aumento, rebaja o cese"\nslug: "pension-de-alimentos"\ndate: "2026-05-30"\ncategory: "Derecho de Familia"\nexcerpt: "Cuándo procede modificar una pensión de alimentos y qué antecedentes son relevantes ante el tribunal."\ndescription: "Guía clara sobre la pensión de alimentos en Chile: cómo pedir aumento, rebaja o cese, qué pruebas importan y cómo se calcula ante el Juzgado de Familia."\nauthor: "Arteaga & Aldunate"\n---\n\nLa pensión de alimentos puede modificarse cuando cambian las circunstancias. Te explicamos cuándo y cómo.\n\n## Aumento\n\nProcede si aumentan las necesidades del alimentario o mejora la capacidad económica del alimentante.\n\n## Rebaja\n\nProcede si disminuyen los ingresos del alimentante o cambian las necesidades del hijo.\n\n## Cese\n\nTermina, por ejemplo, cuando el hijo cumple la mayoría de edad y deja de estudiar, según los supuestos legales.\n\n¿Necesitas revisar tu pensión? [Conversemos tu caso](/#contacto) con la reserva que merece.\n';
const files = /* @__PURE__ */ Object.assign({
  "/src/content/blog/citado-a-declarar.md": __vite_glob_0_0,
  "/src/content/blog/despido-injustificado.md": __vite_glob_0_1,
  "/src/content/blog/pension-de-alimentos.md": __vite_glob_0_2
});
function matter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, content: raw };
  const data = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = val;
  }
  return { data, content: m[2] };
}
function parse(path, raw) {
  const { data, content } = matter(raw);
  const fallbackSlug = path.split("/").pop().replace(/\.md$/, "");
  return {
    slug: data.slug || fallbackSlug,
    title: data.title,
    date: data.date,
    category: data.category,
    excerpt: data.excerpt,
    description: data.description || data.excerpt,
    author: data.author,
    content: content.trim()
  };
}
const posts = Object.entries(files).map(([path, raw]) => parse(path, raw)).sort((a, b) => a.date < b.date ? 1 : -1);
function getAllPosts() {
  return posts;
}
function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}
function formatPostDate(iso) {
  return (/* @__PURE__ */ new Date(`${iso}T00:00:00`)).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster$1() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const queryClient = new QueryClient();
const Layout = () => /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
  /* @__PURE__ */ jsx(Toaster$1, {}),
  /* @__PURE__ */ jsx(Toaster, {}),
  /* @__PURE__ */ jsx(Outlet, {})
] }) });
function useSectionNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback(
    (id) => {
      var _a;
      if (pathname === "/") {
        (_a = document.getElementById(id)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/#${id}`);
      }
    },
    [navigate, pathname]
  );
}
const EVENT$1 = "practice-area:focus";
let pendiente = null;
function focusArea(area) {
  pendiente = area;
  window.dispatchEvent(new CustomEvent(EVENT$1, { detail: area }));
}
function consumePendingArea() {
  const area = pendiente;
  pendiente = null;
  return area;
}
function onFocusArea(cb) {
  const handler = (e) => {
    pendiente = null;
    cb(e.detail);
  };
  window.addEventListener(EVENT$1, handler);
  return () => window.removeEventListener(EVENT$1, handler);
}
const HeroCarouselContext = createContext(void 0);
const useHeroCarousel = () => {
  const context = useContext(HeroCarouselContext);
  if (!context) {
    throw new Error("useHeroCarousel must be used within HeroCarouselProvider");
  }
  return context;
};
const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Root,
  {
    ref,
    className: cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(NavigationMenuViewport, {})
    ]
  }
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.List,
  {
    ref,
    className: cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    ),
    ...props
  }
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);
const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Trigger,
  {
    ref,
    className: cn(navigationMenuTriggerStyle(), "group", className),
    ...props,
    children: [
      children,
      " ",
      /* @__PURE__ */ jsx(
        ChevronDown,
        {
          className: "relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        }
      )
    ]
  }
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Content,
  {
    ref,
    className: cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    ),
    ...props
  }
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: cn("absolute left-0 top-full z-50 flex justify-center"), children: /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Viewport,
  {
    className: cn(
      "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
      className
    ),
    ref,
    ...props
  }
) }));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;
const NavigationMenuIndicator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Indicator,
  {
    ref,
    className: cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" })
  }
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;
const AREAS = [
  "penal",
  "civil",
  "laboral",
  "familia",
  "corporativo",
  "inmobiliario",
  "tributario"
];
const AREA_LABELS = {
  penal: "Derecho Penal",
  civil: "Derecho Civil",
  laboral: "Derecho Laboral",
  familia: "Derecho de Familia",
  corporativo: "Derecho Corporativo",
  inmobiliario: "Derecho Inmobiliario",
  tributario: "Derecho Tributario"
};
const URGENCIAS = ["inmediata", "semana", "sin_apuro"];
const URGENCIA_LABELS = {
  inmediata: "Inmediata (detenido / citado)",
  semana: "Esta semana",
  sin_apuro: "Sin apuro"
};
const HORARIOS = ["manana", "tarde", "cualquiera"];
const HORARIO_LABELS = {
  manana: "Mañana",
  tarde: "Tarde",
  cualquiera: "Cualquiera"
};
const MONTO_RANGOS = ["lt1", "1a10", "10a50", "gt50", "na"];
const MONTO_LABELS = {
  lt1: "Menos de $1.000.000",
  "1a10": "$1.000.000 – $10.000.000",
  "10a50": "$10.000.000 – $50.000.000",
  gt50: "Más de $50.000.000",
  na: "No aplica / no lo sé"
};
const PENAL_SITUACIONES = [
  { value: "detenido", label: "Detenido" },
  { value: "citado", label: "Citado a declarar" },
  { value: "formalizado", label: "Formalizado" },
  { value: "victima", label: "Soy víctima / quiero querellarme" },
  { value: "preventiva", label: "Consulta preventiva" }
];
const PENAL_SITUACION_VALUES = PENAL_SITUACIONES.map((s) => s.value);
const FAMILIA_MATERIAS = [
  { value: "divorcio", label: "Divorcio" },
  { value: "alimentos", label: "Pensión de alimentos" },
  { value: "cuidado", label: "Cuidado personal / visitas" },
  { value: "vif", label: "Violencia intrafamiliar" },
  { value: "otro", label: "Otro" }
];
const FAMILIA_MATERIA_VALUES = FAMILIA_MATERIAS.map((s) => s.value);
const LABORAL_PARTE = [
  { value: "trabajador", label: "Trabajador" },
  { value: "empresa", label: "Empresa / empleador" }
];
const LABORAL_PARTE_VALUES = LABORAL_PARTE.map((s) => s.value);
const LABORAL_SITUACIONES = [
  { value: "despido", label: "Despido injustificado" },
  { value: "autodespido", label: "Autodespido" },
  { value: "tutela", label: "Tutela de derechos" },
  { value: "prestaciones", label: "Cobro de prestaciones" },
  { value: "otro", label: "Otro" }
];
const LABORAL_SITUACION_VALUES = LABORAL_SITUACIONES.map((s) => s.value);
const MONTO_AREAS = ["civil", "corporativo", "inmobiliario", "tributario"];
const montoAplica = (a) => MONTO_AREAS.includes(a) || a === "penal";
const situacionPenalAplica = (a) => a === "penal";
const materiaFamiliaAplica = (a) => a === "familia";
const laboralAplica = (a) => a === "laboral";
const leadSchema = z.object({
  name: z.string().trim().min(3, "Ingresa tu nombre completo"),
  phone: z.string().trim().min(8, "Ingresa un teléfono válido"),
  email: z.string().trim().email("Ingresa un correo válido"),
  area: z.enum(AREAS, { required_error: "Selecciona un área" }),
  urgencia: z.enum(URGENCIAS, { required_error: "Selecciona la urgencia" }),
  horario: z.enum(HORARIOS).default("cualquiera"),
  message: z.string().trim().min(15, "Cuéntanos brevemente tu caso (mín. 15 caracteres)"),
  // condicionales
  situacionPenal: z.enum(PENAL_SITUACION_VALUES).optional(),
  monto: z.enum(MONTO_RANGOS).optional(),
  materiaFamilia: z.enum(FAMILIA_MATERIA_VALUES).optional(),
  laboralParte: z.enum(LABORAL_PARTE_VALUES).optional(),
  laboralSituacion: z.enum(LABORAL_SITUACION_VALUES).optional(),
  // honeypot anti-spam (debe ir vacío)
  website: z.string().max(0).optional().default("")
}).superRefine((data, ctx) => {
  if (situacionPenalAplica(data.area) && !data.situacionPenal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["situacionPenal"],
      message: "Selecciona tu situación actual"
    });
  }
  if (materiaFamiliaAplica(data.area) && !data.materiaFamilia) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["materiaFamilia"],
      message: "Selecciona la materia"
    });
  }
  if (laboralAplica(data.area)) {
    if (!data.laboralParte)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["laboralParte"],
        message: "Indica si eres trabajador o empresa"
      });
    if (!data.laboralSituacion)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["laboralSituacion"],
        message: "Selecciona la situación"
      });
  }
});
const heroRecuperaCasa = "/assets/hero-recupera-casa-DWlEBAtN.jpg";
const heroRecuperaPie = "/assets/hero-recupera-pie-CFS28ia-.jpg";
const heroDefiendeDeспido = "/assets/hero-defiende-despido-C6wlgbIC.jpg";
const heroCotizacionesImpagas = "/assets/hero-cotizaciones-impagas-sFhYyXql.jpg";
const heroCobraPension = "/assets/hero-cobra-pension-CQmSyQWR.jpg";
const heroDivorcioExpress = "/assets/hero-divorcio-express-9QQgJo8_.jpg";
const heroAutodespido = "/assets/hero-autodespido-9lQ61PEt.jpg";
const PRODUCTOS_JURIDICOS = {
  "recupera-casa": {
    id: "recupera-casa",
    nombre: "Recupera tu Casa",
    emoji: "🏠",
    eyebrow: "Arrendatario moroso",
    title: "¿Tu arrendatario no paga? Recupera tu propiedad en tribunales.",
    description: "Procedimiento monitorio para cobrar rentas y obtener la restitución del inmueble.",
    image: heroRecuperaCasa,
    backendArea: "inmobiliario",
    icon: faHouseUser,
    campos: [
      {
        name: "tieneContrato",
        type: "radio",
        label: "Contrato de arriendo",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      },
      {
        name: "mesesMora",
        type: "number",
        label: "Meses de mora",
        required: true,
        placeholder: "Ej: 3"
      },
      {
        name: "montoTotal",
        type: "number",
        label: "Monto adeudado",
        required: true,
        placeholder: "Pesos"
      },
      {
        name: "direccionPropiedad",
        type: "text",
        label: "Dirección propiedad",
        required: true,
        placeholder: "Calle, número, ciudad"
      },
      {
        name: "hayConsumos",
        type: "radio",
        label: "Consumos (agua, luz, gas)",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      }
    ],
    placeholder: "Cuéntanos: ¿desde cuándo no paga?, ¿hay consumos o gastos comunes también?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, necesito recuperar mi propiedad por arrendatario moroso."
  },
  "recupera-pie": {
    id: "recupera-pie",
    nombre: "Recupera tu Pie",
    emoji: "🏗️",
    eyebrow: "Inmobiliaria retiene pie",
    title: "¿La inmobiliaria se quedó con tu pie? Recupera tu dinero.",
    description: "Defensa de derechos del consumidor y acción de restitución.",
    image: heroRecuperaPie,
    backendArea: "inmobiliario",
    icon: faKey,
    campos: [
      {
        name: "montoPie",
        type: "number",
        label: "Monto pagado",
        required: true,
        placeholder: "Pesos"
      },
      {
        name: "motivoRechazo",
        type: "select",
        label: "Motivo rechazo",
        required: true,
        options: [
          { value: "hipotecario", label: "Rechazo de crédito" },
          { value: "requisitos", label: "Falta de requisitos" },
          { value: "cambio_planes", label: "Cambio de planes" },
          { value: "otro", label: "Otro" }
        ]
      },
      {
        name: "tienePromesa",
        type: "radio",
        label: "Promesa compraventa",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      },
      {
        name: "montoRetenido",
        type: "number",
        label: "Monto retenido",
        required: true,
        placeholder: "Pesos"
      },
      {
        name: "inmobiliaria",
        type: "text",
        label: "Inmobiliaria",
        required: false
      }
    ],
    placeholder: "¿Cuándo te rechazaron el crédito?, ¿la inmobiliaria se niega a devolver el dinero?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, la inmobiliaria se quedó con mi pie después de rechazarme el crédito."
  },
  "defiende-despido": {
    id: "defiende-despido",
    nombre: "Defiende tu Despido",
    emoji: "👔",
    eyebrow: "Despido injustificado",
    title: "¿Te despidieron injustamente? Calcula cuánto podrías reclamar.",
    description: "Evaluamos si tu despido cumple con los requisitos legales.",
    image: heroDefiendeDeспido,
    backendArea: "laboral",
    icon: faBriefcase,
    campos: [
      {
        name: "fechaDespido",
        type: "date",
        label: "Fecha despido",
        required: true
      },
      {
        name: "sueldoMensual",
        type: "number",
        label: "Sueldo mensual",
        required: true,
        placeholder: "Pesos"
      },
      {
        name: "causalEnCarta",
        type: "text",
        label: "Causal en carta",
        required: true,
        placeholder: "Ej: desahucio, incumplimiento"
      },
      {
        name: "recibisteLiquidacion",
        type: "radio",
        label: "Recibiste liquidación",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      }
    ],
    placeholder: "¿La causal te parece justa?, ¿hay documentos que prueben lo contrario?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, creo que me despidieron injustamente."
  },
  "cotizaciones-impagas": {
    id: "cotizaciones-impagas",
    nombre: "Cotizaciones Impagas",
    emoji: "👷",
    eyebrow: "Nulidad del despido",
    title: "¿Te despidieron sin cotiizar? Anula el despido.",
    description: "Si tu empleador omitió cotizaciones, el despido es nulo.",
    image: heroCotizacionesImpagas,
    backendArea: "laboral",
    icon: faChartColumn,
    campos: [
      {
        name: "fechaDespido",
        type: "date",
        label: "Fecha despido",
        required: true
      },
      {
        name: "tieneCartaDespido",
        type: "radio",
        label: "Carta de despido",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      },
      {
        name: "mesesSinCotizar",
        type: "number",
        label: "Meses sin cotizar",
        required: true,
        placeholder: "Ej: 2, 3, 6"
      },
      {
        name: "tieneComprobanteCotizaciones",
        type: "radio",
        label: "Acceso historial AFP/Fonasa",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      }
    ],
    placeholder: "¿Puedes acceder a tu historial de AFP o Fonasa para verificar las cotizaciones?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, me despidieron y creo que tenía cotizaciones impagas."
  },
  "cobra-pension": {
    id: "cobra-pension",
    nombre: "Cobra tu Pensión",
    emoji: "👶",
    eyebrow: "Alimentos adeudados",
    title: "¿Te deben pensión de alimentos? Ejecuta el cobro.",
    description: "Procedimiento especial para pensiones adeudadas con mérito ejecutivo.",
    image: heroCobraPension,
    backendArea: "familia",
    icon: faDollarSign,
    campos: [
      {
        name: "montoPension",
        type: "number",
        label: "Pensión mensual",
        required: true,
        placeholder: "Pesos"
      },
      {
        name: "mesesAtrasados",
        type: "number",
        label: "Meses adeudados",
        required: true,
        placeholder: "Ej: 3, 6, 12"
      },
      {
        name: "haySentencia",
        type: "radio",
        label: "Sentencia vigente",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      },
      {
        name: "deudorEsIdentificado",
        type: "radio",
        label: "Ubicación deudor",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      }
    ],
    placeholder: "¿Tienes la sentencia de alimentos?, ¿sabes dónde trabaja?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, me deben pensión de alimentos."
  },
  "divorcio-express": {
    id: "divorcio-express",
    nombre: "Divorcio Express",
    emoji: "💔",
    eyebrow: "Mutuo acuerdo",
    title: "¿Te quieres divorciar de mutuo acuerdo? Rápido y sin conflicto.",
    description: "Divorcio notarial o judicial con acuerdo total.",
    image: heroDivorcioExpress,
    backendArea: "familia",
    icon: faHeartBroken,
    campos: [
      {
        name: "mutuoAcuerdo",
        type: "radio",
        label: "Mutuo acuerdo",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      },
      {
        name: "hayHijos",
        type: "radio",
        label: "Hijos menores",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      },
      {
        name: "tiempoSeparacion",
        type: "select",
        label: "Tiempo separados",
        required: true,
        options: [
          { value: "menos_1", label: "Menos de 1 año" },
          { value: "1_2", label: "1-2 años" },
          { value: "mas_2", label: "Más de 2 años" }
        ]
      },
      {
        name: "acuerdoCompletamente",
        type: "radio",
        label: "Acuerdo completo",
        required: true,
        options: [
          { value: "si", label: "Sí, en todo" },
          { value: "no", label: "No, hay pendientes" }
        ]
      }
    ],
    placeholder: "¿Ya tienen todo acordado con tu pareja?, ¿qué temas quedan pendientes?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, quiero divorciarme de mutuo acuerdo."
  },
  "autodespido": {
    id: "autodespido",
    nombre: "Autodespido",
    emoji: "⚠️",
    eyebrow: "Incumplimiento del empleador",
    title: "¿Tu empleador incumplió gravemente? Pide indemnización.",
    description: "Autodespido por incumplimiento grave de obligaciones laborales.",
    image: heroAutodespido,
    backendArea: "laboral",
    icon: faExclamationTriangle,
    campos: [
      {
        name: "fechaAutodespido",
        type: "date",
        label: "Fecha retiro",
        required: true
      },
      {
        name: "motivoIncumplimiento",
        type: "select",
        label: "Incumplimiento empleador",
        required: true,
        options: [
          { value: "falta_pago", label: "No paga sueldos" },
          { value: "ambiente_hostil", label: "Ambiente hostil" },
          { value: "cambio_terminos", label: "Cambio de términos" },
          { value: "falta_seguridad", label: "Falta de seguridad" },
          { value: "otro", label: "Otro" }
        ]
      },
      {
        name: "tieneDocumentacion",
        type: "radio",
        label: "Documentación incumplimiento",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" }
        ]
      }
    ],
    placeholder: "¿Tienes evidencia del incumplimiento? (correos, mensajes, testigos)",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, me retiraré del trabajo por incumplimiento del empleador."
  }
};
function getProducto(id) {
  return PRODUCTOS_JURIDICOS[id];
}
function getAllProductos() {
  return Object.values(PRODUCTOS_JURIDICOS);
}
const heroLegal = "/assets/hero-legal-BAvvy3uy.jpg";
const heroCorretaje = "/assets/hero-corretaje-Dc7uEAox.jpg";
const ORIGINAL_SLIDES = [
  {
    id: "legal",
    emoji: "⚖️",
    eyebrow: "Asesoría legal",
    title: "Consulta tu caso con nuestros abogados",
    description: "Evaluación gratuita de tu situación legal con profesionales especializados.",
    image: heroLegal,
    ctaLabel: "Asesoría legal",
    ctaTarget: "formulario",
    whatsappMessage: "Hola, quiero consultar mi caso con un abogado.",
    icon: faScaleBalanced
  },
  {
    id: "corretaje",
    emoji: "🏘️",
    eyebrow: "Corretaje inmobiliario",
    title: "Vende o arrienda tu propiedad con seguridad legal",
    description: "Servicio integral de corretaje con respaldo jurídico completo.",
    image: heroCorretaje,
    ctaLabel: "Consultar propiedad",
    ctaTarget: "formulario",
    whatsappMessage: "Hola, quiero asesoría sobre mi propiedad.",
    icon: faHouse
  }
];
const PRODUCTO_SLIDES = getAllProductos().map((producto) => ({
  id: producto.id,
  emoji: producto.emoji,
  eyebrow: producto.eyebrow,
  title: producto.title,
  description: producto.description,
  image: producto.image,
  ctaLabel: producto.cta,
  ctaTarget: "formulario",
  whatsappMessage: producto.whatsappMessage,
  icon: producto.icon
}));
const HERO_SLIDES = [...ORIGINAL_SLIDES, ...PRODUCTO_SLIDES];
const WHATSAPP_URL = "https://wa.me/56995336140?text=Hola,%20necesito%20hablar%20con%20un%20abogado.";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState(false);
  const goToSection = useSectionNav();
  const { setActiveSlide, scrollToHero } = useHeroCarousel();
  const scrollTo = (id) => {
    goToSection(id);
    setIsMenuOpen(false);
  };
  const goToSlide = (slideIndex) => {
    setActiveSlide(slideIndex);
    scrollToHero();
    setIsCaseDropdownOpen(false);
    setIsMenuOpen(false);
  };
  return /* @__PURE__ */ jsx("header", { className: "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-card-soft", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto container-padding", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16 lg:h-20", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/logo.png",
          alt: "Arteaga & Aldunate ",
          className: "\n    h-12\n    sm:h-16\n    md:h-24\n    lg:h-40\n    xl:h-48\n    2xl:h-56\n    w-auto\n    max-w-full\n    object-contain\n    cursor-pointer\n  ",
          onClick: () => scrollTo("hero")
        }
      ),
      /* @__PURE__ */ jsxs("nav", { className: "hidden lg:flex items-center gap-6", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => scrollTo("hero"),
            className: "font-body text-sm font-medium hover:text-legal-primary",
            children: "INICIO"
          }
        ),
        /* @__PURE__ */ jsx(NavigationMenu, { children: /* @__PURE__ */ jsx(NavigationMenuList, { children: /* @__PURE__ */ jsxs(NavigationMenuItem, { children: [
          /* @__PURE__ */ jsx(NavigationMenuTrigger, { className: "font-body text-sm font-medium", children: "¿CUÁL ES TU CASO?" }),
          /* @__PURE__ */ jsx(NavigationMenuContent, { children: /* @__PURE__ */ jsx("ul", { className: "grid w-[630px] grid-cols-3 gap-1 p-3", children: HERO_SLIDES.map((slide, idx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => goToSlide(idx),
              className: "block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-legal-primary/5 hover:text-legal-primary transition-colors flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(
                  FontAwesomeIcon,
                  {
                    icon: slide.icon,
                    className: "w-4 h-4 text-legal-primary"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "font-body text-sm", children: slide.eyebrow })
              ]
            }
          ) }, slide.id)) }) })
        ] }) }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => scrollTo("nosotros"),
            className: "font-body text-sm font-medium hover:text-legal-primary",
            children: "NOSOTROS"
          }
        ),
        /* @__PURE__ */ jsx(NavigationMenu, { children: /* @__PURE__ */ jsx(NavigationMenuList, { children: /* @__PURE__ */ jsxs(NavigationMenuItem, { children: [
          /* @__PURE__ */ jsx(NavigationMenuTrigger, { className: "font-body text-sm font-medium", children: "ÁREAS DE PRÁCTICA" }),
          /* @__PURE__ */ jsx(NavigationMenuContent, { children: /* @__PURE__ */ jsx("ul", { className: "grid w-[420px] grid-cols-2 gap-1 p-3", children: AREAS.map((a) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                focusArea(a);
                scrollTo("areas");
              },
              className: "block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-legal-primary/5 hover:text-legal-primary",
              children: AREA_LABELS[a]
            }
          ) }, a)) }) })
        ] }) }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => scrollTo("equipo"),
            className: "font-body text-sm font-medium hover:text-legal-primary",
            children: "EQUIPO"
          }
        ),
        /* @__PURE__ */ jsx(
          Link$1,
          {
            to: "/blog",
            className: "font-body text-sm font-medium hover:text-legal-primary",
            children: "BLOG"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => scrollTo("contacto"),
            className: "font-body text-sm font-medium hover:text-legal-primary",
            children: "CONTACTO"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: WHATSAPP_URL,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hidden sm:inline-flex items-center gap-2 bg-legal-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-legal-primary/90 transition",
            children: [
              /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
              " Habla con un abogado"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsMenuOpen(!isMenuOpen),
            className: "lg:hidden p-2 text-foreground hover:text-legal-primary transition-colors",
            children: isMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
          }
        )
      ] })
    ] }),
    isMenuOpen && /* @__PURE__ */ jsx("div", { className: "lg:hidden border-t border-border bg-white", children: /* @__PURE__ */ jsxs("nav", { className: "py-4 space-y-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => scrollTo("hero"),
          className: "block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200",
          children: "Inicio"
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsCaseDropdownOpen(!isCaseDropdownOpen),
            className: "block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between",
            children: [
              "¿CUÁL ES TU CASO?",
              /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 transition-transform ${isCaseDropdownOpen ? "rotate-180" : ""}` })
            ]
          }
        ),
        isCaseDropdownOpen && /* @__PURE__ */ jsx("div", { className: "bg-gray-50 border-t border-border", children: HERO_SLIDES.map((slide, idx) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => goToSlide(idx),
            className: "block w-full text-left px-8 py-2.5 font-body text-sm text-foreground hover:text-legal-primary hover:bg-gray-100 transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(
                FontAwesomeIcon,
                {
                  icon: slide.icon,
                  className: "w-4 h-4 text-legal-primary"
                }
              ),
              /* @__PURE__ */ jsx("span", { children: slide.eyebrow })
            ]
          },
          slide.id
        )) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => scrollTo("nosotros"),
          className: "block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200",
          children: "Nosotros"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => scrollTo("areas"),
          className: "block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200",
          children: "Áreas de Práctica"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => scrollTo("equipo"),
          className: "block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200",
          children: "Equipo"
        }
      ),
      /* @__PURE__ */ jsx(
        Link$1,
        {
          to: "/blog",
          onClick: () => setIsMenuOpen(false),
          className: "block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200",
          children: "Blog"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => scrollTo("contacto"),
          className: "block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200",
          children: "Contacto"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "px-4 pt-2", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: WHATSAPP_URL,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "w-full inline-flex items-center justify-center gap-2 bg-legal-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-legal-primary/90 transition",
          children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
            " Habla con un abogado"
          ]
        }
      ) })
    ] }) })
  ] }) });
};
const WHATSAPP_PHONE = "56995336140";
const STATS = [
  { num: "15+", label: "Años de experiencia" },
  { num: "2.000+", label: "Casos resueltos" },
  { num: "98%", label: "Satisfacción" }
];
const HeroSlide = ({ slide, isFirst, children }) => {
  const Titular = isFirst ? "h1" : "h2";
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen flex items-center overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10", children: [
      /* @__PURE__ */ jsx("img", { src: slide.image, alt: "", "aria-hidden": true, className: "w-full h-full object-cover object-center" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden -z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/[0.03]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-primary/[0.02]" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 w-full", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-center lg:items-start", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.7 },
            children: [
              /* @__PURE__ */ jsxs("p", { className: "text-primary/70 font-semibold text-sm md:text-base tracking-widest uppercase mb-4", children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: slide.icon, className: "inline-block w-5 h-5 mr-2 text-legal-primary" }),
                slide.eyebrow
              ] }),
              /* @__PURE__ */ jsx(Titular, { className: "font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6", children: slide.title }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed", children: slide.description })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.7, delay: 0.3 },
            className: "flex flex-col sm:flex-row gap-4",
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    var _a;
                    return (_a = document.getElementById(slide.ctaTarget)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                  },
                  className: "inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition shadow-soft",
                  children: [
                    /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5" }),
                    slide.ctaLabel
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(slide.whatsappMessage)}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center justify-center gap-3 border-[2px] border-[#25D366] bg-background text-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-secondary transition shadow-soft",
                  children: [
                    /* @__PURE__ */ jsx(MessageCircle, { className: "w-5 h-5" }),
                    "WhatsApp"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.7, delay: 0.6 },
            className: "mt-14 grid grid-cols-3 gap-8 max-w-lg",
            children: STATS.map((s) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-3xl md:text-4xl font-bold text-foreground", children: s.num }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs md:text-sm mt-1", children: s.label })
            ] }, s.label))
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 25 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: 0.2 },
          className: "w-full",
          children
        }
      )
    ] }) })
  ] });
};
const CAMPOS_DE_TEXTO = ["INPUT", "TEXTAREA", "SELECT"];
const hayCampoEnfocado = (contenedor) => {
  const foco = document.activeElement;
  if (!foco || !CAMPOS_DE_TEXTO.includes(foco.tagName)) return false;
  return (contenedor == null ? void 0 : contenedor.contains(foco)) ?? false;
};
const HeroCarousel = ({ slides, intervaloMs = 0 }) => {
  const [activo, setActivo] = useState(0);
  const { activeSlide, setActiveSlide } = useHeroCarousel();
  const total = slides.length;
  const ir = (i) => {
    const nuevoIndice = (i + total) % total;
    setActivo(nuevoIndice);
    setActiveSlide(nuevoIndice);
  };
  const seccionRef = useRef(null);
  useEffect(() => {
    setActivo(activeSlide);
  }, [activeSlide]);
  useEffect(() => {
    var _a;
    if (!intervaloMs || total < 2) return;
    const prefiereMenosMovimiento = (_a = window.matchMedia) == null ? void 0 : _a.call(
      window,
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefiereMenosMovimiento) return;
    const id = window.setInterval(() => {
      if (hayCampoEnfocado(seccionRef.current)) return;
      setActivo((i) => {
        const nuevoIndice = (i + 1) % total;
        setActiveSlide(nuevoIndice);
        return nuevoIndice;
      });
    }, intervaloMs);
    return () => window.clearInterval(id);
  }, [intervaloMs, total, setActiveSlide]);
  const onKeyDown = (e) => {
    const target = e.target;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
    if (e.key === "ArrowLeft") ir(activo - 1);
    else if (e.key === "ArrowRight") ir(activo + 1);
  };
  const touchStart = useRef(null);
  const UMBRAL_SWIPE = 50;
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < UMBRAL_SWIPE) return;
    if (dx < 0) ir(activo + 1);
    else ir(activo - 1);
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref: seccionRef,
      id: "hero",
      "aria-roledescription": "carousel",
      "aria-label": "Servicios del estudio",
      className: "relative overflow-hidden",
      onKeyDown,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex items-start transition-transform duration-1000 ease-in-out",
            style: { transform: `translateX(-${activo * 100}%)` },
            onTouchStart,
            onTouchEnd,
            children: slides.map(({ data, form }, i) => /* @__PURE__ */ jsx(
              "div",
              {
                "data-slide": data.id,
                className: "w-full flex-shrink-0",
                "aria-roledescription": "slide",
                "aria-label": `${i + 1} de ${total}`,
                ...i === activo ? {} : { inert: "" },
                children: /* @__PURE__ */ jsx(HeroSlide, { slide: data, isFirst: i === 0, children: form })
              },
              data.id
            ))
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => ir(activo - 1),
            "aria-label": "Servicio anterior",
            className: "hidden md:block absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 border border-border p-2.5 shadow-soft hover:bg-white transition-all hover:shadow-md active:scale-95",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-6 h-6 text-foreground" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => ir(activo + 1),
            "aria-label": "Servicio siguiente",
            className: "hidden md:block absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 border border-border p-2.5 shadow-soft hover:bg-white transition-all hover:shadow-md active:scale-95",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-6 h-6 text-foreground" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-foreground/60 tabular-nums", children: [
            activo + 1,
            "/",
            total
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: slides.map(({ data }, i) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => ir(i),
              "aria-label": `Ver ${data.eyebrow}`,
              "aria-current": i === activo,
              className: `h-2 rounded-full transition-all ${i === activo ? "w-8 bg-primary" : "w-2 bg-primary/30"}`
            },
            data.id
          )) })
        ] })
      ]
    }
  );
};
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        legal: "bg-gradient-legal text-white hover:shadow-legal hover:-translate-y-0.5 font-medium",
        "legal-outline": "border-2 border-legal-primary text-legal-primary bg-transparent hover:bg-legal-primary hover:text-white",
        "legal-dark": "bg-legal-dark text-white hover:bg-legal-dark/90 font-medium"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg font-semibold",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      className: cn("grid gap-2", className),
      ...props,
      ref
    }
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(Circle, { className: "h-2.5 w-2.5 fill-current text-current" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const AddressSearchInput = ({
  value,
  onChange,
  placeholder = "Busca una dirección...",
  label = "Dirección",
  required = false,
  error = "",
  disabled = false
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const placesServiceRef = useRef(null);
  const geocoderRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [apiError, setApiError] = useState("");
  const suggestionsRef = useRef(null);
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      setApiError("Google Maps API no está disponible");
      return;
    }
    try {
      autocompleteRef.current = new google.maps.places.AutocompleteService();
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      geocoderRef.current = new google.maps.Geocoder();
      const dummyDiv = document.createElement("div");
      placesServiceRef.current = new google.maps.places.PlacesService(dummyDiv);
    } catch (err) {
      setApiError("Error al inicializar Google Maps API");
      console.error("Error initializing Places API:", err);
    }
  }, []);
  const handleInputChange = useCallback(
    async (e) => {
      const query = e.target.value;
      setInputValue(query);
      setApiError("");
      if (!query || query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      if (!autocompleteRef.current) {
        setApiError("Servicio de autocomplete no disponible");
        return;
      }
      setIsLoading(true);
      try {
        const predictions = await autocompleteRef.current.getPlacePredictions({
          input: query,
          sessionToken: sessionTokenRef.current,
          componentRestrictions: { country: "cl" },
          // Restrict to Chile
          types: ["geocode"]
          // Only address-type results
        });
        const preds = predictions.predictions || [];
        if (preds.length > 0) {
          console.log("Google Places prediction structure:", {
            main_text: preds[0].main_text,
            secondary_text: preds[0].secondary_text,
            description: preds[0].description,
            place_id: preds[0].place_id
          });
        }
        setSuggestions(preds);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setApiError("Error al buscar direcciones");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  const handleSelectSuggestion = useCallback(
    async (prediction) => {
      if (!geocoderRef.current) {
        setApiError("Geocoder no disponible");
        return;
      }
      setIsLoading(true);
      setShowSuggestions(false);
      try {
        const results = await geocoderRef.current.geocode({
          placeId: prediction.place_id
        });
        if (results.results.length === 0) {
          setApiError("No se encontraron coordenadas para esta dirección");
          return;
        }
        const result = results.results[0];
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();
        let street = "";
        let streetNumber = "";
        let city = "";
        let region = "";
        let country = "";
        result.address_components.forEach((component) => {
          if (component.types.includes("route")) {
            street = component.long_name;
          } else if (component.types.includes("street_number")) {
            streetNumber = component.long_name;
          } else if (component.types.includes("locality") || component.types.includes("administrative_area_level_3")) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            region = component.long_name;
          } else if (component.types.includes("country")) {
            country = component.long_name;
          }
        });
        const fullAddress = result.formatted_address;
        setInputValue(fullAddress);
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        onChange({
          address: fullAddress,
          latitude: lat,
          longitude: lng,
          components: {
            street,
            streetNumber,
            city,
            region,
            country
          }
        });
      } catch (err) {
        console.error("Error selecting suggestion:", err);
        setApiError("Error al obtener detalles de la dirección");
      } finally {
        setIsLoading(false);
      }
    },
    [onChange]
  );
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-foreground mb-2 block", children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: " *" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            ref: inputRef,
            type: "text",
            value: inputValue,
            onChange: handleInputChange,
            placeholder,
            disabled: disabled || isLoading,
            className: "pl-9",
            autoComplete: "off",
            onFocus: () => inputValue && suggestions.length > 0 && setShowSuggestions(true)
          }
        ),
        isLoading && /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 animate-pulse text-primary" }) })
      ] }),
      showSuggestions && suggestions.length > 0 && /* @__PURE__ */ jsx(
        "div",
        {
          ref: suggestionsRef,
          className: "absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto",
          children: suggestions.map((prediction, index) => {
            var _a;
            return /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => handleSelectSuggestion(prediction),
                className: "w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-sm truncate", children: prediction.main_text || ((_a = prediction.description) == null ? void 0 : _a.split(",")[0]) || "Dirección" }),
                    prediction.secondary_text && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: prediction.secondary_text }),
                    !prediction.secondary_text && prediction.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: prediction.description.includes(",") ? prediction.description.split(",").slice(1).join(",").trim() : prediction.description })
                  ] })
                ] })
              },
              `${prediction.place_id}-${index}`
            );
          })
        }
      ),
      error && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1 text-red-500 text-xs", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }),
        error
      ] }),
      apiError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1 text-yellow-600 text-xs", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }),
        apiError
      ] })
    ] }),
    !apiError && !error && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Busca una dirección en Chile" })
  ] });
};
async function submitLead(payload) {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return { ok: false, message: data.message || "No se pudo enviar tu consulta." };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Error de conexión. Intenta nuevamente." };
  }
}
const SITE_KEY = "6Lcr_X0tAAAAAHwVugJ_3FfKkFFQoFl_znVgRP4U";
const RECAPTCHA_ACTIONS = {
  heroLegal: "hero_legal",
  heroCorretaje: "hero_corretaje",
  contacto: "contacto"
};
async function getRecaptchaToken(action) {
  var _a;
  const enterprise = (_a = window.grecaptcha) == null ? void 0 : _a.enterprise;
  if (!enterprise) return void 0;
  try {
    await new Promise((resolve) => enterprise.ready(resolve));
    return await enterprise.execute(SITE_KEY, { action });
  } catch {
    return void 0;
  }
}
const ProductoForm = ({ productoId }) => {
  const { toast: toast2 } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    urgencia: "sin_apuro",
    horario: "cualquiera",
    address: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const producto = getProducto(productoId);
  if (!producto) {
    return /* @__PURE__ */ jsx("div", { className: "text-red-500", children: "Producto no encontrado" });
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleAddressSelect = (result) => {
    setFormData((prev) => ({
      ...prev,
      address: result.address,
      latitude: result.latitude,
      longitude: result.longitude
    }));
  };
  const validateForm = () => {
    var _a, _b, _c;
    const newErrors = {};
    if (!((_a = formData.name) == null ? void 0 : _a.trim())) {
      newErrors.name = "Nombre requerido";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nombre muy corto (mín. 3 caracteres)";
    }
    if (!((_b = formData.email) == null ? void 0 : _b.trim())) {
      newErrors.email = "Email requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!((_c = formData.message) == null ? void 0 : _c.trim()) || formData.message.trim().length < 5) {
      newErrors.message = "Describe tu caso (mín. 5 caracteres)";
    }
    producto.campos.forEach((campo) => {
      if (campo.required && !formData[campo.name]) {
        newErrors[campo.name] = `${campo.label} es requerido`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    if (!validateForm()) {
      toast2({
        title: "Completa los campos requeridos",
        description: "Revisa los errores arriba",
        variant: "destructive"
      });
      return;
    }
    setSubmitting(true);
    try {
      const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTIONS.heroLegal);
      const payload = {
        servicio: "legal",
        producto: productoId,
        recaptchaToken,
        recaptchaAction: RECAPTCHA_ACTIONS.heroLegal,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || "",
        message: formData.message.trim(),
        urgencia: formData.urgencia,
        horario: formData.horario,
        address: ((_a = formData.address) == null ? void 0 : _a.trim()) || "",
        latitude: formData.latitude,
        longitude: formData.longitude
      };
      producto.campos.forEach((campo) => {
        if (formData[campo.name]) {
          payload[campo.name] = formData[campo.name];
        }
      });
      const res = await submitLead(payload);
      setSubmitting(false);
      if (res.ok) {
        toast2({
          title: "Consulta enviada",
          description: "Te responderemos a la brevedad."
        });
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
          urgencia: "sin_apuro",
          horario: "cualquiera",
          address: ""
        });
        setErrors({});
      } else {
        toast2({
          title: "Error al enviar",
          description: res.message || "Intenta de nuevo más tarde",
          variant: "destructive"
        });
      }
    } catch (error) {
      setSubmitting(false);
      toast2({
        title: "Error al enviar",
        description: "Hubo un problema. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };
  return /* @__PURE__ */ jsx(Card, { className: "p-6 shadow-card-soft border border-border bg-background/80 backdrop-blur rounded-2xl max-h-[600px] overflow-y-auto", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-heading text-xl font-bold text-foreground mb-1 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: producto.icon, className: "w-5 h-5 text-legal-primary" }),
        producto.nombre
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: "Completa el formulario y evaluaremos tu caso gratuitamente." })
    ] }),
    producto.campos.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-primary/5 p-3 rounded-lg border border-primary/10 space-y-3", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Información específica" }),
      producto.campos.map((campo) => {
        var _a, _b, _c, _d;
        return /* @__PURE__ */ jsxs("div", { children: [
          campo.type === "radio" && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide", children: [
              campo.label,
              campo.required && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: " *" })
            ] }),
            /* @__PURE__ */ jsx(
              RadioGroup,
              {
                value: ((_a = formData[campo.name]) == null ? void 0 : _a.toString()) || "",
                onValueChange: (value) => handleRadioChange(campo.name, value),
                children: (_b = campo.options) == null ? void 0 : _b.map((option) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-1", children: [
                  /* @__PURE__ */ jsx(
                    RadioGroupItem,
                    {
                      value: option.value,
                      id: `${campo.name}-${option.value}`
                    }
                  ),
                  /* @__PURE__ */ jsx(Label, { htmlFor: `${campo.name}-${option.value}`, className: "font-normal text-sm cursor-pointer", children: option.label })
                ] }, option.value))
              }
            ),
            errors[campo.name] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors[campo.name] })
          ] }),
          campo.type === "select" && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide", children: [
              campo.label,
              campo.required && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: " *" })
            ] }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: ((_c = formData[campo.name]) == null ? void 0 : _c.toString()) || "",
                onValueChange: (value) => handleRadioChange(campo.name, value),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "text-sm", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona..." }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: (_d = campo.options) == null ? void 0 : _d.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
                ]
              }
            ),
            errors[campo.name] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors[campo.name] })
          ] }),
          ["text", "email", "tel", "number", "date"].includes(campo.type) && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide", children: [
              campo.label,
              campo.required && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: " *" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: campo.type,
                name: campo.name,
                value: formData[campo.name] || "",
                onChange: handleChange,
                placeholder: campo.placeholder,
                className: "text-sm"
              }
            ),
            errors[campo.name] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors[campo.name] })
          ] })
        ] }, campo.name);
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-4 space-y-3", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Tus datos de contacto" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide", children: "Nombre completo *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              name: "name",
              type: "text",
              value: formData.name,
              onChange: handleChange,
              placeholder: "Tu nombre completo",
              className: "text-sm"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-0.5", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide", children: "Teléfono" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              name: "phone",
              type: "tel",
              value: formData.phone,
              onChange: handleChange,
              placeholder: "+56 9 XXXX XXXX",
              className: "text-sm"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide", children: "Correo electrónico *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            name: "email",
            type: "email",
            value: formData.email,
            onChange: handleChange,
            placeholder: "tu@email.com",
            className: "text-sm"
          }
        ),
        errors.email && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-0.5", children: errors.email })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-border pt-4", children: /* @__PURE__ */ jsx(
      AddressSearchInput,
      {
        value: formData.address || "",
        onChange: handleAddressSelect,
        label: "Ubicación (opcional)",
        placeholder: "Busca una dirección en Chile...",
        required: false
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-3 border-t border-border pt-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide", children: "Urgencia" }),
        /* @__PURE__ */ jsxs(Select, { value: formData.urgencia, onValueChange: (value) => handleRadioChange("urgencia", value), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "text-sm", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "inmediata", children: "Inmediata (detenido)" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "semana", children: "Esta semana" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "sin_apuro", children: "Sin apuro" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide", children: "¿Cuándo contactarte?" }),
        /* @__PURE__ */ jsxs(Select, { value: formData.horario, onValueChange: (value) => handleRadioChange("horario", value), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "text-sm", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "manana", children: "Mañana" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "tarde", children: "Tarde" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "cualquiera", children: "Cualquiera" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide", children: "Cuéntanos más *" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          name: "message",
          value: formData.message,
          onChange: handleChange,
          placeholder: producto.placeholder,
          rows: 4,
          className: "resize-none text-sm"
        }
      ),
      errors.message && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-0.5", children: errors.message })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-primary/5 p-3 rounded-lg border border-primary/10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-primary mt-0.5 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "Confidencialidad garantizada:" }),
        " Tu información está protegida por secreto profesional."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "submit",
        size: "md",
        className: "w-full gap-2 group text-sm",
        disabled: submitting,
        children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }),
          "Enviando..."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Send, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" }),
          "Enviar consulta gratuita"
        ] })
      }
    )
  ] }) });
};
const LegalQuickForm = () => {
  const { toast: toast2 } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || formData.message.trim().length < 5) {
      toast2({
        title: "Completa los campos",
        description: "Nombre, correo y una breve descripción (mín. 5 caracteres).",
        variant: "destructive"
      });
      return;
    }
    setSubmitting(true);
    const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTIONS.heroLegal);
    const res = await submitLead({
      servicio: "legal",
      recaptchaToken,
      recaptchaAction: RECAPTCHA_ACTIONS.heroLegal,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim()
    });
    setSubmitting(false);
    if (res.ok) {
      toast2({
        title: "Consulta enviada",
        description: "Te responderemos a la brevedad."
      });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } else {
      toast2({
        title: "Error al enviar",
        description: res.message,
        variant: "destructive"
      });
    }
  };
  return /* @__PURE__ */ jsx(Card, { className: "p-8 shadow-card-soft border border-border bg-background/80 backdrop-blur rounded-2xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-heading text-2xl font-bold text-foreground mb-2", children: "Cuéntanos tu caso" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Todos los campos marcados con * son obligatorios" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Nombre completo *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            name: "name",
            type: "text",
            value: formData.name,
            onChange: handleChange,
            placeholder: "Tu nombre completo"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Teléfono" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            name: "phone",
            type: "tel",
            value: formData.phone,
            onChange: handleChange,
            placeholder: "+56 9 XXXX XXXX"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Correo electrónico *" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          name: "email",
          type: "email",
          value: formData.email,
          onChange: handleChange,
          placeholder: "tu@email.com"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Describe tu situación *" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          name: "message",
          value: formData.message,
          onChange: handleChange,
          placeholder: "Cuéntanos brevemente qué tipo de caso tienes, si has sido citado, detenido, o necesitas asesoría preventiva...",
          rows: 5,
          className: "resize-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-primary/5 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-primary mt-0.5 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "Confidencialidad garantizada:" }),
        " ",
        "Toda la información que compartas está protegida por el secreto profesional del abogado."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "submit",
        size: "lg",
        className: "w-full gap-2 group",
        disabled: submitting,
        children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }),
          "Enviando..."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Send, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" }),
          "Enviar consulta gratuita"
        ] })
      }
    )
  ] }) });
};
const OPERACIONES = ["vender", "arrendar", "comprar", "busco_arriendo"];
const OPERACION_LABELS = {
  vender: "Vender mi propiedad",
  arrendar: "Arrendar mi propiedad",
  comprar: "Comprar una propiedad",
  busco_arriendo: "Busco arriendo"
};
const TIPOS_PROPIEDAD = [
  "casa",
  "departamento",
  "oficina",
  "local",
  "terreno"
];
const TIPO_PROPIEDAD_LABELS = {
  casa: "Casa",
  departamento: "Departamento",
  oficina: "Oficina",
  local: "Local comercial",
  terreno: "Terreno"
};
const TEMAS_LEGALES = ["no_lo_se", "no", "si"];
const TEMA_LEGAL_LABELS = {
  no_lo_se: "No lo sé",
  no: "No",
  si: "Sí (herencia, arriendo impago, copropiedad, juicio)"
};
const brokerageSchema = z.object({
  name: z.string().trim().min(3, "Ingresa tu nombre completo"),
  phone: z.string().trim().min(8, "Ingresa un teléfono válido"),
  email: z.string().trim().email("Ingresa un correo válido"),
  operacion: z.enum(OPERACIONES, { required_error: "Selecciona qué necesitas" }),
  tipoPropiedad: z.enum(TIPOS_PROPIEDAD).optional(),
  comuna: z.string().trim().optional(),
  temaLegal: z.enum(TEMAS_LEGALES).optional(),
  message: z.string().trim().min(5, "Cuéntanos brevemente (mín. 5 caracteres)"),
  // honeypot anti-spam: debe llegar vacío
  website: z.string().max(0).optional().default("")
});
const VACIO = {
  name: "",
  phone: "",
  email: "",
  operacion: "",
  tipoPropiedad: "",
  comuna: "",
  temaLegal: "",
  message: "",
  website: ""
};
const BrokerageQuickForm = () => {
  const { toast: toast2 } = useToast();
  const [form, setForm] = useState(VACIO);
  const [submitting, setSubmitting] = useState(false);
  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.website !== "") {
      toast2({ title: "Consulta enviada", description: "Te contactaremos a la brevedad." });
      setForm(VACIO);
      return;
    }
    const limpio = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== "")
    );
    const parsed = brokerageSchema.safeParse({ website: "", ...limpio });
    if (!parsed.success) {
      toast2({
        title: "Revisa los datos",
        description: parsed.error.issues[0].message,
        variant: "destructive"
      });
      return;
    }
    setSubmitting(true);
    const recaptchaToken = await getRecaptchaToken(
      RECAPTCHA_ACTIONS.heroCorretaje
    );
    const res = await submitLead({
      servicio: "corretaje",
      recaptchaToken,
      recaptchaAction: RECAPTCHA_ACTIONS.heroCorretaje,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      operacion: parsed.data.operacion,
      tipoPropiedad: parsed.data.tipoPropiedad,
      comuna: parsed.data.comuna,
      temaLegal: parsed.data.temaLegal,
      website: parsed.data.website
    });
    setSubmitting(false);
    if (res.ok) {
      toast2({ title: "Consulta enviada", description: "Te contactaremos a la brevedad." });
      setForm(VACIO);
    } else {
      toast2({ title: "Error al enviar", description: res.message, variant: "destructive" });
    }
  };
  return /* @__PURE__ */ jsx(Card, { className: "p-8 shadow-card-soft border border-border bg-background/80 backdrop-blur rounded-2xl", children: /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-heading text-2xl font-bold text-foreground mb-2", children: "Cuéntanos de tu propiedad" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Todos los campos marcados con * son obligatorios" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "b-name", className: "text-sm font-medium text-foreground mb-2 block", children: "Nombre completo *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "b-name",
            name: "name",
            value: form.name,
            onChange,
            placeholder: "Tu nombre completo"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "b-phone", className: "text-sm font-medium text-foreground mb-2 block", children: "Teléfono *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "b-phone",
            name: "phone",
            type: "tel",
            value: form.phone,
            onChange,
            placeholder: "+56 9 XXXX XXXX"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "b-email", className: "text-sm font-medium text-foreground mb-2 block", children: "Correo electrónico *" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "b-email",
          name: "email",
          type: "email",
          value: form.email,
          onChange,
          placeholder: "tu@email.com"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "b-operacion", className: "text-sm font-medium text-foreground mb-2 block", children: "¿Qué necesitas? *" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "b-operacion",
            name: "operacion",
            value: form.operacion,
            onChange,
            className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Selecciona…" }),
              OPERACIONES.map((o) => /* @__PURE__ */ jsx("option", { value: o, children: OPERACION_LABELS[o] }, o))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "b-tipo", className: "text-sm font-medium text-foreground mb-2 block", children: "Tipo de propiedad" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "b-tipo",
            name: "tipoPropiedad",
            value: form.tipoPropiedad,
            onChange,
            className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Selecciona…" }),
              TIPOS_PROPIEDAD.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: TIPO_PROPIEDAD_LABELS[t] }, t))
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "b-comuna", className: "text-sm font-medium text-foreground mb-2 block", children: "Comuna" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "b-comuna",
            name: "comuna",
            value: form.comuna,
            onChange,
            placeholder: "Providencia"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "b-tema", className: "text-sm font-medium text-foreground mb-2 block", children: "¿Tiene algún tema legal pendiente?" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "b-tema",
            name: "temaLegal",
            value: form.temaLegal,
            onChange,
            className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Selecciona…" }),
              TEMAS_LEGALES.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: TEMA_LEGAL_LABELS[t] }, t))
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "b-message", className: "text-sm font-medium text-foreground mb-2 block", children: "Cuéntanos brevemente *" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          id: "b-message",
          name: "message",
          rows: 4,
          value: form.message,
          onChange,
          className: "resize-none",
          placeholder: "Ubicación aproximada, estado de la propiedad, plazos que manejas..."
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        name: "website",
        value: form.website,
        onChange,
        tabIndex: -1,
        autoComplete: "off",
        "aria-hidden": "true",
        className: "absolute left-[-9999px] w-px h-px opacity-0"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-primary/5 p-4 rounded-lg flex items-start gap-2", children: [
      /* @__PURE__ */ jsx(Home, { className: "w-5 h-5 text-primary mt-0.5 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "Corretaje y abogado en un solo lugar:" }),
        " ",
        "si la propiedad tiene un conflicto legal, lo resolvemos nosotros."
      ] })
    ] }),
    /* @__PURE__ */ jsx(Button, { type: "submit", size: "lg", className: "w-full gap-2 group", disabled: submitting, children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }),
      "Enviando..."
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Send, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" }),
      "Enviar consulta gratuita"
    ] }) })
  ] }) });
};
const HeroSection = () => /* @__PURE__ */ jsx(
  HeroCarousel,
  {
    slides: HERO_SLIDES.map((data) => {
      let form;
      if (data.id === "legal") {
        form = /* @__PURE__ */ jsx(LegalQuickForm, {});
      } else if (data.id === "corretaje") {
        form = /* @__PURE__ */ jsx(BrokerageQuickForm, {});
      } else {
        form = /* @__PURE__ */ jsx(ProductoForm, { productoId: data.id });
      }
      return { data, form };
    })
  }
);
const values = [
  {
    icon: ShieldCheck,
    title: "Compromiso",
    desc: "Asumimos cada caso con seriedad, responsabilidad y dedicación profesional."
  },
  {
    icon: Scale,
    title: "Excelencia técnica",
    desc: "Estudiamos cada asunto con rigor jurídico, estrategia procesal y criterio práctico."
  },
  {
    icon: Landmark,
    title: "Transparencia",
    desc: "Entregamos información clara, honorarios definidos y comunicación permanente."
  },
  {
    icon: LockKeyhole,
    title: "Confidencialidad",
    desc: "Resguardamos con absoluta reserva la información de nuestros clientes."
  }
];
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.55,
      ease: "easeOut"
    }
  })
};
const AboutSection = () => {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "nosotros",
      className: "relative section-padding overflow-hidden bg-card",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#A12341]/5 blur-3xl" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative max-w-7xl mx-auto", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, margin: "-100px" },
              variants: fadeUp,
              custom: 0,
              className: "max-w-4xl mx-auto text-center mb-16",
              children: [
                /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4", children: "Quiénes somos" }),
                /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight", children: "Asesoría jurídica estratégica, cercana y orientada a resultados" }),
                /* @__PURE__ */ jsx("div", { className: "w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-8" }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg md:text-xl leading-relaxed", children: "Arteaga & Aldunate Abogados y Asociados es un estudio jurídico de servicios legales integrales, con sede en Santiago y cobertura en todo Chile. Asesoramos a personas, familias, emprendedores y empresas en la prevención, gestión y solución de sus conflictos jurídicos." })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-stretch mb-16", children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true },
                variants: fadeUp,
                custom: 1,
                className: "bg-background border border-border rounded-3xl p-8 md:p-10 shadow-soft",
                children: [
                  /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-widest uppercase mb-4", children: "Nuestra propuesta" }),
                  /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl md:text-3xl font-bold text-foreground mb-5", children: "Una defensa seria, clara y técnicamente preparada" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed", children: [
                    /* @__PURE__ */ jsx("p", { children: "Nuestro trabajo combina análisis jurídico riguroso, estrategia procesal y una comunicación directa con el cliente. Entendemos que enfrentar un problema legal puede generar incertidumbre; por eso buscamos entregar orientación clara, oportuna y enfocada en soluciones concretas." }),
                    /* @__PURE__ */ jsx("p", { children: "Intervenimos en materias penales, civiles, laborales, familiares, corporativas, inmobiliarias y tributarias, siempre con una mirada preventiva y litigiosa según las necesidades de cada caso." })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true },
                variants: fadeUp,
                custom: 2,
                className: "relative rounded-3xl p-[2px] bg-gradient-to-br from-[#A12341] to-[#0F3B47] shadow-soft",
                children: /* @__PURE__ */ jsxs("div", { className: "h-full bg-background rounded-[22px] p-8 md:p-10", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-widest uppercase mb-4", children: "Nuestra misión" }),
                  /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl md:text-3xl font-bold text-foreground mb-5", children: "Proteger lo que más importa" }),
                  /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg leading-relaxed mb-8", children: "Entregar a cada cliente —sea persona natural o empresa— soluciones jurídicas estratégicas, claras y ejecutables, que protejan su libertad, su familia, su trabajo y su patrimonio, bajo los más altos estándares éticos y profesionales." }),
                  /* @__PURE__ */ jsx("div", { className: "border-t border-border pt-6", children: /* @__PURE__ */ jsx("p", { className: "font-serif text-xl text-foreground italic leading-relaxed", children: "“La mejor asesoría legal no solo resuelve conflictos: también los previene.”" }) })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              variants: fadeUp,
              custom: 3,
              className: "text-center mb-10",
              children: [
                /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-3", children: "Nuestros valores" }),
                /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl md:text-4xl font-bold text-foreground", children: "Principios que guían nuestra práctica" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: values.map((item, i) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              variants: fadeUp,
              custom: i + 4,
              className: "group bg-background border border-border rounded-2xl p-7 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-13 h-13 mb-5 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition", children: /* @__PURE__ */ jsx(item.icon, { className: "w-7 h-7 text-primary" }) }),
                /* @__PURE__ */ jsx("h4", { className: "font-serif text-xl font-semibold text-foreground mb-3", children: item.title }),
                /* @__PURE__ */ jsx("p", { className: "font-sans text-muted-foreground leading-relaxed", children: item.desc })
              ]
            },
            item.title
          )) }),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true },
              variants: fadeUp,
              custom: 8,
              className: "mt-16 bg-background border border-border rounded-3xl px-8 py-10 md:px-12 md:py-12 text-center shadow-soft",
              children: [
                /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-widest uppercase mb-4", children: "Nuestro enfoque" }),
                /* @__PURE__ */ jsx("p", { className: "max-w-4xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed", children: "Creemos que cada caso exige una estrategia propia. Por eso analizamos los antecedentes, evaluamos los riesgos y diseñamos un camino jurídico claro, ya sea para prevenir conflictos, negociar una solución o litigar con firmeza ante los tribunales competentes." })
              ]
            }
          )
        ] })
      ]
    }
  );
};
const EVENT = "lead:prefill-area";
function prefillArea(area) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: area }));
  const el = document.getElementById("contacto");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
function onPrefillArea(cb) {
  const handler = (e) => cb(e.detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
const AREA_KEY = {
  "Derecho Penal": "penal",
  "Derecho Civil": "civil",
  "Derecho Laboral": "laboral",
  "Derecho de Familia": "familia",
  "Derecho Corporativo": "corporativo",
  "Derecho Inmobiliario": "inmobiliario",
  "Derecho Tributario": "tributario"
};
const areas = [
  {
    icon: AlertTriangle,
    title: "Derecho Penal",
    subtitle: "Defensa penal estratégica, inmediata y confidencial.",
    desc: "Cuando hay una imputación, una detención o una citación de la Fiscalía, cada hora cuenta. En Arteaga y Aldunate Abogados y Asociados asumimos su defensa desde el primer minuto: comparecencia ante el Ministerio Público, control de detención, formalización, juicio oral y recursos. Nuestro enfoque combina técnica procesal, conocimiento de la jurisprudencia de la Corte Suprema y una estrategia de defensa diseñada para proteger su libertad, su honra y su patrimonio.",
    services: [
      "Defensa penal en delitos comunes y delitos económicos.",
      "Defensa en delitos contra las personas: lesiones, homicidio, violencia intrafamiliar y porte de armas.",
      "Querellas criminales por delitos sufridos por usted o su empresa.",
      "Asesoría a víctimas y querellantes particulares, con foco en obtener reparación efectiva.",
      "Defensa en delitos contra la propiedad: hurto, robo y receptación.",
      "Asesoría en cumplimiento de la Ley N° 20.393 sobre responsabilidad penal de las personas jurídicas.",
      "Recursos de nulidad, apelación, queja y acciones constitucionales."
    ],
    cta: "¿Está siendo investigado, citado o detenido? Contáctenos hoy. La defensa temprana es la diferencia entre un mal y un buen resultado."
  },
  {
    icon: Scale,
    title: "Derecho Civil",
    subtitle: "Soluciones jurídicas sólidas para sus conflictos patrimoniales y contractuales.",
    desc: "El Derecho Civil es el corazón de las relaciones jurídicas entre personas: contratos, propiedad, responsabilidad, sucesiones e indemnizaciones. Nuestro equipo lo asesora tanto en la prevención, mediante la revisión y redacción de contratos, como en la litigación, incluyendo cobros, indemnizaciones, nulidades y juicios de precario. Diseñamos cada estrategia midiendo costos, tiempos y probabilidades reales de éxito.",
    services: [
      "Redacción, revisión y negociación de contratos civiles y comerciales.",
      "Juicios de cobro ejecutivo, ordinario y procedimiento monitorio.",
      "Indemnización de perjuicios por responsabilidad contractual y extracontractual.",
      "Acciones reivindicatorias, posesorias, juicios de precario y juicios de arrendamiento.",
      "Nulidades, resoluciones y rescisiones contractuales.",
      "Sucesiones, posesiones efectivas, particiones de herencia y testamentos.",
      "Tramitación de medidas prejudiciales y precautorias."
    ],
    cta: "Le ayudamos a defender su patrimonio con estrategias procesales claras y resultados medibles."
  },
  {
    icon: Briefcase,
    title: "Derecho Laboral",
    subtitle: "Asesoría laboral para empresas y trabajadores, con foco en resultados.",
    desc: "El Derecho Laboral chileno exige decisiones rápidas y bien fundamentadas. Asesoramos a trabajadores en despidos injustificados, autodespidos, tutela de derechos fundamentales y cobranza de prestaciones; y a empresas en gestión laboral preventiva, reglamentos internos, finiquitos, sumarios y defensa en juicios. Nuestro objetivo es alcanzar la mejor solución, sea en negociación o en tribunales.",
    services: [
      "Demandas por despido injustificado, indebido o improcedente.",
      "Tutela laboral por vulneración de derechos fundamentales.",
      "Autodespido y cobro de prestaciones adeudadas.",
      "Reclamos administrativos ante la Dirección del Trabajo e Inspección del Trabajo.",
      "Procedimientos por accidentes del trabajo y enfermedades profesionales.",
      "Asesoría a empleadores: contratos, reglamentos internos, finiquitos, sumarios y defensa judicial.",
      "Negociación colectiva y resolución de conflictos laborales."
    ],
    cta: "Ya sea como trabajador o como empresa, evalúe su caso con un equipo que litiga y negocia en igual medida."
  },
  {
    icon: Heart,
    title: "Derecho de Familia",
    subtitle: "Acompañamiento jurídico cercano en los momentos más sensibles de la vida.",
    desc: "Los conflictos de familia exigen sensibilidad, prudencia y la mejor técnica jurídica. Asesoramos en divorcios, alimentos, cuidado personal, relación directa y regular, violencia intrafamiliar y filiación, combinando experiencia procesal en los Juzgados de Familia con un trato humano, reservado y estratégico.",
    services: [
      "Divorcios de común acuerdo, unilaterales y por culpa.",
      "Pensión de alimentos: demandas, aumentos, rebajas y cese.",
      "Cuidado personal de niños, niñas y adolescentes.",
      "Relación directa y regular.",
      "Violencia intrafamiliar: medidas cautelares y denuncias.",
      "Filiación, reconocimiento de paternidad e impugnación.",
      "Acuerdo de Unión Civil y régimen patrimonial del matrimonio.",
      "Adopción y autorización de salida del país."
    ],
    cta: "Conversemos su caso con la reserva y la cercanía que merece. Su tranquilidad es nuestra prioridad."
  },
  {
    icon: Building2,
    title: "Derecho Corporativo",
    subtitle: "Su socio jurídico para constituir, operar y hacer crecer su empresa.",
    desc: "Toda empresa necesita una estructura jurídica sólida. Acompañamos a emprendedores, pymes y empresas consolidadas en la constitución, modificación y transformación de sociedades, pactos de accionistas, contratos comerciales, acuerdos de confidencialidad, fusiones y adquisiciones, gobierno corporativo y compliance.",
    services: [
      "Constitución de sociedades: SpA, E.I.R.L, LTDA y S.A.",
      "Pactos de socios y de accionistas.",
      "Redacción y negociación de contratos comerciales.",
      "Fusiones, adquisiciones, reorganizaciones empresariales y due diligence.",
      "Asesoría en gobierno corporativo y directorios.",
      "Implementación de programas de compliance.",
      "Disolución, liquidación y reorganización de sociedades.",
      "Asesoría continua a empresas como abogados externos de confianza."
    ],
    cta: "Estructure su empresa hoy con la asesoría que protegerá su patrimonio mañana."
  },
  {
    icon: Landmark,
    title: "Derecho Inmobiliario",
    subtitle: "Seguridad jurídica en cada compraventa, arrendamiento y proyecto inmobiliario.",
    desc: "Una propiedad mal estudiada es un riesgo patrimonial enorme. Realizamos estudios de títulos, redactamos y revisamos compraventas, promesas, arriendos y leasings, y asesoramos a inmobiliarias, propietarios y compradores en transacciones de cualquier escala. También representamos en conflictos por arriendos, deslindes, servidumbres y comunidades de copropiedad.",
    services: [
      "Estudio de títulos y saneamiento de la propiedad.",
      "Redacción y revisión de promesas y contratos de compraventa.",
      "Contratos de arrendamiento de viviendas, locales comerciales y oficinas.",
      "Juicios de terminación de arriendo, restitución y cobro de rentas.",
      "Asesoría a inmobiliarias en proyectos.",
      "Subdivisiones, fusiones de predios, servidumbres y deslindes.",
      "Ley N° 19.537 sobre copropiedad inmobiliaria.",
      "Regularización de bienes raíces conforme al DL N° 2.695."
    ],
    cta: "Antes de firmar, asesórese. Cada error en un contrato inmobiliario cuesta años de litigio."
  },
  {
    icon: ReceiptText,
    title: "Derecho Tributario",
    subtitle: "Planificación tributaria estratégica y defensa frente al SII.",
    desc: "El cumplimiento tributario es hoy un eje crítico para personas, empresas y profesionales. Asesoramos en planificación tributaria lícita, reorganización de patrimonios, defensa frente a fiscalizaciones del Servicio de Impuestos Internos y litigación en los Tribunales Tributarios y Aduaneros.",
    services: [
      "Planificación tributaria de personas naturales y empresas.",
      "Asesoría en regímenes tributarios.",
      "Defensa ante fiscalizaciones, citaciones y liquidaciones del SII.",
      "Reclamos tributarios y aduaneros ante los TTA y Cortes superiores.",
      "Reorganizaciones empresariales con enfoque tributario.",
      "Cumplimiento tributario y prevención de contingencias.",
      "Devoluciones de impuestos, condonaciones y convenios de pago.",
      "Asesoría en herencias, donaciones y sucesiones con foco tributario."
    ],
    cta: "Una buena planificación tributaria, hecha a tiempo, puede ahorrarle millones. Conversemos."
  }
];
const INDICE_POR_AREA = areas.reduce(
  (acc, a, i) => ({ ...acc, [AREA_KEY[a.title]]: i }),
  {}
);
const PracticeAreas = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const abrir = (area) => {
      const i = INDICE_POR_AREA[area];
      if (i !== void 0) setActive(i);
    };
    const pendiente2 = consumePendingArea();
    if (pendiente2) abrir(pendiente2);
    return onFocusArea(abrir);
  }, []);
  return /* @__PURE__ */ jsx("section", { id: "areas", className: "section-padding bg-card", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.55 },
        className: "text-center max-w-4xl mx-auto mb-16",
        children: [
          /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4", children: "Áreas de práctica" }),
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight", children: "Soluciones legales integrales para personas y empresas" }),
          /* @__PURE__ */ jsx("div", { className: "w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-8" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg md:text-xl leading-relaxed", children: "Presentamos nuestras principales áreas de práctica, redactadas con un enfoque claro, estratégico y orientado a resultados. Nuestro estudio asesora y representa a clientes en materias penales, civiles, laborales, familiares, corporativas, inmobiliarias y tributarias." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-4 space-y-3", children: areas.map((area, i) => /* @__PURE__ */ jsx(
        motion.button,
        {
          initial: { opacity: 0, x: -18 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.05 },
          onClick: () => setActive(i),
          "aria-expanded": active === i,
          className: `w-full text-left rounded-2xl border p-5 transition-all duration-300 group ${active === i ? "bg-background border-primary/40 shadow-hover" : "bg-background/70 border-border shadow-soft hover:shadow-hover hover:border-primary/20"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `w-12 h-12 rounded-xl flex items-center justify-center transition ${active === i ? "bg-primary/10" : "bg-primary/5"}`,
                children: /* @__PURE__ */ jsx(area.icon, { className: "w-6 h-6 text-primary" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-serif text-lg font-semibold text-foreground", children: area.title }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm line-clamp-1", children: area.subtitle })
            ] }),
            /* @__PURE__ */ jsx(
              ChevronRight,
              {
                className: `w-5 h-5 text-primary transition-transform ${active === i ? "rotate-90" : ""}`
              }
            )
          ] })
        },
        area.title
      )) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-8", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: active !== null && /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -18 },
          transition: { duration: 0.35 },
          className: "relative rounded-3xl p-[2px] bg-gradient-to-br from-[#A12341] to-[#0F3B47] shadow-soft",
          children: /* @__PURE__ */ jsxs("div", { className: "bg-background rounded-[22px] p-7 md:p-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-start gap-5 mb-8", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: (() => {
                const Icon = areas[active].icon;
                return /* @__PURE__ */ jsx(Icon, { className: "w-8 h-8 text-primary" });
              })() }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-primary/70 font-semibold text-sm tracking-widest uppercase mb-2", children: [
                  active + 1,
                  ". Área de práctica"
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "font-serif text-3xl md:text-4xl font-bold text-foreground mb-3", children: areas[active].title }),
                /* @__PURE__ */ jsx("p", { className: "text-primary font-semibold italic", children: areas[active].subtitle })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg leading-relaxed mb-8", children: areas[active].desc }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-8", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-serif text-xl font-semibold text-foreground mb-5", children: "Servicios principales" }),
              /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-3", children: areas[active].services.map((service) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-start gap-3 rounded-xl bg-card border border-border/70 p-4",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" }),
                    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: service })
                  ]
                },
                service
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-2xl bg-card border border-primary/20 p-6", children: [
              /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-widest uppercase mb-2", children: "Llamado a la acción" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground font-medium leading-relaxed mb-5", children: areas[active].cta }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => prefillArea(AREA_KEY[areas[active].title]),
                  className: "inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition",
                  children: [
                    "Consultar ahora",
                    /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 ml-2" })
                  ]
                }
              )
            ] })
          ] })
        },
        areas[active].title
      ) }) })
    ] })
  ] }) });
};
const reasons = [
  {
    n: "01",
    title: "Trayectoria y especialización",
    desc: "Abogados con experiencia real en tribunales, especializados por área. Sabemos dónde y cómo se gana cada caso."
  },
  {
    n: "02",
    title: "Atención directa del abogado",
    desc: "Hablas siempre con el abogado que lleva tu causa, no con intermediarios. Sin derivaciones a terceros."
  },
  {
    n: "03",
    title: "Protocolo de respuesta inmediata",
    desc: "En materia penal cada hora cuenta. Tenemos disponibilidad para actuar desde el primer minuto, incluso 24/7 en urgencias."
  },
  {
    n: "04",
    title: "Confidencialidad absoluta",
    desc: "Toda tu información está protegida por el secreto profesional. Tu caso se trata con la máxima reserva."
  }
];
const WhyChooseUs = () => /* @__PURE__ */ jsx("section", { id: "por-que-elegirnos", className: "section-padding bg-background", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto container-padding", children: [
  /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto mb-14", children: [
    /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4", children: "Por qué elegirnos" }),
    /* @__PURE__ */ jsx("h2", { className: "font-heading text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight", children: "Razones para confiar su caso a nuestro estudio" }),
    /* @__PURE__ */ jsx("div", { className: "w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto" })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: reasons.map((r, i) => /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay: i * 0.08, duration: 0.5 },
      className: "bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1",
      children: [
        /* @__PURE__ */ jsx("span", { className: "font-heading text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#A12341] to-[#0F3B47]", children: r.n }),
        /* @__PURE__ */ jsx("h3", { className: "font-heading text-xl font-semibold text-foreground mt-4 mb-2", children: r.title }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: r.desc })
      ]
    },
    r.n
  )) })
] }) });
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const TEAM = [
  {
    slug: "ignacio-arteaga",
    name: "Ignacio Arteaga C.",
    role: "Socio fundador",
    image: "/equipo/ignacio-arteaga.webp",
    areas: [
      "Derecho Penal",
      "Derecho Civil",
      "Derecho Administrativo",
      "Derechos Humanos",
      "Derecho Financiero"
    ],
    bio: "Ignacio Arteaga Casanova es socio fundador del estudio y abogado litigante, experto en juicios contra el Estado, con una trayectoria profesional desarrollada desde 1994. Su práctica se concentra en Derecho Penal, Civil, Administrativo, Financiero y Derechos Humanos, asesorando y representando a personas y organizaciones en asuntos de alta complejidad, con una visión estratégica, rigurosa y comprometida con la defensa de sus derechos.",
    formacion: [
      "Abogado, Universidad Central de Chile, 1994.",
      "Diplomado Reforma Procesal Penal, 2004.",
      "Magíster en Derecho Penal y Procesal, 2010."
    ],
    contacto: {
      telefono: "+56 9 9977 4936",
      correo: "abogados@arteagayaldunate.cl"
    }
  },
  {
    slug: "patricio-aldunate",
    name: "Patricio Aldunate C.",
    role: "Socio administrador",
    image: "/equipo/patricio-aldunate.webp",
    areas: [
      "Derecho Penal",
      "Derecho Laboral",
      "Derecho Civil",
      "Negociación y solución de controversias"
    ],
    bio: "Patricio Aldunate es socio administrador del estudio y concentra su práctica en litigios penales y laborales. Asesora a personas y empresas en la prevención y resolución de conflictos, combinando una estrategia jurídica rigurosa con una atención cercana y orientada a resultados.",
    formacion: [
      "Abogado, Universidad Mayor, 2022.",
      "Diplomado en Derecho Penal Económico, Pontificia Universidad Católica de Chile, 2025.",
      "Diplomado en Litigación ante Tribunales Ordinarios y Superiores de Justicia, Pontificia Universidad Católica de Chile, 2026."
    ],
    contacto: {
      telefono: "+56 9 9533 6140",
      correo: "paldunate.abogado@gmail.com",
      linkedin: "https://linkedin.com/in/patricioaldunatecontreras/"
    }
  },
  {
    slug: "jose-pereira",
    name: "José Pereira V.",
    role: "Asociado",
    image: "/equipo/jose-pereira.webp",
    areas: ["Derecho Corporativo", "Derecho Inmobiliario", "Derecho Civil"],
    bio: "José Pereira se incorporó al estudio en 2025. Su práctica se enfoca en la asesoría de personas y empresas en materias civiles, comerciales, societarias, contractuales e inmobiliarias, con especial atención a la prevención de contingencias y al diseño de soluciones jurídicas claras y eficientes.",
    formacion: ["Abogado, Universidad Diego Portales, 2022."],
    contacto: {
      telefono: "+56 9 6641 6504",
      correo: "jpereirav.abogado@gmail.com",
      linkedin: "https://linkedin.com/in/josepereirav/"
    }
  },
  {
    slug: "fabian-gomez",
    name: "Fabián Gómez R.",
    role: "Asociado",
    image: "/equipo/fabian-gomez.webp",
    areas: [
      "Derecho Tributario",
      "Procedimientos Concursales",
      "Derecho Civil"
    ],
    bio: "Fabián Gómez se incorporó al estudio en 2026. Su práctica se concentra en materias tributarias, civiles y concursales, brindando asesoría a personas y empresas en la evaluación de contingencias, reorganización de obligaciones y búsqueda de soluciones jurídicas sostenibles.",
    // El "Diplomado en Gestión Tributaria, 2024" queda fuera a propósito: la
    // ficha original pide confirmar la institución antes de publicarlo.
    formacion: ["Abogado, Universidad Andrés Bello, 2020."],
    contacto: {
      telefono: "+56 2 2391 2030",
      correo: "fabiangomezretamal@gmail.com",
      linkedin: "https://linkedin.com/in/fabian-gomez-retamal/"
    }
  },
  {
    slug: "marta-garasa",
    name: "Marta Garasa G.",
    role: "Asociada",
    image: "/equipo/marta-garasa.webp",
    areas: ["Derecho de Familia", "Derecho Penal", "Solución de controversias"],
    bio: "Marta Garasa se incorporó al estudio en 2024. Su práctica se enfoca en litigios de familia y penales, incluyendo asuntos de especial complejidad y alta sensibilidad. Entrega una asesoría estratégica, cercana y comprometida con la protección de los intereses de cada cliente.",
    formacion: ["Abogada, Universidad Bolivariana, 2022."],
    contacto: {
      telefono: "+56 9 8668 5396",
      correo: "garasa.abogada@gmail.com",
      linkedin: "https://linkedin.com/in/marta-garasa-ab8981124/"
    }
  },
  {
    slug: "camilo-henriquez",
    name: "Camilo Henríquez P.",
    role: "Asociado",
    image: "/equipo/camilo-henriquez.webp",
    areas: [
      "Policía Local",
      "Derecho Inmobiliario",
      "Derecho Civil",
      "Derecho Penal"
    ],
    // La ficha original mezclaba primera y tercera persona; se unifica en
    // tercera para que calce con el resto del equipo.
    bio: "Camilo Henríquez se incorporó al estudio en 2025 y se especializa en Policía Local, Derecho Inmobiliario, contratos, Derecho Civil y Derecho Penal. Tiene experiencia como litigante, reforzada por su diplomado en la Universidad de los Andes. Su paso por la Fiscalía Local de La Florida fue fundamental para consolidar su competencia y manejar casos con eficiencia, orientando su ejercicio a un servicio de excelencia en el cumplimiento de su obligación de medio.",
    formacion: [
      "Abogado, Universidad Pedro de Valdivia, 2020.",
      "Diplomado en Derecho Penal, Universidad de Los Andes, 2022."
    ],
    contacto: {
      telefono: "+56 9 3072 8146",
      correo: "camilo.henriquezp@gmail.com",
      linkedin: "https://www.linkedin.com/in/camilo-henr%C3%ADquez-puentes-0b7225278/"
    }
  },
  {
    slug: "kony-pedreros",
    name: "Kony Pedreros G.",
    role: "Asesora externa",
    image: "/equipo/kony-pedreros.webp",
    areas: ["Fraude bancario", "Delitos económicos", "Ciberdelitos"],
    bio: "Kony Pedreros se incorporó al estudio jurídico en 2024 como asesora externa. Ingeniera en Informática, aporta una mirada técnica especializada en fraude bancario, delitos económicos y ciberdelitos. Su labor se orienta al análisis de antecedentes digitales y transacciones, la identificación de patrones de fraude y el apoyo técnico en asuntos que requieren integrar criterios informáticos y jurídicos.",
    formacion: [
      "Ingeniera en Informática, Universidad Tecnológica de Chile INACAP, 2020.",
      "Diplomado en Gestión Ágil de Proyectos, Pontificia Universidad Católica de Chile, 2024.",
      "Diplomado en Transformación de Empresas, Pontificia Universidad Católica de Chile, 2023."
    ],
    contacto: {
      telefono: "+56 9 6499 4292",
      correo: "konypedreros@gmail.com",
      linkedin: "https://www.linkedin.com/in/kony-pedreros-gonz%C3%A1lez/"
    }
  }
];
const TeamSection = () => {
  const [selected, setSelected] = useState(null);
  return /* @__PURE__ */ jsxs("section", { id: "equipo", className: "section-padding bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto container-padding", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3", children: "Profesionales" }),
        /* @__PURE__ */ jsx("h3", { className: "font-serif text-3xl md:text-5xl font-bold text-foreground", children: "Nuestro Equipo" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5", children: TEAM.map((member) => /* @__PURE__ */ jsx(
        Card,
        {
          className: "group overflow-hidden rounded-xl border border-border bg-card\n              shadow-soft transition-all duration-300 hover:shadow-hover hover:-translate-y-1",
          children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSelected(member),
              "aria-label": `Ver detalle de ${member.name}`,
              className: "block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-muted", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: member.image,
                      alt: `${member.name}, ${member.role}`,
                      loading: "lazy",
                      width: 480,
                      height: 640,
                      className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute inset-0 bg-legal-dark/55 opacity-0 group-hover:opacity-100\n                    group-focus-within:opacity-100 transition-opacity duration-300\n                    flex items-end justify-center pb-4",
                      children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-legal-dark", children: [
                        /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                        " Ver detalle"
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-serif text-sm font-semibold text-foreground leading-tight", children: member.name }),
                  /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-primary font-medium mt-0.5", children: member.role })
                ] })
              ]
            }
          )
        },
        member.slug
      )) })
    ] }),
    /* @__PURE__ */ jsx(
      Dialog,
      {
        open: selected !== null,
        onOpenChange: (open) => !open && setSelected(null),
        children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-2xl max-h-[85vh] overflow-y-auto", children: selected && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: selected.image,
                alt: "",
                width: 480,
                height: 640,
                className: "w-20 h-[6.7rem] shrink-0 rounded-lg object-cover bg-muted"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx(DialogTitle, { className: "font-serif text-xl text-foreground", children: selected.name }),
              /* @__PURE__ */ jsx(DialogDescription, { className: "text-primary font-medium", children: selected.role }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 mt-3", children: selected.areas.map((area) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary",
                  children: area
                },
                area
              )) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 pt-2", children: [
            /* @__PURE__ */ jsxs("section", { children: [
              /* @__PURE__ */ jsx("h5", { className: "font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2", children: "Experiencia profesional" }),
              /* @__PURE__ */ jsx("p", { className: "font-body text-sm text-foreground/85 leading-relaxed", children: selected.bio })
            ] }),
            /* @__PURE__ */ jsxs("section", { children: [
              /* @__PURE__ */ jsx("h5", { className: "font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2", children: "Formación académica" }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: selected.formacion.map((item) => /* @__PURE__ */ jsx(
                "li",
                {
                  className: "font-body text-sm text-foreground/85 leading-relaxed pl-4 relative\n                        before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1\n                        before:rounded-full before:bg-primary",
                  children: item
                },
                item
              )) })
            ] }),
            /* @__PURE__ */ jsxs("section", { children: [
              /* @__PURE__ */ jsx("h5", { className: "font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2", children: "Contacto" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                selected.contacto.telefono && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `tel:${selected.contacto.telefono.replace(/\s/g, "")}`,
                    className: "inline-flex items-center gap-2 font-body text-sm text-foreground/85 hover:text-primary transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-primary shrink-0" }),
                      selected.contacto.telefono
                    ]
                  }
                ),
                selected.contacto.correo && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `mailto:${selected.contacto.correo}`,
                    className: "inline-flex items-center gap-2 font-body text-sm text-foreground/85 hover:text-primary transition-colors break-all",
                    children: [
                      /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-primary shrink-0" }),
                      selected.contacto.correo
                    ]
                  }
                ),
                selected.contacto.linkedin && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: selected.contacto.linkedin,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-2 font-body text-sm text-foreground/85 hover:text-primary transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Linkedin, { className: "w-4 h-4 text-primary shrink-0" }),
                      "Perfil de LinkedIn"
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] }) })
      }
    )
  ] });
};
const testimonials = [
  {
    initials: "M.R.",
    area: "Derecho Penal",
    stars: 5,
    text: "Desde la primera llamada me explicaron todo con claridad y estuvieron disponibles cuando más lo necesitaba. Me sentí acompañada en todo el proceso."
  },
  {
    initials: "J.C.",
    area: "Derecho Laboral",
    stars: 5,
    text: "Respondieron rápido y siempre supe en qué etapa estaba mi caso. Trato directo con el abogado, sin vueltas."
  },
  {
    initials: "P.S.",
    area: "Derecho de Familia",
    stars: 5,
    text: "Un tema muy delicado tratado con respeto y reserva. Agradezco la cercanía y la honestidad en cada consejo."
  },
  {
    initials: "A.G.",
    area: "Derecho Civil",
    stars: 5,
    text: "Profesionales, claros con los honorarios y con los tiempos. Recomiendo el estudio sin dudarlo."
  },
  {
    initials: "R.M.",
    area: "Derecho Penal",
    stars: 5,
    text: "Actuaron de inmediato en una situación urgente. Su rapidez marcó la diferencia."
  },
  {
    initials: "C.V.",
    area: "Derecho Tributario",
    stars: 5,
    text: "Me orientaron con paciencia frente al SII y entendí cada paso. Excelente asesoría."
  }
];
const TestimonialsSection = () => /* @__PURE__ */ jsx("section", { id: "testimonios", className: "section-padding bg-card", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto container-padding", children: [
  /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto mb-14", children: [
    /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4", children: "Testimonios" }),
    /* @__PURE__ */ jsx("h2", { className: "font-heading text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight", children: "Lo que dicen quienes confiaron en nosotros" }),
    /* @__PURE__ */ jsx("div", { className: "w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-6" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Testimonios reales de clientes, anonimizados para resguardar su privacidad y el secreto profesional." })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: testimonials.map((t, i) => /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay: i * 0.06, duration: 0.5 },
      className: "bg-background border border-border rounded-2xl p-7 shadow-soft flex flex-col",
      children: [
        /* @__PURE__ */ jsx(Quote, { className: "w-8 h-8 text-primary/30 mb-3" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground leading-relaxed flex-grow", children: [
          '"',
          t.text,
          '"'
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 my-4", children: Array.from({ length: t.stars }).map((_, s) => /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-primary text-primary" }, s)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-t border-border pt-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-full bg-gradient-to-br from-[#A12341] to-[#0F3B47] text-white flex items-center justify-center font-semibold text-sm", children: t.initials }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
              "Cliente ",
              t.initials
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: t.area })
          ] })
        ] })
      ]
    },
    i
  )) })
] }) });
const CATEGORY_ICONS = {
  "Derecho Penal": Scale,
  "Derecho Laboral": Briefcase,
  "Derecho de Familia": Heart
};
const BlogSection = () => {
  const posts2 = getAllPosts().slice(0, 3);
  return /* @__PURE__ */ jsx("section", { id: "blog", className: "section-padding bg-background", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto container-padding", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4", children: "Blog legal" }),
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight", children: "Información legal clara para tomar mejores decisiones" }),
      /* @__PURE__ */ jsx("div", { className: "w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-8" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto", children: "Publicamos contenidos prácticos sobre materias penales, civiles, laborales, familiares, corporativas y tributarias, para orientar a personas y empresas antes de tomar una decisión legal relevante." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: posts2.map((post) => {
      const Icon = CATEGORY_ICONS[post.category] ?? FileText;
      return /* @__PURE__ */ jsx(
        Card,
        {
          className: "group overflow-hidden bg-card border border-border shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-2",
          children: /* @__PURE__ */ jsxs(Link$1, { to: `/blog/${post.slug}`, className: "block p-7", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-13 h-13 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition", children: /* @__PURE__ */ jsx(Icon, { className: "w-7 h-7 text-primary" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm", children: [
                /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: formatPostDate(post.date) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3", children: post.category }),
            /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl md:text-2xl font-bold text-foreground mb-4 leading-snug", children: post.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: post.excerpt }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-primary font-semibold group-hover:underline", children: [
              "Leer más",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" })
            ] })
          ] })
        },
        post.slug
      );
    }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 text-center", children: /* @__PURE__ */ jsxs(
      Link$1,
      {
        to: "/blog",
        className: "inline-flex items-center justify-center rounded-xl border border-primary/30 px-7 py-4 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition",
        children: [
          "Ver todos los artículos",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
        ]
      }
    ) })
  ] }) });
};
const selectCls = "w-full h-11 rounded-md border border-border bg-background px-3 text-sm focus:border-legal-primary focus:outline-none";
const inputCls = "w-full h-11 rounded-md border border-border bg-background px-3 text-sm focus:border-legal-primary focus:outline-none";
const ContactForm = () => {
  const { toast: toast2 } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: { horario: "cualquiera", website: "" }
  });
  const area = watch("area");
  useEffect(() => onPrefillArea((a) => setValue("area", a, { shouldValidate: false })), [setValue]);
  const onSubmit = async (values2) => {
    if (values2.website) return;
    const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTIONS.contacto);
    const res = await submitLead({
      ...values2,
      servicio: "legal",
      recaptchaToken,
      recaptchaAction: RECAPTCHA_ACTIONS.contacto
    });
    if (res.ok) {
      toast2({
        title: "Consulta enviada",
        description: "Gracias por contactarnos. Te responderemos a la brevedad."
      });
      reset({ horario: "cualquiera", website: "" });
    } else {
      toast2({ title: "Error al enviar", description: res.message, variant: "destructive" });
    }
  };
  const err = (k) => {
    var _a;
    return errors[k] ? /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs mt-1", children: (_a = errors[k]) == null ? void 0 : _a.message }) : null;
  };
  return /* @__PURE__ */ jsx(Card, { className: "p-8 shadow-card-soft border-0", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", noValidate: true, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-heading text-xl font-bold text-legal-dark mb-1", children: "Cuéntanos tu caso" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Los campos con * son obligatorios." })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        tabIndex: -1,
        autoComplete: "off",
        className: "hidden",
        "aria-hidden": "true",
        ...register("website")
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Nombre completo *" }),
        /* @__PURE__ */ jsx("input", { id: "name", className: inputCls, placeholder: "Tu nombre completo", ...register("name") }),
        err("name")
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "phone", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Teléfono *" }),
        /* @__PURE__ */ jsx("input", { id: "phone", className: inputCls, placeholder: "+56 9 XXXX XXXX", ...register("phone") }),
        err("phone")
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Correo electrónico *" }),
      /* @__PURE__ */ jsx("input", { id: "email", type: "email", className: inputCls, placeholder: "tu@email.com", ...register("email") }),
      err("email")
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "area", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Área / Tipo de causa *" }),
        /* @__PURE__ */ jsxs("select", { id: "area", className: selectCls, defaultValue: "", ...register("area"), children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Selecciona un área" }),
          AREAS.map((a) => /* @__PURE__ */ jsx("option", { value: a, children: AREA_LABELS[a] }, a))
        ] }),
        err("area")
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "urgencia", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Urgencia *" }),
        /* @__PURE__ */ jsxs("select", { id: "urgencia", className: selectCls, defaultValue: "", ...register("urgencia"), children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Selecciona" }),
          URGENCIAS.map((u) => /* @__PURE__ */ jsx("option", { value: u, children: URGENCIA_LABELS[u] }, u))
        ] }),
        err("urgencia")
      ] })
    ] }),
    situacionPenalAplica(area) && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "situacionPenal", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Situación actual *" }),
      /* @__PURE__ */ jsxs("select", { id: "situacionPenal", className: selectCls, defaultValue: "", ...register("situacionPenal"), children: [
        /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Selecciona" }),
        PENAL_SITUACIONES.map((s) => /* @__PURE__ */ jsx("option", { value: s.value, children: s.label }, s.value))
      ] }),
      err("situacionPenal")
    ] }),
    materiaFamiliaAplica(area) && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "materiaFamilia", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Materia *" }),
      /* @__PURE__ */ jsxs("select", { id: "materiaFamilia", className: selectCls, defaultValue: "", ...register("materiaFamilia"), children: [
        /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Selecciona" }),
        FAMILIA_MATERIAS.map((s) => /* @__PURE__ */ jsx("option", { value: s.value, children: s.label }, s.value))
      ] }),
      err("materiaFamilia")
    ] }),
    laboralAplica(area) && /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "laboralParte", className: "text-sm font-medium text-legal-dark mb-1 block", children: "¿Trabajador o empresa? *" }),
        /* @__PURE__ */ jsxs("select", { id: "laboralParte", className: selectCls, defaultValue: "", ...register("laboralParte"), children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Selecciona" }),
          LABORAL_PARTE.map((s) => /* @__PURE__ */ jsx("option", { value: s.value, children: s.label }, s.value))
        ] }),
        err("laboralParte")
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "laboralSituacion", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Situación *" }),
        /* @__PURE__ */ jsxs("select", { id: "laboralSituacion", className: selectCls, defaultValue: "", ...register("laboralSituacion"), children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Selecciona" }),
          LABORAL_SITUACIONES.map((s) => /* @__PURE__ */ jsx("option", { value: s.value, children: s.label }, s.value))
        ] }),
        err("laboralSituacion")
      ] })
    ] }),
    area && montoAplica(area) && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "monto", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Monto involucrado" }),
      /* @__PURE__ */ jsxs("select", { id: "monto", className: selectCls, defaultValue: "", ...register("monto"), children: [
        /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Selecciona (opcional)" }),
        MONTO_RANGOS.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: MONTO_LABELS[m] }, m))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "horario", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Mejor horario de contacto" }),
      /* @__PURE__ */ jsx("select", { id: "horario", className: selectCls, ...register("horario"), children: HORARIOS.map((h) => /* @__PURE__ */ jsx("option", { value: h, children: HORARIO_LABELS[h] }, h)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "text-sm font-medium text-legal-dark mb-1 block", children: "Describe tu caso *" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: "message",
          rows: 5,
          className: inputCls + " h-auto py-2 resize-none",
          placeholder: "Cuéntanos brevemente qué ocurrió, si has sido citado, detenido, o necesitas asesoría preventiva...",
          ...register("message")
        }
      ),
      err("message")
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-legal-primary/5 p-4 rounded-lg flex items-start gap-2", children: [
      /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-legal-primary mt-0.5 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx("strong", { children: "Confidencialidad garantizada:" }),
        " la información que compartas está protegida por el secreto profesional del abogado."
      ] })
    ] }),
    /* @__PURE__ */ jsx(Button, { type: "submit", variant: "legal", size: "lg", className: "w-full group", disabled: isSubmitting, children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }),
      " Enviando..."
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Send, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" }),
      " Enviar consulta gratuita"
    ] }) })
  ] }) });
};
const ContactSection = () => {
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "contacto",
      className: "section-padding bg-gradient-to-br from-gray-50 to-white",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto container-padding", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-2 bg-legal-primary/10 text-legal-primary px-4 py-2 rounded-full text-sm font-medium mb-6", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: "Contacto" })
          ] }),
          /* @__PURE__ */ jsxs("h2", { className: "font-heading text-3xl lg:text-4xl font-bold text-legal-dark leading-tight mb-6", children: [
            "Agenda tu",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient-legal", children: "consulta gratuita" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed", children: "Estamos aquí para ayudarte. Contáctanos para una evaluación gratuita de tu caso y conoce cómo podemos proteger tus derechos." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsx(Card, { className: "p-6 hover-lift shadow-card-soft border-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-legal-primary/10 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(MapPin, { className: "w-6 h-6 text-legal-primary" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-bold text-legal-dark mb-2", children: "Nuestra Oficina" }),
                /* @__PURE__ */ jsxs("p", { className: "font-body text-muted-foreground", children: [
                  "Bombero Salas N° 1369, oficina 701",
                  /* @__PURE__ */ jsx("br", {}),
                  "Santiago, Chile"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "font-body text-sm text-muted-foreground mt-2", children: "Sector Metro Universidad de Chile" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "p-6 hover-lift shadow-card-soft border-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Phone, { className: "w-6 h-6 text-accent" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-bold text-legal-dark mb-2", children: "Teléfono y WhatsApp" }),
                /* @__PURE__ */ jsx("p", { className: "font-body text-legal-primary font-semibold text-lg", children: "+56 9 9533 6140 - +56 9 6641 6504" }),
                /* @__PURE__ */ jsx("p", { className: "font-body text-sm text-muted-foreground mt-1", children: "Disponible para WhatsApp las 24 horas" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "p-6 hover-lift shadow-card-soft border-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6 text-accent" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-bold text-legal-dark mb-2", children: "Correo electrónico" }),
                /* @__PURE__ */ jsx("p", { className: "font-body text-legal-primary font-semibold text-lg", children: "abogados@arteagayaldunate.cl" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(Card, { className: "p-6 hover-lift shadow-card-soft border-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-legal-primary/10 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6 text-legal-primary" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-bold text-legal-dark mb-2", children: "Horarios de Atención" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 font-body text-muted-foreground", children: [
                  /* @__PURE__ */ jsx("p", { children: "Lunes a Viernes: 9:00 - 18:00" }),
                  /* @__PURE__ */ jsx("p", { className: "text-legal-primary font-medium", children: "Emergencias: 24/7" })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-legal text-white p-6 rounded-xl", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-bold mb-2", children: "¿Necesitas atención inmediata?" }),
              /* @__PURE__ */ jsx("p", { className: "font-body text-sm opacity-90 mb-4", children: "Si has sido detenido o citado a declarar, contáctanos inmediatamente. La primera hora es crucial en cualquier proceso penal." }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "secondary",
                  size: "sm",
                  onClick: () => window.open("https://wa.me/56995336140", "_blank"),
                  children: "WhatsApp de emergencia"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(ContactForm, {})
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-12", children: /* @__PURE__ */ jsx(Card, { className: "p-4 shadow-card-soft border-0", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-legal-soft rounded-lg h-64 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-12 h-12 text-legal-primary mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-bold text-legal-dark mb-2", children: "Estamos en el centro de Santiago" }),
          /* @__PURE__ */ jsx("p", { className: "font-body text-muted-foreground", children: "Bombero Salas N° 1369, oficina 701 - Metro Universidad de Chile" })
        ] }) }) }) })
      ] })
    }
  );
};
const SOCIALS = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Facebook", href: "#", Icon: Facebook }
];
const Footer = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const scrollToSection = useSectionNav();
  return /* @__PURE__ */ jsx("footer", { className: "bg-legal-dark text-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto container-padding", children: [
    /* @__PURE__ */ jsxs("div", { className: "py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3 mb-6", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/logo_blanco.png",
            alt: "Defensa legal",
            className: "max-h-44 w-auto object-contain"
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "font-body text-gray-300 leading-relaxed mb-6 max-w-md", children: "Estudio jurídico especializado en derecho penal chileno. Protegemos tu libertad y derechos con profesionalismo, ética y experiencia comprobada." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 text-legal-primary" }),
            /* @__PURE__ */ jsx("span", { className: "font-body text-gray-300", children: "+56 9 9533 6140" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col space-y-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-legal-primary" }),
            /* @__PURE__ */ jsx("span", { className: "font-body text-gray-300", children: "abogados@arteagayaldunate.cl" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-legal-primary" }),
            /* @__PURE__ */ jsx("span", { className: "font-body text-gray-300", children: "Bombero Salas 1369, of. 701, Santiago" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 mt-6", children: SOCIALS.map(({ label, href, Icon }) => /* @__PURE__ */ jsx(
          "a",
          {
            href,
            "aria-label": label,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-gray-300 hover:text-legal-primary transition-colors",
            children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" })
          },
          label
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "font-heading text-lg font-bold mb-6", children: "Enlaces Rápidos" }),
        /* @__PURE__ */ jsx("nav", { className: "space-y-3", children: [
          { label: "Inicio", id: "hero" },
          { label: "Quiénes somos", id: "nosotros" },
          { label: "Áreas de práctica", id: "areas" },
          { label: "Equipo", id: "equipo" },
          { label: "Contacto", id: "contacto" }
        ].map((item) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => scrollToSection(item.id),
            className: "block font-body text-gray-300 hover:text-legal-primary transition-colors duration-200",
            children: item.label
          },
          item.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "font-heading text-lg font-bold mb-6", children: "Contacto" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-legal-primary" }),
              /* @__PURE__ */ jsx("span", { className: "font-body text-sm font-medium text-gray-200", children: "Horarios" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "font-body text-sm text-gray-300 space-y-1", children: [
              /* @__PURE__ */ jsx("p", { children: "Lun - Vie: 9:00 - 18:00" }),
              /* @__PURE__ */ jsx("p", { className: "text-legal-primary", children: "Emergencias: 24/7" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-legal-primary/10 p-4 rounded-lg", children: [
            /* @__PURE__ */ jsx("h5", { className: "font-body text-sm font-bold text-legal-primary mb-2", children: "Atención de Emergencia" }),
            /* @__PURE__ */ jsx("p", { className: "font-body text-xs text-gray-300", children: "Si has sido detenido o citado, contáctanos inmediatamente por WhatsApp." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "py-6 border-t border-gray-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "font-body text-sm text-gray-400", children: [
          "© ",
          currentYear,
          " Arteaga y Aldunate | Abogados & Asociados. Todos los derechos reservados."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-6 font-body text-sm text-gray-400", children: [
          /* @__PURE__ */ jsx(
            Link$1,
            {
              to: "/privacidad",
              className: "hover:text-legal-primary transition-colors",
              children: "Política de Privacidad"
            }
          ),
          /* @__PURE__ */ jsx(
            Link$1,
            {
              to: "/terminos",
              className: "hover:text-legal-primary transition-colors",
              children: "Términos de Servicio"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-gray-800", children: /* @__PURE__ */ jsxs("p", { className: "font-body text-xs text-gray-500 text-center max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsx("strong", { children: "Aviso Legal:" }),
        " La información contenida en este sitio web tiene carácter meramente informativo y no constituye asesoramiento jurídico. Para obtener asesoramiento específico sobre su caso, es necesario contactar directamente con nuestro estudio jurídico."
      ] }) })
    ] })
  ] }) });
};
const WhatsAppButton = () => {
  const phone = "+56995336140";
  const message = encodeURIComponent("Hola, necesito ayuda legal.");
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: `https://wa.me/${phone}?text=${message}`,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "WhatsApp",
      className: "fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110",
      children: /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-9 w-9 fill-white",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx("path", { d: "M12 0C5.372 0 0 5.373 0 12a11.96 11.96 0 001.686 6.109L0 24l6.178-1.635A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.003a9.95 9.95 0 01-5.082-1.396l-.363-.214-3.67.97.984-3.579-.236-.367A9.938 9.938 0 012.003 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.155-7.152c-.282-.141-1.672-.825-1.931-.919-.26-.096-.45-.141-.639.14-.188.282-.733.918-.899 1.11-.165.188-.33.211-.611.07-.282-.141-1.192-.44-2.27-1.4-.839-.748-1.404-1.673-1.57-1.955-.165-.282-.018-.435.123-.576.127-.126.282-.33.423-.495.141-.165.188-.282.282-.47.094-.188.047-.353-.023-.495-.07-.141-.639-1.539-.875-2.11-.23-.552-.465-.478-.639-.478-.165 0-.353-.024-.541-.024-.188 0-.494.07-.752.353s-.99.968-.99 2.361c0 1.392 1.014 2.739 1.155 2.927.141.188 2 3.07 4.848 4.3.678.294 1.207.47 1.62.601.68.216 1.3.186 1.788.113.545-.08 1.672-.683 1.91-1.34.236-.66.236-1.225.165-1.34-.07-.117-.258-.188-.54-.33z" })
        }
      )
    }
  );
};
const SITE = "https://arteagayaldunate.cl";
const Seo = ({ title, description, path = "/", type = "website" }) => {
  const url = SITE + path;
  const full = `${title} | Arteaga & Aldunate Abogados`;
  return /* @__PURE__ */ jsxs(Head, { children: [
    /* @__PURE__ */ jsx("title", { children: full }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: url }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: full }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: url }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: `${SITE}/logo.png` }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Arteaga & Aldunate Abogados" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "es_CL" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: full }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: `${SITE}/logo.png` })
  ] });
};
const REINTENTOS_MS = [0, 150, 400, 800];
function useScrollToHash() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const timers = REINTENTOS_MS.map(
      (ms) => window.setTimeout(() => {
        var _a;
        (_a = document.getElementById(id)) == null ? void 0 : _a.scrollIntoView({ behavior: "auto" });
      }, ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [hash]);
}
const Index = () => {
  useScrollToHash();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Abogados en Chile",
        description: "Estudio jurídico chileno con defensa penal, laboral, civil, de familia, corporativa y tributaria. Asesoría clara y estrategia desde la primera reunión.",
        path: "/"
      }
    ),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(HeroSection, {}),
      /* @__PURE__ */ jsx(PracticeAreas, {}),
      /* @__PURE__ */ jsx(AboutSection, {}),
      /* @__PURE__ */ jsx(TeamSection, {}),
      /* @__PURE__ */ jsx(WhyChooseUs, {}),
      /* @__PURE__ */ jsx(TestimonialsSection, {}),
      /* @__PURE__ */ jsx(BlogSection, {}),
      /* @__PURE__ */ jsx(ContactSection, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(WhatsAppButton, {})
  ] });
};
const Blog = () => {
  const posts2 = getAllPosts();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Blog jurídico",
        description: "Artículos prácticos sobre derecho penal, laboral, familia y más. Información legal clara del estudio Arteaga & Aldunate.",
        path: "/blog"
      }
    ),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "max-w-6xl mx-auto container-padding pt-32 pb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-14", children: [
        /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4", children: "Blog jurídico" }),
        /* @__PURE__ */ jsx("h1", { className: "font-heading text-4xl md:text-5xl font-bold text-foreground", children: "Información legal clara y actualizada" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: posts2.map((p) => /* @__PURE__ */ jsxs(
        Link$1,
        {
          to: `/blog/${p.slug}`,
          className: "group bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1 flex flex-col",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm mb-3", children: [
              /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: formatPostDate(p.date) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-xs tracking-widest uppercase mb-2", children: p.category }),
            /* @__PURE__ */ jsx("h2", { className: "font-heading text-xl font-bold text-foreground mb-3 leading-snug", children: p.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed flex-grow", children: p.excerpt }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-primary font-semibold mt-4", children: [
              "Leer más",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" })
            ] })
          ]
        },
        p.slug
      )) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : void 0;
  if (!post) return /* @__PURE__ */ jsx(Navigate, { to: "/blog", replace: true });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: post.title,
        description: post.description,
        path: `/blog/${post.slug}`,
        type: "article"
      }
    ),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "max-w-3xl mx-auto container-padding pt-32 pb-20", children: [
      /* @__PURE__ */ jsxs(
        Link$1,
        {
          to: "/blog",
          className: "inline-flex items-center text-primary font-semibold mb-8 hover:underline",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
            " Volver al blog"
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-primary/70 font-semibold text-xs tracking-widest uppercase mb-3", children: post.category }),
      /* @__PURE__ */ jsx("h1", { className: "font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight", children: post.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm mb-10", children: [
        /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { children: formatPostDate(post.date) }),
        post.author && /* @__PURE__ */ jsxs("span", { children: [
          "· ",
          post.author
        ] })
      ] }),
      /* @__PURE__ */ jsx("article", { className: "prose prose-lg max-w-none prose-headings:font-heading prose-a:text-primary", children: /* @__PURE__ */ jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], children: post.content }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const Privacidad = () => /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
  /* @__PURE__ */ jsx(
    Seo,
    {
      title: "Política de Privacidad",
      description: "Política de privacidad y tratamiento de datos personales de Arteaga & Aldunate Abogados.",
      path: "/privacidad"
    }
  ),
  /* @__PURE__ */ jsx(Header, {}),
  /* @__PURE__ */ jsxs("main", { className: "max-w-3xl mx-auto container-padding pt-32 pb-20 prose prose-lg prose-headings:font-heading prose-a:text-primary", children: [
    /* @__PURE__ */ jsx("h1", { children: "Política de Privacidad" }),
    /* @__PURE__ */ jsx("p", { children: "En Arteaga & Aldunate Abogados y Asociados resguardamos la información que nos entregas a través de este sitio. Los datos del formulario de contacto se utilizan exclusivamente para responder tu consulta y no se comparten con terceros." }),
    /* @__PURE__ */ jsx("h2", { children: "Datos que recopilamos" }),
    /* @__PURE__ */ jsx("p", { children: "Nombre, teléfono, correo electrónico y la descripción de tu caso que decidas compartir." }),
    /* @__PURE__ */ jsx("h2", { children: "Confidencialidad" }),
    /* @__PURE__ */ jsx("p", { children: "Toda la información está protegida por el secreto profesional del abogado." }),
    /* @__PURE__ */ jsx("h2", { children: "Contacto" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Para ejercer tus derechos sobre tus datos, escríbenos a",
      " ",
      /* @__PURE__ */ jsx("a", { href: "mailto:abogados@arteagayaldunate.cl", children: "abogados@arteagayaldunate.cl" }),
      "."
    ] })
  ] }),
  /* @__PURE__ */ jsx(Footer, {})
] });
const Terminos = () => /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
  /* @__PURE__ */ jsx(
    Seo,
    {
      title: "Términos de Servicio",
      description: "Términos de uso del sitio de Arteaga & Aldunate Abogados.",
      path: "/terminos"
    }
  ),
  /* @__PURE__ */ jsx(Header, {}),
  /* @__PURE__ */ jsxs("main", { className: "max-w-3xl mx-auto container-padding pt-32 pb-20 prose prose-lg prose-headings:font-heading prose-a:text-primary", children: [
    /* @__PURE__ */ jsx("h1", { children: "Términos de Servicio" }),
    /* @__PURE__ */ jsx("p", { children: "La información de este sitio tiene carácter meramente informativo y no constituye asesoría jurídica. La relación profesional con el estudio se formaliza únicamente mediante un contrato de prestación de servicios." }),
    /* @__PURE__ */ jsx("h2", { children: "Uso del sitio" }),
    /* @__PURE__ */ jsx("p", { children: "El envío del formulario no crea por sí solo una relación abogado-cliente. Hasta que exista un contrato firmado, ninguna consulta realizada por este medio genera obligaciones para el estudio." }),
    /* @__PURE__ */ jsx("h2", { children: "Contenido" }),
    /* @__PURE__ */ jsx("p", { children: "Los artículos publicados en el blog describen reglas generales del ordenamiento jurídico chileno vigentes a la fecha de publicación. Cada caso tiene particularidades que pueden alterar por completo el resultado, por lo que no deben tomarse como recomendación para una situación concreta." })
  ] }),
  /* @__PURE__ */ jsx(Footer, {})
] });
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 mb-4", children: "Oops! Page not found" }),
    /* @__PURE__ */ jsx("a", { href: "/", className: "text-blue-500 hover:text-blue-700 underline", children: "Return to Home" })
  ] }) });
};
const routes = [
  {
    path: "/",
    element: /* @__PURE__ */ jsx(Layout, {}),
    children: [
      { index: true, element: /* @__PURE__ */ jsx(Index, {}), entry: "src/pages/Index.tsx" },
      { path: "blog", element: /* @__PURE__ */ jsx(Blog, {}), entry: "src/pages/Blog.tsx" },
      {
        path: "blog/:slug",
        element: /* @__PURE__ */ jsx(BlogPost, {}),
        entry: "src/pages/BlogPost.tsx",
        getStaticPaths: () => getAllPosts().map((p) => `/blog/${p.slug}`)
      },
      { path: "privacidad", element: /* @__PURE__ */ jsx(Privacidad, {}) },
      { path: "terminos", element: /* @__PURE__ */ jsx(Terminos, {}) },
      // ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
      { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) }
    ]
  }
];
const createRoot = ViteReactSSG({ routes });
export {
  createRoot
};
