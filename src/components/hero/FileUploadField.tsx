import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, AlertCircle, File } from "lucide-react";
import {
  ACCEPTED_MIME_TYPES,
  AcceptedMimeType,
  AcceptedFileExtension,
  FileInfo,
  DEFAULT_ACCEPTED_TYPES,
} from "@/lib/fileUploadTypes";

interface FileUploadFieldProps {
  value: string[];
  onChange: (files: string[]) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  maxTotalSize?: number;
  acceptedTypes?: AcceptedFileExtension[];
}

const DEFAULT_MAX_FILES = 5;
const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const DEFAULT_MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const validateFile = (
  file: File,
  acceptedMimeTypes: AcceptedMimeType[],
  maxFileSize: number,
  acceptedTypesList: AcceptedFileExtension[]
): { isValid: boolean; error?: string } => {
  // Check MIME type
  if (!acceptedMimeTypes.includes(file.type as AcceptedMimeType)) {
    const acceptedExts = acceptedTypesList.join(", ");
    return { isValid: false, error: `Tipo de archivo no permitido. Acepta: ${acceptedExts}` };
  }

  // Check file size
  if (file.size > maxFileSize) {
    return { isValid: false, error: `Archivo muy grande. Máximo: ${formatFileSize(maxFileSize)}` };
  }

  return { isValid: true };
};

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  value,
  onChange,
  label = "Documentos adjuntos",
  error,
  disabled = false,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  maxTotalSize = DEFAULT_MAX_TOTAL_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useRef(`file-input-${Math.random().toString(36).slice(2, 9)}`);
  const [fileInfoList, setFileInfoList] = useState<FileInfo[]>(
    value.map((name) => ({
      name,
      size: 0,
      type: "",
      lastModified: 0,
    }))
  );
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string>("");

  // Sync fileInfoList when value prop changes (controlled component)
  useEffect(() => {
    setFileInfoList(
      value.map((name) => ({
        name,
        size: 0,
        type: "",
        lastModified: 0,
      }))
    );
  }, [value]);

  // Get accepted MIME types from acceptedTypes
  const acceptedMimeTypes: AcceptedMimeType[] = acceptedTypes
    .flatMap((ext) => {
      const mimeType = ACCEPTED_MIME_TYPES[ext];
      return mimeType ? [mimeType] : [];
    })
    .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  const calculateTotalSize = (files: FileInfo[]): number => {
    return files.reduce((sum, file) => sum + file.size, 0);
  };

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const newFiles: FileInfo[] = [];
      const errors: string[] = [];

      // Calculate current total size
      const currentTotalSize = calculateTotalSize(fileInfoList);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file count limit
        if (fileInfoList.length + newFiles.length >= maxFiles) {
          errors.push(`Máximo de ${maxFiles} archivos permitido`);
          break;
        }

        // Validate file
        const validation = validateFile(file, acceptedMimeTypes, maxFileSize, acceptedTypes);
        if (!validation.isValid) {
          errors.push(`${file.name}: ${validation.error}`);
          continue;
        }

        // Check total size
        const newTotalSize = currentTotalSize + calculateTotalSize(newFiles) + file.size;
        if (newTotalSize > maxTotalSize) {
          errors.push(`Tamaño total excedido. Máximo: ${formatFileSize(maxTotalSize)}`);
          break;
        }

        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        });
      }

      if (errors.length > 0) {
        setLocalError(errors[0]);
      } else {
        setLocalError("");
      }

      // Update file list and onChange callback only if files were added
      if (newFiles.length > 0) {
        const updatedFileList = [...fileInfoList, ...newFiles];
        setFileInfoList(updatedFileList);
        onChange(updatedFileList.map((f) => f.name));
      }
    },
    [fileInfoList, disabled, maxFiles, maxFileSize, maxTotalSize, acceptedMimeTypes, onChange]
  );

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(e.type === "dragenter" || e.type === "dragover");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFileList = fileInfoList.filter((_, i) => i !== index);
    setFileInfoList(updatedFileList);
    onChange(updatedFileList.map((f) => f.name));
    setLocalError("");
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const totalSize = calculateTotalSize(fileInfoList);
  const combinedError = error || localError;

  return (
    <div className="space-y-4">
      {label && (
        <label htmlFor={inputId.current} className="text-sm font-medium text-foreground block">
          {label}
        </label>
      )}

      {/* Drag and drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          disabled
            ? "border-muted-foreground/30 bg-muted/30 cursor-not-allowed"
            : dragActive
              ? "border-primary bg-primary/5"
              : combinedError
                ? "border-destructive bg-destructive/5 hover:bg-destructive/10"
                : "border-muted-foreground/30 bg-muted/5 hover:bg-muted/10 hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          id={inputId.current}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          aria-label="File upload input"
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={`p-3 rounded-full ${
              disabled
                ? "bg-muted text-muted-foreground"
                : dragActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
            }`}
          >
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              {dragActive ? "Suelta los archivos aquí" : "Arrastra archivos o haz clic"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Máximo {maxFiles} archivos, {formatFileSize(maxFileSize)} cada uno, {formatFileSize(maxTotalSize)} total
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {combinedError && (
        <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/20 rounded-md p-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{combinedError}</p>
        </div>
      )}

      {/* File list */}
      {fileInfoList.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">
              Archivos seleccionados ({fileInfoList.length}/{maxFiles})
            </h4>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(totalSize)} / {formatFileSize(maxTotalSize)}
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {fileInfoList.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 p-3 border border-border rounded-md bg-background hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  disabled={disabled}
                  className="p-1 text-muted-foreground hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper text */}
      {!combinedError && fileInfoList.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Formatos permitidos: {acceptedTypes.join(", ")}
        </p>
      )}
    </div>
  );
};

export default FileUploadField;
