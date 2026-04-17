'use client';

import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const toolbarItems = [
  { icon: Bold, label: 'Bold', shortcut: 'Ctrl+B', command: 'bold' },
  { icon: Italic, label: 'Italic', shortcut: 'Ctrl+I', command: 'italic' },
  { icon: Underline, label: 'Underline', shortcut: 'Ctrl+U', command: 'underline' },
];

const headingItems = [
  { icon: Heading1, label: 'Heading 1', command: 'h1' },
  { icon: Heading2, label: 'Heading 2', command: 'h2' },
];

const listItems = [
  { icon: List, label: 'Bullet list', command: 'ul' },
  { icon: ListOrdered, label: 'Numbered list', command: 'ol' },
  { icon: Quote, label: 'Blockquote', command: 'blockquote' },
  { icon: Code, label: 'Code', command: 'code' },
];

export function EditorToolbar() {
  return (
    <div className="flex items-center gap-1">
      {toolbarItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.command}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={`${item.label} (${item.shortcut})`}
            type="button"
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
      <Separator orientation="vertical" className="mx-1 h-6" />
      {headingItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.command}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={item.label}
            type="button"
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
      <Separator orientation="vertical" className="mx-1 h-6" />
      {listItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.command}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={item.label}
            type="button"
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}
