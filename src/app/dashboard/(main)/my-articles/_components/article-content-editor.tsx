"use client";

import React, { useState } from "react";
// import { ChevronDown, FileText, Layout, Type } from "lucide-react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
// @import '../styles/_variables.scss';
// @import '../styles/_keyframe-animations.scss';

export interface ArticleContentSection {
  id: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
}

interface ArticleContentEditorProps {
  sections: ArticleContentSection[];
  onUpdateSection: (index: number, field: keyof ArticleContentSection, value: string) => void;
}

export function ArticleContentEditor({
  sections,
  onUpdateSection,
}: ArticleContentEditorProps) {
  const [openSectionIndex, setOpenSectionIndex] = useState<number>(0);

  const toggleSection = (index: number) => {
    setOpenSectionIndex(openSectionIndex === index ? -1 : index);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-bold text-white font-poppins">Article Body Sections</h4>
        <p className="text-xs text-slate-400 mt-1">
          Customize the headings and paragraphs for the content sections displayed on the article details page.
        </p>
      </div>
      <div className="">
        <SimpleEditor />
      </div>
    </div>
  );
}
