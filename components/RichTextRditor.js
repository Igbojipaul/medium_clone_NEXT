// components/RichTextEditor.jsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image';  // not ImageExtension?
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import Placeholder from "@tiptap/extension-placeholder";
import History from "@tiptap/extension-history";

export default function RichTextEditor({ initialContent = "", onUpdate, uploadEndpoint }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always supply a config object; include immediatelyRender:false
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      History,
      Heading.configure({ levels: [1, 2, 3, 4] }),
      Link.configure({ openOnClick: true, autolink: true }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: "Start writing your post..." }),
    ],
    content: initialContent || "<p></p>",
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg focus:outline-none",
      },
    },
    autofocus: true,
    injectCSS: false,
    immediatelyRender: false,
  });

  // Image upload handler
  const insertImage = useCallback(
    async (file) => {
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(uploadEndpoint, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        const url = data.url; // expects {url}
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error("Image upload error:", err);
        alert("Failed to upload image");
      }
    },
    [uploadEndpoint, editor]
  );

  if (!mounted) {
    // avoid SSR rendering
    return null;
  }

  return (
    <div className="border rounded-lg">
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border-b">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor}
          className={editor?.isActive("bold") ? "font-bold" : ""}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor}
          className={editor?.isActive("italic") ? "italic" : ""}
        >
          I
        </button>
        {[1, 2, 3].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: lvl }).run()
            }
            disabled={!editor}
            className={editor?.isActive("heading", { level: lvl }) ? "font-semibold" : ""}
          >
            H{lvl}
          </button>
        ))}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor}
          className={editor?.isActive("bulletList") ? "font-semibold" : ""}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor}
          className={editor?.isActive("orderedList") ? "font-semibold" : ""}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editor}
          className={editor?.isActive("blockquote") ? "italic" : ""}
        >
          “ ”
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={!editor}
          className={editor?.isActive("codeBlock") ? "font-mono" : ""}
        >
          {"</>"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!editor) return;
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
          }}
          disabled={!editor}
        >
          Table
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          disabled={!editor}
        >
          Link
        </button>
        <label className="cursor-pointer">
          Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              insertImage(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[200px] bg-white" />
    </div>
  );
}
