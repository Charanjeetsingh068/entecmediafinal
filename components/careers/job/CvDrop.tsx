"use client";

import { useRef, useState, type DragEvent } from "react";
import CareerIcon from "@/components/careers/CareerIcon";

export const CV_MAX_BYTES = 8 * 1024 * 1024;
export const CV_EXTENSIONS = ["pdf", "doc", "docx", "rtf", "odt", "txt", "pages", "jpg", "jpeg", "png"];

interface CvDropProps {
  file: File | null;
  onChange: (file: File | null) => void;
  label: string;
  hint: string;
  dropText: string;
  browseText: string;
  replaceText: string;
  tooBig: string;
  badType: string;
}

const sizeText = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

/**
 * CV upload: a drop zone (drag a file onto it or click to browse) that accepts PDF, Word, RTF, ODT,
 * Pages, TXT and images up to 8 MB. While a file is dragged over it the zone glows; once a file is chosen
 * it shows a file card (type badge, name, size) with Replace / Remove. Wrong type or size shows a message.
 */
export default function CvDrop({ file, onChange, label, hint, dropText, browseText, replaceText, tooBig, badType }: CvDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");

  const take = (f: File | undefined | null) => {
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!CV_EXTENSIONS.includes(ext)) {
      setError(badType);
      return;
    }
    if (f.size > CV_MAX_BYTES) {
      setError(tooBig);
      return;
    }
    setError("");
    onChange(f);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOver(false);
    take(e.dataTransfer.files?.[0]);
  };

  const ext = file?.name.split(".").pop()?.toUpperCase() ?? "";

  return (
    <div className="cv-field">
      <span className="cf-select-label">
        {label} <i className="cv-req">*</i>
      </span>
      <input
        ref={inputRef}
        type="file"
        className="cv-input"
        accept={CV_EXTENSIONS.map((x) => `.${x}`).join(",")}
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = "";
        }}
        tabIndex={-1}
        aria-hidden="true"
      />

      {file ? (
        <div className="cv-file">
          <span className="cv-file-badge">{ext.slice(0, 4)}</span>
          <span className="cv-file-text">
            <strong title={file.name}>{file.name}</strong>
            <small>
              <CareerIcon name="check" /> {sizeText(file.size)}
            </small>
          </span>
          <button type="button" className="cv-file-btn" onClick={() => inputRef.current?.click()}>
            {replaceText}
          </button>
          <button type="button" className="cv-file-remove" aria-label="Remove file" onClick={() => onChange(null)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className={`cv-drop ${over ? "is-over" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), inputRef.current?.click())}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
        >
          <span className="cv-drop-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" />
              <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
            </svg>
          </span>
          <span className="cv-drop-text">
            {dropText} <b>{browseText}</b>
          </span>
          <small>{hint}</small>
        </div>
      )}
      {error && (
        <p className="cv-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
