# Animación cinematográfica del logo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el logo estático del encabezado por un revelado cinematográfico accesible de cuatro segundos que termina en la firma horizontal de Arteaga & Aldunate.

**Architecture:** Un componente autónomo `AnimatedLogo` contendrá la imagen final, capas decorativas CSS y toda la semántica accesible. `Header` conservará la navegación y delegará únicamente la presentación del logo; CSS con máscaras revela el símbolo, ejecuta el barrido cálido y presenta la firma, con una rama estática para movimiento reducido.

**Tech Stack:** React 18, TypeScript, CSS/Tailwind, Vitest, Testing Library, Vite.

## Global Constraints

- La secuencia dura 4 segundos y se reproduce una vez por carga de página.
- El estado final es el logo horizontal completo y nítido.
- No se agregan video, sonido, dependencias ni repetición infinita.
- `prefers-reduced-motion: reduce` muestra el estado final sin la secuencia completa.
- El encabezado mantiene altura estable y permanece interactivo durante la animación.
- Si el recurso animado falla, `/logo.png` continúa visible como respaldo.
- El texto alternativo exacto es `Arteaga & Aldunate, Abogados y Asociados`.

---

## File Structure

- Create `src/components/AnimatedLogo.tsx`: enlace accesible, imagen de respaldo y capas visuales del revelado.
- Create `src/components/AnimatedLogo.test.tsx`: contrato accesible, clic y comportamiento de movimiento reducido.
- Create `src/components/animated-logo.css`: línea de tiempo, máscaras, resplandor, estados responsive y reducción de movimiento.
- Modify `src/components/Header.tsx`: reemplaza el `<img>` actual por `AnimatedLogo` sin alterar la navegación.

### Task 1: Contrato accesible de `AnimatedLogo`

**Files:**
- Create: `src/components/AnimatedLogo.tsx`
- Create: `src/components/AnimatedLogo.test.tsx`
- Create: `src/components/animated-logo.css`

**Interfaces:**
- Consumes: `onActivate: () => void`, callback proporcionado por `Header`.
- Produces: `AnimatedLogo({ onActivate }: AnimatedLogoProps): JSX.Element`.

- [ ] **Step 1: Write the failing component tests**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AnimatedLogo from "./AnimatedLogo";

const setReducedMotion = (matches: boolean) => {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
};

describe("AnimatedLogo", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("expone la marca y activa la vuelta al inicio", () => {
    setReducedMotion(false);
    const onActivate = vi.fn();
    render(<AnimatedLogo onActivate={onActivate} />);

    const button = screen.getByRole("button", {
      name: "Arteaga & Aldunate, Abogados y Asociados",
    });
    expect(screen.getByAltText("Arteaga & Aldunate, Abogados y Asociados"))
      .toHaveAttribute("src", "/logo.png");
    fireEvent.click(button);
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it("marca la variante estática cuando se prefiere menos movimiento", () => {
    setReducedMotion(true);
    render(<AnimatedLogo onActivate={() => undefined} />);
    expect(screen.getByTestId("animated-logo")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/AnimatedLogo.test.tsx`

Expected: FAIL porque `./AnimatedLogo` todavía no existe.

- [ ] **Step 3: Implement the minimal accessible component**

```tsx
import { useEffect, useState } from "react";
import "./animated-logo.css";

interface AnimatedLogoProps {
  onActivate: () => void;
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const AnimatedLogo = ({ onActivate }: AnimatedLogoProps) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(MOTION_QUERY);
    setReducedMotion(query.matches);
    const update = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return (
    <button
      type="button"
      className="animated-logo"
      aria-label="Arteaga & Aldunate, Abogados y Asociados"
      onClick={onActivate}
    >
      <span
        className="animated-logo__stage"
        data-testid="animated-logo"
        data-reduced-motion={String(reducedMotion)}
      >
        <img
          className="animated-logo__image"
          src="/logo.png"
          alt="Arteaga & Aldunate, Abogados y Asociados"
        />
        <span className="animated-logo__trace" aria-hidden="true" />
        <span className="animated-logo__light" aria-hidden="true" />
      </span>
    </button>
  );
};

export default AnimatedLogo;
```

Create `animated-logo.css` first with only stable geometry so the test target has no layout shift:

```css
.animated-logo { display: inline-flex; flex: 0 0 auto; border: 0; padding: 0; background: transparent; cursor: pointer; }
.animated-logo__stage { position: relative; display: block; width: clamp(9rem, 18vw, 15rem); aspect-ratio: 3 / 1; overflow: hidden; }
.animated-logo__image { width: 100%; height: 100%; object-fit: contain; }
.animated-logo__trace, .animated-logo__light { position: absolute; inset: 0; pointer-events: none; }
```

- [ ] **Step 4: Run the component tests**

Run: `npm test -- src/components/AnimatedLogo.test.tsx`

Expected: 2 tests PASS.

- [ ] **Step 5: Commit the accessible component**

```bash
git add src/components/AnimatedLogo.tsx src/components/AnimatedLogo.test.tsx src/components/animated-logo.css
git commit -m "feat: add accessible animated logo component"
```

### Task 2: Línea de tiempo cinematográfica y movimiento reducido

**Files:**
- Modify: `src/components/animated-logo.css`
- Modify: `src/components/AnimatedLogo.test.tsx`

**Interfaces:**
- Consumes: `data-reduced-motion="true|false"` producido por `AnimatedLogo`.
- Produces: clases `.animated-logo__image`, `.animated-logo__trace` y `.animated-logo__light` con una secuencia única de 4 segundos.

- [ ] **Step 1: Add a failing structural test for decorative layers**

Agregar al primer test:

```tsx
expect(screen.getByTestId("animated-logo").querySelectorAll('[aria-hidden="true"]'))
  .toHaveLength(2);
```

- [ ] **Step 2: Run the focused test**

Run: `npm test -- src/components/AnimatedLogo.test.tsx`

Expected: PASS; esta prueba protege la estructura requerida antes de estilizarla.

- [ ] **Step 3: Implement the complete CSS timeline**

Reemplazar el CSS mínimo por reglas que cumplan exactamente estos hitos:

```css
.animated-logo { display: inline-flex; flex: 0 0 auto; border: 0; padding: 0; background: transparent; cursor: pointer; }
.animated-logo:focus-visible { outline: 2px solid hsl(var(--legal-primary)); outline-offset: 4px; border-radius: .5rem; }
.animated-logo__stage { position: relative; display: block; width: clamp(9rem, 18vw, 15rem); aspect-ratio: 3 / 1; overflow: hidden; isolation: isolate; }
.animated-logo__image { width: 100%; height: 100%; object-fit: contain; animation: logo-reveal 4s cubic-bezier(.22,.61,.36,1) both; }
.animated-logo__trace, .animated-logo__light { position: absolute; inset: 0; pointer-events: none; }
.animated-logo__trace { background: linear-gradient(135deg, transparent 28%, rgba(13,44,107,.75) 48%, transparent 68%); mix-blend-mode: multiply; animation: logo-trace 4s ease-out both; }
.animated-logo__light { inset: 8% -20%; background: linear-gradient(105deg, transparent 38%, rgba(255,191,66,.7) 49%, rgba(255,91,52,.35) 54%, transparent 64%); filter: blur(7px); transform: translateX(-75%); animation: logo-light 4s ease-in-out both; }
@keyframes logo-reveal { 0% { opacity: 0; filter: saturate(.65) brightness(.7); clip-path: inset(40% 47% 40% 47%); } 9% { opacity: .3; } 41% { opacity: .76; clip-path: inset(0 34% 0 0); } 64% { opacity: 1; clip-path: inset(0); filter: saturate(1.08) brightness(1.08); } 81%,100% { opacity: 1; clip-path: inset(0); filter: none; } }
@keyframes logo-trace { 0%,8% { opacity: 0; transform: translateY(16%); } 18% { opacity: .85; } 42% { opacity: .35; transform: translateY(-12%); } 58%,100% { opacity: 0; } }
@keyframes logo-light { 0%,35% { opacity: 0; transform: translateX(-75%); } 42% { opacity: .9; } 64% { opacity: .55; transform: translateX(68%); } 81%,100% { opacity: 0; transform: translateX(85%); } }
.animated-logo__stage[data-reduced-motion="true"] .animated-logo__image { animation: none; opacity: 1; clip-path: none; filter: none; }
.animated-logo__stage[data-reduced-motion="true"] .animated-logo__trace,
.animated-logo__stage[data-reduced-motion="true"] .animated-logo__light { display: none; animation: none; }
@media (max-width: 767px) { .animated-logo__stage { width: clamp(8rem, 38vw, 11rem); } .animated-logo__light { opacity: .65; filter: blur(5px); } }
```

- [ ] **Step 4: Run the component test and build**

Run: `npm test -- src/components/AnimatedLogo.test.tsx && npm run build`

Expected: tests PASS y la construcción termina sin errores TypeScript/CSS.

- [ ] **Step 5: Commit the animation timeline**

```bash
git add src/components/animated-logo.css src/components/AnimatedLogo.test.tsx
git commit -m "feat: animate logo cinematic reveal"
```

### Task 3: Integración estable en `Header`

**Files:**
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Consumes: `AnimatedLogo({ onActivate })` de Task 1.
- Produces: logo animado integrado que llama `scrollTo("hero")`.

- [ ] **Step 1: Add the component import**

```tsx
import AnimatedLogo from "@/components/AnimatedLogo";
```

- [ ] **Step 2: Replace only the existing logo `<img>`**

```tsx
<AnimatedLogo onActivate={() => scrollTo("hero")} />
```

No modificar el `<nav>`, el botón de WhatsApp ni el menú móvil.

- [ ] **Step 3: Run focused and full tests**

Run: `npm test -- src/components/AnimatedLogo.test.tsx && npm test`

Expected: todos los tests PASS.

- [ ] **Step 4: Run lint and production build**

Run: `npm run lint && npm run build`

Expected: ambos comandos terminan con código 0.

- [ ] **Step 5: Manually verify responsive behavior**

Run: `npm run dev`

Verificar en 375×812, 768×1024 y 1440×900:

- El encabezado no cambia de altura durante los cuatro segundos.
- El menú, WhatsApp y el clic en el logo responden durante la animación.
- La secuencia ocurre una vez, termina nítida y no se reinicia al hacer scroll.
- Con movimiento reducido, el logo final aparece inmediatamente.
- Si `/logo.png` no carga, no quedan capas luminosas tapando la navegación.

- [ ] **Step 6: Commit the header integration**

```bash
git add src/components/Header.tsx
git commit -m "feat: integrate animated logo in header"
```

### Task 4: Verificación final contra la especificación

**Files:**
- Verify: `src/components/AnimatedLogo.tsx`
- Verify: `src/components/animated-logo.css`
- Verify: `src/components/Header.tsx`
- Verify: `src/components/AnimatedLogo.test.tsx`

**Interfaces:**
- Consumes: implementación completa de Tasks 1–3.
- Produces: evidencia reproducible de que el cambio está listo.

- [ ] **Step 1: Run all automated checks from a clean process**

Run: `npm test && npm run lint && npm run build`

Expected: todos los comandos terminan con código 0.

- [ ] **Step 2: Inspect the exact diff**

Run: `git diff HEAD~3 --check && git diff HEAD~3 --stat`

Expected: sin errores de espacios; solo aparecen el componente, su CSS, su prueba y la integración en `Header`.

- [ ] **Step 3: Confirm repository status**

Run: `git status --short`

Expected: no hay cambios propios sin registrar; cualquier ruta ajena preexistente se reporta y no se modifica.
