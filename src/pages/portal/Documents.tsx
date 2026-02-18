import { motion } from "framer-motion";
import { FileText, Download, Folder } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const categories = [
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
    name: "SOPs",
    icon: FileText,
    files: [
      { name: "Client Onboarding Procedure.pdf", date: "28 Jan 2026" },
      { name: "Daily Operations Checklist.pdf", date: "25 Jan 2026" },
      { name: "Escalation Protocol.pdf", date: "20 Jan 2026" },
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
  {
    name: "Templates",
    icon: FileText,
    files: [
      { name: "Meeting Notes Template.docx", date: "12 Jan 2026" },
      { name: "Request Brief Template.docx", date: "10 Jan 2026" },
    ],
  },
];

const Documents = () => {
  return (
    <div className="space-y-8">
      <motion.div {...fade}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Documents</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          All shared files, procedures, reports, and templates in one place.
        </p>
      </motion.div>

      {categories.map((category, ci) => (
        <motion.div
          key={category.name}
          {...fade}
          transition={{ ...fade.transition, delay: ci * 0.08 }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <category.icon size={14} strokeWidth={1.5} />
            {category.name}
          </h3>
          <div className="bg-background border border-divider rounded-md divide-y divide-divider">
            {category.files.map((file) => (
              <div
                key={file.name}
                className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.date}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <Download size={16} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Documents;
