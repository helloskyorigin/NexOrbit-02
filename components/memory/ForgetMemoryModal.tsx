'use client';

import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { MemoryItem } from './types';
import { Button } from '../ui/Button';

export interface ForgetMemoryModalProps {
  memory: MemoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmForget: (id: string) => void;
}

export const ForgetMemoryModal: React.FC<ForgetMemoryModalProps> = ({
  memory,
  isOpen,
  onClose,
  onConfirmForget,
}) => {
  if (!isOpen || !memory) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 sm:p-7 text-left shadow-2xl transition-all border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Forget this memory?
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                NexOrbit will purge this fact from its contextual reasoning engine. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Memory Preview Card */}
          <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-xs font-bold text-slate-900 line-clamp-1">
              {memory.title}
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-2">
              {memory.description}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs h-9 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={() => onConfirmForget(memory.id)}
              className="text-xs h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
            >
              Forget Memory
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
