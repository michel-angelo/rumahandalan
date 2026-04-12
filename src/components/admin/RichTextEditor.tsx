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

import { Node, mergeAttributes } from "@tiptap/core";

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

// --- CUSTOM EXTENSION UNTUK ICON LUCIDE INLINE ---
const iconPaths: Record<string, any[]> = {
  check: [["path", { d: "M20 6 9 17l-5-5" }]],
  star: [
    [
      "polygon",
      {
        points:
          "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",
      },
    ],
  ],
  sparkles: [
    [
      "path",
      {
        d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",
      },
    ],
    ["path", { d: "M5 3v4" }],
    ["path", { d: "M19 17v4" }],
    ["path", { d: "M3 5h4" }],
    ["path", { d: "M17 19h4" }],
  ],
  mapPin: [
    ["path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }],
    ["circle", { cx: "12", cy: "10", r: "3" }],
  ],
  home: [
    ["path", { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }],
    ["polyline", { points: "9 22 9 12 15 12 15 22" }],
  ],
  phone: [
    [
      "path",
      {
        d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      },
    ],
  ],
};

const LucideInlineIcon = Node.create({
  name: "lucideIcon",
  group: "inline",
  inline: true,
  atom: true, // Biar Tiptap menganggap ini 1 karakter utuh, nggak bisa diketik di tengahnya

  addAttributes() {
    return {
      icon: { default: "check" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-lucide]",
        getAttrs: (el) => {
          if (typeof el === "string") return {};
          return { icon: el.getAttribute("data-lucide") };
        },
      },
    ];
  },

  // Ini yang akan mengubah data kita jadi tag <svg> beneran saat disimpan ke database
  renderHTML({ HTMLAttributes }) {
    const iconName = HTMLAttributes.icon;
    const paths = iconPaths[iconName as string] || iconPaths["check"];

    return [
      "span",
      mergeAttributes(
        {
          "data-lucide": iconName as string,
          class:
            "inline-flex items-center justify-center align-middle mx-1 text-[#2E9AB8]",
        },
        HTMLAttributes,
      ),
      [
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "1.2em", // Ukuran relatif mengikuti font size
          height: "1.2em",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        },
        ...paths,
      ],
    ];
  },

  addCommands() {
    return {
      insertLucideIcon:
        (icon: string) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: { icon },
          });
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

      <select
        onChange={(e) => {
          const icon = e.target.value;
          if (icon) {
            // @ts-ignore - Supaya TypeScript nggak bawel dengan custom command
            editor.chain().focus().insertLucideIcon(icon).run();
            e.target.value = ""; // Reset dropdown ke default
          }
        }}
        className="bg-white/[0.05] border border-white/[0.1] text-white text-[12px] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#2E9AB8] mr-1 cursor-pointer"
        defaultValue=""
      >
        <option value="" disabled className="bg-[#12121C]">
          ✨ Ikon
        </option>
        <option value="check" className="bg-[#12121C]">
          Checkmark
        </option>
        <option value="star" className="bg-[#12121C]">
          Bintang
        </option>
        <option value="sparkles" className="bg-[#12121C]">
          Promo
        </option>
        <option value="mapPin" className="bg-[#12121C]">
          Lokasi
        </option>
        <option value="home" className="bg-[#12121C]">
          Rumah
        </option>
        <option value="phone" className="bg-[#12121C]">
          Telepon
        </option>
      </select>

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
      LucideInlineIcon,
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
