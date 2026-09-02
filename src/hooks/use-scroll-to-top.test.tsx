import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { useScrollToTop } from "./use-scroll-to-top";

const Shell = ({ children }: { children: React.ReactNode }) => {
  useScrollToTop();
  return <>{children}</>;
};

const App = () => (
  <Shell>
    <Routes>
      <Route path="/" element={<Link to="/blog/post">ir al post</Link>} />
      <Route path="/blog/post" element={<p>el post</p>} />
      <Route path="/otra" element={<Link to="/#areas">ir con hash</Link>} />
    </Routes>
  </Shell>
);

describe("useScrollToTop", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it("vuelve arriba al navegar a otra ruta", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    vi.mocked(window.scrollTo).mockClear();

    fireEvent.click(screen.getByText("ir al post"));

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("no interfiere cuando la ruta trae hash (lo maneja useScrollToHash)", () => {
    render(
      <MemoryRouter initialEntries={["/otra"]}>
        <App />
      </MemoryRouter>,
    );
    vi.mocked(window.scrollTo).mockClear();

    fireEvent.click(screen.getByText("ir con hash"));

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
