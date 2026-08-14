'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Plus,
  Mic,
  MicOff,
  ArrowUp,
  Image as ImageIcon,
  FileText,
  X,
} from 'lucide-react';
import { ChatAttachment } from './types';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface ChatComposerProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSubmit: (e?: React.FormEvent, attachments?: ChatAttachment[]) => void;
  attachments?: ChatAttachment[];
  onAddAttachments?: (files: ChatAttachment[]) => void;
  onRemoveAttachment?: (id: string) => void;
  isThinking?: boolean;
  placeholder?: string;
  className?: string;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  inputText,
  onChangeText,
  onSubmit,
  attachments = [],
  onAddAttachments,
  onRemoveAttachment,
  isThinking = false,
  placeholder = 'Ask anything or give a command...',
  className,
}) => {
  const { addToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea height smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [inputText]);

  // Click outside to close attach popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(e.target as Node)
      ) {
        setIsAttachMenuOpen(false);
      }
    };
    if (isAttachMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAttachMenuOpen]);

  // Speech Recognition Setup
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast({
        type: 'error',
        title: 'Voice Input Unavailable',
        description:
          'Your browser does not support Speech Recognition. Please type your message.',
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        addToast({
          type: 'info',
          title: 'Listening...',
          description: 'Speak your prompt now.',
        });
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onChangeText(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          addToast({
            type: 'error',
            title: 'Microphone Permission Denied',
            description:
              'Please allow microphone access in your browser settings to use voice input.',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Voice Error',
            description: `Could not process voice input: ${event.error}`,
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      addToast({
        type: 'error',
        title: 'Microphone Error',
        description: 'Unable to start microphone recording.',
      });
    }
  };

  // Handle File Selections
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validAttachments: ChatAttachment[] = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        addToast({
          type: 'error',
          title: 'File Too Large',
          description: `"${file.name}" exceeds the 15MB limit. Please upload a smaller file.`,
        });
        return;
      }

      const id = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const isImage = file.type.startsWith('image/');

      const attachment: ChatAttachment = {
        id,
        name: file.name,
        size: file.size,
        type: file.type || (isImage ? 'image/png' : 'application/octet-stream'),
        file,
      };

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
          attachment.previewUrl = event.target?.result as string;
          if (onAddAttachments) {
            onAddAttachments([attachment]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        validAttachments.push(attachment);
      }
    });

    if (validAttachments.length > 0 && onAddAttachments) {
      onAddAttachments(validAttachments);
    }

    setIsAttachMenuOpen(false);
    if (e.target) e.target.value = '';
  };

  const handleSubmitForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && attachments.length === 0) || isThinking) return;

    onSubmit(e, attachments);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitForm();
    }
  };

  const hasContent = inputText.trim().length > 0 || attachments.length > 0;

  return (
    <div className={cn('w-full flex flex-col items-center select-none', className)}>
      {/* Hidden inputs */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.txt,.csv,.json,.xlsx,.pptx,text/*,application/pdf"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Primary Composer Card Surface */}
      <form
        onSubmit={handleSubmitForm}
        className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(15,23,42,0.06)] p-3 sm:p-4 space-y-3 transition-all focus-within:border-indigo-500 focus-within:shadow-[0_0_24px_rgba(99,102,241,0.12)]"
      >
        {/* Attached Chips Section */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-1 pt-0.5">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs font-medium text-slate-800"
              >
                {file.previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="h-6 w-6 rounded-md object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                )}
                <span className="max-w-[150px] truncate font-bold text-slate-900">
                  {file.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {formatFileSize(file.size)}
                </span>
                {onRemoveAttachment && (
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(file.id)}
                    className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove attachment"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Text Area Input */}
        <div className="relative flex items-start justify-between gap-2">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening ? 'Listening... speak now' : placeholder
            }
            rows={1}
            disabled={isThinking}
            className={cn(
              'w-full bg-transparent resize-none border-none outline-none text-xs sm:text-[14.5px] text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed min-h-[38px] max-h-[140px] px-1 focus:ring-0 select-text disabled:opacity-50',
              isListening && 'placeholder:text-indigo-600 placeholder:font-semibold'
            )}
          />
        </div>

        {/* Bottom controls row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Attach & Voice Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Attach (+) Button with Popover */}
            <div className="relative" ref={attachMenuRef}>
              <button
                type="button"
                onClick={() => setIsAttachMenuOpen((prev) => !prev)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border border-slate-200/90 shadow-2xs',
                  isAttachMenuOpen
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    : 'bg-white hover:bg-slate-50 text-slate-700'
                )}
                title="Attach files or photos"
              >
                <Plus className="h-3.5 w-3.5 text-indigo-600" />
                <span>Attach</span>
              </button>

              {/* Popover Options */}
              {isAttachMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-2xl p-1.5 shadow-xl border border-slate-100 z-30 space-y-0.5 text-xs animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 font-semibold transition-colors cursor-pointer text-left"
                  >
                    <ImageIcon className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Photo / Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 font-semibold transition-colors cursor-pointer text-left"
                  >
                    <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>File / Document</span>
                  </button>
                </div>
              )}
            </div>

            {/* Voice Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border border-slate-200/90 shadow-2xs',
                isListening
                  ? 'bg-rose-50 text-rose-600 border-rose-300 ring-2 ring-rose-400 ring-offset-1 animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-700'
              )}
              title={isListening ? 'Stop voice recording' : 'Voice input'}
            >
              {isListening ? (
                <MicOff className="h-3.5 w-3.5 text-rose-600" />
              ) : (
                <Mic className="h-3.5 w-3.5 text-slate-500" />
              )}
              <span>{isListening ? 'Listening...' : 'Voice'}</span>
            </button>
          </div>

          {/* Right: Circular Blue Send Button */}
          <button
            type="submit"
            disabled={!hasContent || isThinking}
            className={cn(
              'h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer shrink-0',
              hasContent && !isThinking && 'hover:shadow-lg hover:shadow-indigo-600/25'
            )}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* Safety / Verification disclaimer underneath */}
      <p className="text-[11px] text-slate-400 text-center mt-2 font-normal">
        NEXORBIT can make mistakes. Please verify important information.
      </p>
    </div>
  );
};

