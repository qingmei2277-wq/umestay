// components/auth/AuthModal.tsx
"use client";

import { useEffect } from "react";
// cn not needed in this file

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AuthModal({ open, onClose, title, children }: AuthModalProps) {
  // 打开时禁止背景滚动
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* 弹框 */}
      {/* <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"> */}
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 my-auto shadow-2xl">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          <div className="w-7" /> {/* 占位保持标题居中 */}
        </div>
        {/* 内容 */}
        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}