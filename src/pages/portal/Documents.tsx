import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Folder,
  BookOpen,
  ClipboardList,
  FileCheck,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const documentCategories = [
  {
    name: "Shared Files",
    icon: Folder,
    files: [
      { name: "Q1 Operations Summary.pdf", date: "10 Feb 2026" },
      { name: "Weekly Report — Week 6.pdf", date: "7 Feb 2026" },
      { name: "Vendor Contact List.xlsx", date: "3 Feb 2026" },
    ],
  },
  {
    name: "Reports",
    icon: FileText,
    files: [
      { name: "January Monthly Report.pdf", date: "1 Feb 2026" },
      { name: "Vendor Performance Review.pdf", date: "15 Jan 2026" },
    ],
  },
];

const libraryCategories = [
  {
    name: "SOPs",
    icon: ClipboardList,
    description: "Standard operating procedures for consistent delivery.",
    files: [
      { name: "Client Onboarding Procedure.pdf", date: "28 Jan 2026", type: "SOP" },
      { name: "Daily Operations Checklist.pdf", date: "25 Jan 2026", type: "SOP" },
      { name: "Escalation Protocol.pdf", date: "20 Jan 2026", type: "SOP" },
      { name: "Communication Standards.pdf", date: "15 Jan 2026", type: "SOP" },
      { name: "Quality Assurance Process.pdf", date: "10 Jan 2026", type: "SOP" },
    ],
  },
  {
    name: "Templates",
    icon: FileCheck,
    description: "Reusable formats for briefs, reports, and handovers.",
    files: [
      { name: "Meeting Notes Template.docx", date: "12 Jan 2026", type: "Template" },
      { name: "Request Brief Template.docx", date: "10 Jan 2026", type: "Template" },
      { name: "Monthly Report Template.docx", date: "8 Jan 2026", type: "Template" },
      { name: "Project Handover Template.docx", date: "5 Jan 2026", type: "Template" },
      { name: "Stakeholder Update Template.docx", date: "3 Jan 2026", type: "Template" },
    ],
  },
  {
    name: "Guides",
    icon: BookOpen,
    description: "Short reference guides for common processes.",
    files: [
      { name: "How to Submit a Request.pdf", date: "1 Feb 2026", type: "Guide" },
      { name: "Using the Client Portal.pdf", date: "28 Jan 2026", type: "Guide" },
      { name: "File Naming Conventions.pdf", date: "20 Jan 2026", type: "Guide" },
      { name: "Getting Started with The Business Support Studio.pdf", date: "15 Jan 2026", type: "Guide" },
    ],
  },
  {
    name: "Policies",
    icon: ShieldCheck,
    description: "Formal policies, terms, and compliance documentation.",
    files: [
      { name: "Service Agreement Terms.pdf", date: "1 Jan 2026", type: "Policy" },
      { name: "Data Handling Policy.pdf", date: "1 Jan 2026", type: "Policy" },
      { name: "Confidentiality Agreement.pdf", date: "1 Jan 2026", type: "Policy" },
    ],
  },
];

const FileRow = ({ file }: { file: { name: string; date: string; type?: string } }) => (
  <div className="p-4 flex items-center justify-between gap-4 hover:bg-accent/40 transition-colors">
    <div className="flex items-center gap-3 min-w-0">
      <FileText size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="text-sm text-foreground truncate">{file.name}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{file.date}</p>
          {file.type && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 bg-accent px-1.5 py-0.5 rounded-md">
              {file.type}
            </span>
          )}
        </div>
      </div>
    </div>
    <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
      <Download size={16} strokeWidth={1.5} />
    </button>
  </div>
);

const Documents = () => {
  const [search, setSearch] = useState("");

  const filterFiles = (files: { name: string; date: string; type?: string }[]) =>
    search
      ? files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
      : files;

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Documents</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          All shared files, standards, and reference materials in one place.
        </p>
      </motion.div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="bg-accent border border-divider rounded-lg">
          <TabsTrigger value="library" className="text-xs tracking-wide rounded-md">
            Standards & Templates
          </TabsTrigger>
          <TabsTrigger value="files" className="text-xs tracking-wide rounded-md">
            Client Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-6 space-y-8">
          <motion.div {...stagger} className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search standards & templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/60"
            />
          </motion.div>

          {libraryCategories.map((category, ci) => {
            const filtered = filterFiles(category.files);
            if (filtered.length === 0) return null;
            return (
              <motion.div key={category.name} {...stagger} transition={{ duration: 0.3, delay: ci * 0.06 }}>
                <div className="mb-3">
                  <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase flex items-center gap-2">
                    <category.icon size={14} strokeWidth={1.5} />
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{category.description}</p>
                </div>
                <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
                  {filtered.map((file) => (
                    <FileRow key={file.name} file={file} />
                  ))}
                </div>
              </motion.div>
            );
          })}

          {libraryCategories.every((c) => filterFiles(c.files).length === 0) && (
            <p className="text-sm text-muted-foreground py-8 text-center">No documents match your search.</p>
          )}
        </TabsContent>

        <TabsContent value="files" className="mt-6 space-y-8">
          {documentCategories.map((category, ci) => (
            <motion.div key={category.name} {...stagger} transition={{ duration: 0.3, delay: ci * 0.06 }}>
              <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3 flex items-center gap-2">
                <category.icon size={14} strokeWidth={1.5} />
                {category.name}
              </p>
              <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
                {category.files.map((file) => (
                  <FileRow key={file.name} file={file} />
                ))}
              </div>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documents;
