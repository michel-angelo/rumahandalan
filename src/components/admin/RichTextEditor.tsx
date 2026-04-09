"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  RemoveFormatting,
  Highlighter,
} from "lucide-react";

// --- CUSTOM EXTENSION UNTUK FONT SIZE ---
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

// --- CUSTOM EXTENSION UNTUK UX LIST ALA NOTION ---
const SmartListUX = Extension.create({
  name: "smartListUX",
  addKeyboardShortcuts() {
    return {
      // Modifikasi tombol Backspace
      Backspace: () => {
        const { editor } = this;
        const { selection } = editor.state;
        const { empty, $from } = selection;

        // Cek: Apakah kursor lagi gak nge-block teks & ada di baris yang kosong melompong?
        if (
          empty &&
          $from.parentOffset === 0 &&
          $from.parent.content.size === 0
        ) {
          // Cek: Apakah kita lagi ada di dalam list?
          if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
            // "Lift" (keluarkan) dari list jadi paragraf biasa
            return editor.commands.liftListItem("listItem");
          }
        }
        return false; // Kalau syarat di atas gak terpenuhi, biarkan Backspace kerja normal
      },

      // Modifikasi tombol Enter (Jaga-jaga kalau default Enter-nya Tiptap ngebug)
      Enter: () => {
        const { editor } = this;
        const { selection } = editor.state;
        const { empty, $from } = selection;

        if (
          empty &&
          $from.parentOffset === 0 &&
          $from.parent.content.size === 0
        ) {
          if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
            return editor.commands.liftListItem("listItem");
          }
        }
        return false;
      },
    };
  },
});

// --- KOMPONEN TOOLBAR ---
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const btnClass = (isActive: boolean) =>
    `p-2 rounded-lg transition-colors flex items-center justify-center ${
      isActive
        ? "bg-[#2E9AB8]/20 text-[#2E9AB8]"
        : "text-[#8E8EA8] hover:bg-white/[0.08] hover:text-white"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 border-b border-white/[0.06] bg-white/[0.02]">
      {/* DROPDOWN FONT SIZE */}
      <select
        onChange={(e) => {
          const size = e.target.value;
          if (size) {
            editor.chain().focus().setFontSize(size).run();
          } else {
            editor.chain().focus().unsetFontSize().run();
          }
        }}
        className="bg-white/[0.05] border border-white/[0.1] text-white text-[12px] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#2E9AB8] mr-1 cursor-pointer"
        defaultValue=""
      >
        <option value="" className="bg-[#12121C]">
          Ukuran Normal
        </option>
        <option value="12px" className="bg-[#12121C]">
          Kecil (12px)
        </option>
        <option value="16px" className="bg-[#12121C]">
          Sedang (16px)
        </option>
        <option value="20px" className="bg-[#12121C]">
          Besar (20px)
        </option>
        <option value="24px" className="bg-[#12121C]">
          Promo! (24px)
        </option>
      </select>

      <div className="w-[1px] h-6 bg-white/[0.06] mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive("heading", { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-white/[0.06] mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive("underline"))}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive("strike"))}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      {/* TOMBOL STABILO (HIGHLIGHT) */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={btnClass(editor.isActive("highlight"))}
        title="Stabilo Kuning"
      >
        <Highlighter className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-white/[0.06] mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-white/[0.06] mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={btnClass(editor.isActive({ textAlign: "left" }))}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btnClass(editor.isActive({ textAlign: "center" }))}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={btnClass(editor.isActive({ textAlign: "right" }))}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={btnClass(editor.isActive({ textAlign: "justify" }))}
        title="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-white/[0.06] mx-1" />

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        className={btnClass(false)}
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: any) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontSize,
      Highlight.configure({ multicolor: false }),
      SmartListUX,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[200px] p-4 text-[14px] text-white",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (editor.isEmpty && value) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  return (
    <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden focus-within:border-[#2E9AB8] focus-within:ring-1 focus-within:ring-[#2E9AB8] transition-all editor-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
