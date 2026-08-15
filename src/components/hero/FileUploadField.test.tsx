import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUploadField from "./FileUploadField";

/**
 * La subida real se prueba en `src/lib/uploadAdjuntos.test.ts`. Aquí se
 * sustituye por un doble para poder comprobar lo que le toca al componente:
 * que emite hacia arriba las URLs de S3 y no los nombres de archivo.
 *
 * Esa distincion es justo el fallo que estas pruebas dejaban pasar: afirmaban
 * que `onChange` recibia ["test.pdf"], que era el sintoma del bug, no el
 * comportamiento correcto.
 */
const URL_BASE =
  "https://arteagayaldunate-contact-attachments-prod.s3.us-east-1.amazonaws.com/k";

vi.mock("@/lib/uploadAdjuntos", () => ({
  subirAdjuntos: vi.fn(async (files: File[]) => ({
    urls: files.map((f) => `${URL_BASE}/${f.name}`),
  })),
}));

describe("FileUploadField", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Rendering", () => {
    it("renders with default label and props", () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      expect(screen.getByText("Documentos adjuntos")).toBeInTheDocument();
      expect(screen.getByText(/Arrastra archivos o haz clic/)).toBeInTheDocument();
    });

    it("renders with custom label", () => {
      const customLabel = "Sube tus documentos";
      render(
        <FileUploadField value={[]} onChange={mockOnChange} label={customLabel} />
      );

      expect(screen.getByText(customLabel)).toBeInTheDocument();
    });

    it("renders with custom maxFiles and size limits", () => {
      render(
        <FileUploadField
          value={[]}
          onChange={mockOnChange}
          maxFiles={3}
          maxFileSize={50 * 1024 * 1024}
          maxTotalSize={200 * 1024 * 1024}
        />
      );

      expect(screen.getByText(/Máximo 3 archivos/)).toBeInTheDocument();
      expect(screen.getByText(/50 MB cada uno/)).toBeInTheDocument();
      expect(screen.getByText(/200 MB total/)).toBeInTheDocument();
    });

    it("hides file list when no files are uploaded", () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      expect(screen.queryByText(/Archivos seleccionados/)).not.toBeInTheDocument();
    });

    it("shows accepted file formats when no files are uploaded", () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      expect(screen.getByText(/Formatos permitidos/)).toBeInTheDocument();
    });
  });

  describe("File Selection", () => {
    it("accepts file selection via input element", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file = new File(["test"], "test.pdf", { type: "application/pdf" });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([`${URL_BASE}/test.pdf`]);
      });

      expect(screen.getByText("test.pdf")).toBeInTheDocument();
      expect(screen.getByText(/Archivos seleccionados \(1\/5\)/)).toBeInTheDocument();
    });

    it("accepts multiple files at once", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file1 = new File(["test"], "test1.pdf", { type: "application/pdf" });
      const file2 = new File(["test"], "test2.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([`${URL_BASE}/test1.pdf`, `${URL_BASE}/test2.docx`]);
      });

      expect(screen.getByText(/Archivos seleccionados \(2\/5\)/)).toBeInTheDocument();
    });

    it("displays file size in list", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file = new File(["x".repeat(1024 * 100)], "large.pdf", {
        type: "application/pdf",
      });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("large.pdf")).toBeInTheDocument();
        const fileSizeElements = screen.getAllByText(/100 KB/);
        expect(fileSizeElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Drag and Drop", () => {
    it("shows drag-over visual feedback", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const dropZone = screen.getByText(/Arrastra archivos/).closest("div");
      if (!dropZone) throw new Error("Drop zone not found");

      fireEvent.dragEnter(dropZone);

      await waitFor(() => {
        expect(screen.getByText(/Suelta los archivos aquí/)).toBeInTheDocument();
      });
    });

    it("accepts dropped files", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file = new File(["test"], "dropped.pdf", { type: "application/pdf" });
      const dropZone = screen.getByText(/Arrastra archivos/).closest("div");
      if (!dropZone) throw new Error("Drop zone not found");

      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([`${URL_BASE}/dropped.pdf`]);
      });
    });

    it("removes drag-over visual feedback on drop", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file = new File(["test"], "dropped.pdf", { type: "application/pdf" });
      const dropZone = screen.getByText(/Arrastra archivos/).closest("div");
      if (!dropZone) throw new Error("Drop zone not found");

      fireEvent.dragEnter(dropZone);
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

      await waitFor(() => {
        expect(screen.queryByText(/Suelta los archivos aquí/)).not.toBeInTheDocument();
      });
    });
  });

  describe("Validation", () => {
    it("rejects files with unsupported MIME type", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file = new File(["test"], "test.exe", { type: "application/x-msdownload" });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Tipo de archivo no permitido/)).toBeInTheDocument();
      });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("rejects files exceeding maxFileSize", async () => {
      const maxSize = 1024; // 1 KB
      render(
        <FileUploadField
          value={[]}
          onChange={mockOnChange}
          maxFileSize={maxSize}
        />
      );

      const file = new File(["x".repeat(2048)], "toolarge.pdf", {
        type: "application/pdf",
      });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Archivo muy grande/)).toBeInTheDocument();
      });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("rejects files exceeding maxTotalSize", async () => {
      const maxTotal = 1536; // 1.5 KB
      render(
        <FileUploadField
          value={[]}
          onChange={mockOnChange}
          maxTotalSize={maxTotal}
        />
      );

      const file1 = new File(["x".repeat(1024)], "file1.pdf", {
        type: "application/pdf",
      });
      const file2 = new File(["x".repeat(1024)], "file2.pdf", {
        type: "application/pdf",
      });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      // Add first file
      fireEvent.change(input, { target: { files: [file1] } });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([`${URL_BASE}/file1.pdf`]);
      });

      // Try to add second file (1024 + 1024 = 2048 > 1536, should exceed total)
      fireEvent.change(input, { target: { files: [file2] } });

      await waitFor(() => {
        expect(screen.getByText((content) =>
          content.includes("Tamaño total excedido")
        )).toBeInTheDocument();
      });
    });

    it("rejects files when exceeding maxFiles limit", async () => {
      render(
        <FileUploadField
          value={[]}
          onChange={mockOnChange}
          maxFiles={2}
        />
      );

      const files = [
        new File(["test"], "file1.pdf", { type: "application/pdf" }),
        new File(["test"], "file2.pdf", { type: "application/pdf" }),
        new File(["test"], "file3.pdf", { type: "application/pdf" }),
      ];
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files } });

      await waitFor(() => {
        expect(screen.getByText(/Máximo de 2 archivos/)).toBeInTheDocument();
      });

      expect(mockOnChange).toHaveBeenCalledWith([`${URL_BASE}/file1.pdf`, `${URL_BASE}/file2.pdf`]);
    });

    it("respects custom acceptedTypes", () => {
      render(
        <FileUploadField
          value={[]}
          onChange={mockOnChange}
          acceptedTypes={[".pdf", ".jpg"]}
        />
      );

      const input = screen.getByLabelText("File upload input") as HTMLInputElement;
      expect(input).toHaveAttribute("accept", ".pdf,.jpg");
    });
  });

  describe("Error Handling", () => {
    it("displays error prop when provided", () => {
      render(
        <FileUploadField
          value={[]}
          onChange={mockOnChange}
          error="Custom error message"
        />
      );

      expect(screen.getByText("Custom error message")).toBeInTheDocument();
    });

    it("clears local error when removing a file", async () => {
      const { rerender } = render(
        <FileUploadField value={[]} onChange={mockOnChange} />
      );

      // First, add an invalid file to trigger an error
      const invalidFile = new File(["test"], "test.exe", {
        type: "application/x-msdownload",
      });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [invalidFile] } });

      await waitFor(() => {
        expect(screen.getByText(/Tipo de archivo no permitido/)).toBeInTheDocument();
      });

      // Now test with a valid file to add it
      const validFile = new File(["test"], "valid.pdf", {
        type: "application/pdf",
      });
      fireEvent.change(input, { target: { files: [validFile] } });

      await waitFor(() => {
        expect(screen.getByText("valid.pdf")).toBeInTheDocument();
      });

      // Verify error is gone
      expect(screen.queryByText(/Tipo de archivo no permitido/)).not.toBeInTheDocument();

      // Remove the file
      const removeButton = screen.getByLabelText("Remove valid.pdf");
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText("valid.pdf")).not.toBeInTheDocument();
      });
    });

    it("displays first error from multiple validation failures", async () => {
      render(
        <FileUploadField
          value={[]}
          onChange={mockOnChange}
          maxFiles={1}
          maxFileSize={1024}
        />
      );

      const files = [
        new File(["x".repeat(2048)], "toolarge.pdf", {
          type: "application/pdf",
        }),
        new File(["test"], "second.pdf", { type: "application/pdf" }),
      ];
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files } });

      await waitFor(() => {
        const errorText = screen.getByText(/Archivo muy grande/);
        expect(errorText).toBeInTheDocument();
      });
    });
  });

  describe("File Removal", () => {
    it("removes file from list when clicking remove button", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file = new File(["test"], "test.pdf", { type: "application/pdf" });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([`${URL_BASE}/test.pdf`]);
      });

      const removeButton = screen.getByLabelText(/Remove test.pdf/);
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([]);
      });

      expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
    });

    it("disables remove button when component is disabled", async () => {
      // La lista ya no se deriva de `value`: se llena subiendo archivos, que
      // es lo unico que produce una URL real de S3.
      const { rerender } = render(
        <FileUploadField value={[]} onChange={mockOnChange} />
      );

      const file = new File(["test"], "test.pdf", { type: "application/pdf" });
      fireEvent.change(
        screen.getByLabelText("File upload input") as HTMLInputElement,
        { target: { files: [file] } }
      );
      await screen.findByText("test.pdf");

      rerender(
        <FileUploadField value={[]} onChange={mockOnChange} disabled={true} />
      );

      expect(screen.getByLabelText("Remove test.pdf")).toBeDisabled();
    });
  });

  describe("Disabled State", () => {
    it("disables file input when disabled prop is true", () => {
      render(
        <FileUploadField value={[]} onChange={mockOnChange} disabled={true} />
      );

      const input = screen.getByLabelText("File upload input") as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it("prevents file selection when disabled", async () => {
      render(
        <FileUploadField value={[]} onChange={mockOnChange} disabled={true} />
      );

      const file = new File(["test"], "test.pdf", { type: "application/pdf" });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("shows disabled visual state", () => {
      render(
        <FileUploadField value={[]} onChange={mockOnChange} disabled={true} />
      );

      // Find the main drop zone container - the one with border-2 and border-dashed
      const pElement = screen.getByText(/Arrastra archivos/);
      const dropZone = pElement.closest("[class*='border-dashed']");
      expect(dropZone?.className).toMatch(/cursor-not-allowed/);
    });
  });

  describe("File List Display", () => {
    it("shows file count in header", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file1 = new File(["test"], "file1.pdf", { type: "application/pdf" });
      const file2 = new File(["test"], "file2.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(screen.getByText(/Archivos seleccionados \(2\/5\)/)).toBeInTheDocument();
      });
    });

    it("shows total size in file list header", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file = new File(["x".repeat(1024 * 100)], "test.pdf", {
        type: "application/pdf",
      });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/100 KB \/ 500 MB/)).toBeInTheDocument();
      });
    });

    it("scrolls file list when exceeding max height", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const files = Array.from({ length: 3 }, (_, i) =>
        new File(["test"], `file${i + 1}.pdf`, { type: "application/pdf" })
      );
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files } });

      await waitFor(() => {
        const fileList = screen.getByText(/Archivos seleccionados/).parentElement;
        expect(fileList).toBeInTheDocument();
      });
    });
  });

  describe("Controlled Component", () => {
    it("limpia la lista cuando el formulario se vacia tras enviar", async () => {
      // ProductoForm vacia `attachmentUrls` al enviar con exito. Sin esto, los
      // archivos del envio anterior seguirian a la vista como si fueran del
      // siguiente.
      const { rerender } = render(
        <FileUploadField value={[]} onChange={mockOnChange} />
      );

      const file = new File(["test"], "test.pdf", { type: "application/pdf" });
      fireEvent.change(
        screen.getByLabelText("File upload input") as HTMLInputElement,
        { target: { files: [file] } }
      );
      await screen.findByText("test.pdf");

      // Simula el estado tras subir: el padre ya tiene la URL...
      rerender(
        <FileUploadField
          value={[`${URL_BASE}/test.pdf`]}
          onChange={mockOnChange}
        />
      );
      expect(screen.getByText("test.pdf")).toBeInTheDocument();

      // ...y despues del envio la vacia.
      rerender(<FileUploadField value={[]} onChange={mockOnChange} />);

      await waitFor(() => {
        expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
      });
      expect(
        screen.queryByText(/Archivos seleccionados/)
      ).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper labels for interactive elements", () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      expect(screen.getByLabelText("File upload input")).toBeInTheDocument();
    });

    it("has aria-label for remove buttons", async () => {
      render(<FileUploadField value={[]} onChange={mockOnChange} />);

      const file = new File(["test"], "test.pdf", { type: "application/pdf" });
      const input = screen.getByLabelText("File upload input") as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByLabelText(/Remove test.pdf/)).toBeInTheDocument();
      });
    });
  });
});
