"use client";

import { useTransition, useState } from "react";

interface DocTypeOption {
  value: string;
  label: string;
}

interface KycUploadFormProps {
  onSubmit: (formData: FormData) => Promise<{ error?: string } | undefined>;
  docTypeOptions: DocTypeOption[];
  labels: {
    docType: string;
    front: string;
    back: string;
    submit: string;
  };
}

export function KycUploadForm({ onSubmit, docTypeOptions, labels }: KycUploadFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {labels.docType}
        </label>
        <select
          name="doc_type"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white"
        >
          {docTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {labels.front}
        </label>
        <input
          name="front"
          type="file"
          accept="image/*,application/pdf"
          required
          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {labels.back}
        </label>
        <input
          name="back"
          type="file"
          accept="image/*,application/pdf"
          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "..." : labels.submit}
      </button>
    </form>
  );
}
