import { motion } from "framer-motion";
import { FileText, Download, Upload, Folder } from "lucide-react";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const sections = [
  {
    name: "Client Files",
    icon: Folder,
    files: [
      { name: "Apex Ltd — Onboarding Pack.pdf", date: "12 Feb 2026" },
      { name: "Nova Co — Q1 Report Draft.pdf", date: "10 Feb 2026" },
      { name: "Meridian Group — SOP v2.pdf", date: "8 Feb 2026" },
      { name: "Vertex Partners — Discovery Notes.docx", date: "5 Feb 2026" },
    ],
  },
  {
    name: "Internal References",
    icon: FileText,
    files: [
      { name: "Service Pricing Guide.pdf", date: "1 Feb 2026" },
      { name: "Engagement Workflow.pdf", date: "20 Jan 2026" },
      { name: "Client Communication Standards.docx", date: "15 Jan 2026" },
    ],
  },
  {
    name: "Shared Assets",
    icon: FileText,
    files: [
      { name: "Brand Guidelines.pdf", date: "10 Jan 2026" },
      { name: "Proposal Template.docx", date: "8 Jan 2026" },
      { name: "Meeting Agenda Template.docx", date: "5 Jan 2026" },
    ],
  },
];

const AdminDocuments = () => {
  return (
    <div className="space-y-6">
      <motion.div {...stagger} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Documents</h2>
          <p className="mt-1 text-sm text-muted-foreground">Internal document management.</p>
        </div>
        <button className="flex items-center gap-2 text-xs bg-foreground text-background px-4 py-2.5 rounded-lg hover:bg-foreground/90 transition-colors">
          <Upload size={14} /> Upload File
        </button>
      </motion.div>

      {sections.map((section, si) => (
        <motion.div key={section.name} {...stagger} transition={{ duration: 0.3, delay: si * 0.06 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3 flex items-center gap-2">
            <section.icon size={14} strokeWidth={1.5} />
            {section.name}
          </p>
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {section.files.map((file) => (
              <div key={file.name} className="p-4 flex items-center justify-between gap-4 hover:bg-accent/40 transition-colors">
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

export default AdminDocuments;
