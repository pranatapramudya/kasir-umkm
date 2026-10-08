"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4 p-4">
      <button type="button" onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-90 disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100 transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Render page numbers */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = currentPage === page;

          // Simple ellipsis logic for many pages
          if (
            totalPages > 7 &&
            page !== 1 &&
            page !== totalPages &&
            Math.abs(currentPage - page) > 1
          ) {
            if (page === 2 || page === totalPages - 1) {
              return <span key={page} className="px-2 text-slate-400">...</span>;
            }
            return null;
          }

          return (
            <button type="button" key={page} onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 rounded-lg text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button type="button" onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-90 disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100 transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
