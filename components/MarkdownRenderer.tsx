
import React, { useMemo } from 'react';

interface MarkdownRendererProps {
  text: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text, className = "" }) => {
  const htmlContent = useMemo(() => {
    if (!text) return { __html: '' };

    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    let formatted = escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic opacity-90">$1</em>')
      .replace(/^### (.*?)$/gm, '<h3 class="text-base font-black text-yellow-400 mt-5 mb-2 tracking-wide">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-lg font-black text-yellow-500 mt-6 mb-3 tracking-wide">$1</h2>')
      .replace(/^[*-] (.*?)$/gm, '<div class="flex items-start gap-3 my-2"><span class="text-yellow-500 mt-1.5 font-black text-xs">•</span><span class="font-medium text-slate-200">$1</span></div>')
      .replace(/\n/g, '<br />');

    return { __html: formatted };
  }, [text]);

  return (
    <div 
      className={`prose prose-invert max-w-none text-slate-200 font-normal leading-relaxed tracking-tight ${className}`}
      style={{ fontSize: '0.95rem' }}
      dangerouslySetInnerHTML={htmlContent}
    />
  );
};

export default MarkdownRenderer;
