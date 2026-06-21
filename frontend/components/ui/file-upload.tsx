"use client";

import { useCallback, useEffect, useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Upload Icon (inline SVG — no @tabler dependency needed) ─────────────────
function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconFile({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

// ─── Grid Pattern Background ──────────────────────────────────────────────────
function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const isEdge =
            row === 0 || row === rows - 1 || col === 0 || col === columns - 1;
          return (
            <div
              key={`${col}-${row}`}
              className={cn(
                "w-10 h-10 rounded-[2px] flex-shrink-0",
                isEdge
                  ? "bg-neutral-50 dark:bg-neutral-950 opacity-0"
                  : "bg-neutral-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,0.04)_inset]"
              )}
            />
          );
        })
      )}
    </div>
  );
}

// ─── FileUpload Component ─────────────────────────────────────────────────────
export const FileUpload = ({
  onChange,
  accept = ".pdf,.txt",
  maxFiles = 3,
}: {
  onChange?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  // Notify parent AFTER state settles — avoids "setState during render" warning
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange?.(files);
  }, [files]);

  const validateAndAdd = useCallback(
    (incoming: File[]) => {
      const valid = incoming.filter((f) => {
        const ext = f.name.split(".").pop()?.toLowerCase();
        return ext === "pdf" || ext === "txt";
      });

      if (valid.length === 0) {
        setError("Only PDF and TXT files are supported.");
        return;
      }

      setFiles((prev) => [...prev, ...valid].slice(0, maxFiles));
      setError("");
    },
    [maxFiles, onChange]
  );

  const handleClick = () => {
    if (files.length < maxFiles) fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    validateAndAdd(selected);
    // reset input so same file can be re-added after removal
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    validateAndAdd(Array.from(e.dataTransfer.files));
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      className="w-full"
    >
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className={cn(
          "p-8 group/file block rounded-2xl cursor-pointer w-full relative overflow-hidden transition-all duration-300",
          "border-2 border-dashed",
          isDragActive
            ? "border-cyan-400/60 bg-cyan-400/5"
            : "border-white/10 hover:border-white/20 bg-white/[0.02]",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Grid background */}
        <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center relative z-10">
          {/* Upload icon box */}
          <motion.div
            variants={{
              animate: { y: -6, scale: 1.05 },
            }}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
              isDragActive
                ? "bg-cyan-400/20 border border-cyan-400/40"
                : "bg-white/5 border border-white/10 group-hover/file:bg-white/10"
            )}
          >
            {isDragActive ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <IconUpload className="w-6 h-6 text-cyan-400" />
              </motion.div>
            ) : (
              <IconUpload className="w-6 h-6 text-neutral-400 group-hover/file:text-white transition-colors" />
            )}
          </motion.div>

          <p className="text-white font-semibold text-sm mb-1">
            {files.length >= maxFiles
              ? `Maximum ${maxFiles} files reached`
              : isDragActive
              ? "Drop your files here"
              : "Drag & drop or click to upload"}
          </p>
          <p className="text-neutral-500 text-xs">
            PDF and TXT · Up to {maxFiles} files
          </p>

          {/* File count indicator */}
          {files.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              {Array.from({ length: maxFiles }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i < files.length ? "bg-cyan-400" : "bg-white/10"
                  )}
                />
              ))}
              <span className="text-neutral-500 text-xs ml-1">
                {files.length}/{maxFiles}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-red-400 px-1"
          >
            ⚠️ {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex flex-col gap-2"
          >
            {files.map((file, idx) => (
              <motion.div
                key={file.name + idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                    <IconFile className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{file.name}</p>
                    <p className="text-neutral-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-600 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0 text-sm"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
