'use client';

import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, List, ListOrdered,
  Quote, Code, Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface EditorToolbarProps {
  onFormat: (command: string, value?: string) => void;
}

const tools = [
  { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
  { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
  { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
  { icon: Strikethrough, command: 'strikethrough', title: 'Strikethrough' },
];

const headings = [
  { icon: Heading1, command: 'formatBlock', value: 'H1', title: 'Heading 1' },
  { icon: Heading2, command: 'formatBlock', value: 'H2', title: 'Heading 2' },
];

const lists = [
  { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
  { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
];

const extras = [
  { icon: Quote, command: 'formatBlock', value: 'BLOCKQUOTE', title: 'Blockquote' },
  { icon: Code, command: 'formatBlock', value: 'PRE', title: 'Code Block' },
];

export default function EditorToolbar({ onFormat }: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-background px-4 py-1.5">
      {tools.map(({ icon: Icon, command, title }) => (
        <Button
          key={command}
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title={title}
          onMouseDown={(e) => {
            e.preventDefault();
            onFormat(command);
          }}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      ))}

      <Separator orientation="vertical" className="mx-1 h-5" />

      {headings.map(({ icon: Icon, command, value, title }) => (
        <Button
          key={value}
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title={title}
          onMouseDown={(e) => {
            e.preventDefault();
            onFormat(command, value);
          }}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      ))}

      <Separator orientation="vertical" className="mx-1 h-5" />

      {lists.map(({ icon: Icon, command, title }) => (
        <Button
          key={command}
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title={title}
          onMouseDown={(e) => {
            e.preventDefault();
            onFormat(command);
          }}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      ))}

      <Separator orientation="vertical" className="mx-1 h-5" />

      {extras.map(({ icon: Icon, command, value, title }) => (
        <Button
          key={value}
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title={title}
          onMouseDown={(e) => {
            e.preventDefault();
            onFormat(command, value);
          }}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      ))}
    </div>
  );
}
