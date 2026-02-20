import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, LayoutTemplate, FileText, Eye, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const stagger = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

interface Template {
  title: string;
  description: string;
  content: string;
}

const templateCategories = [
  {
    name: "Onboarding Flows",
    templates: [
      {
        title: "New Client Onboarding Checklist",
        description: "Step-by-step onboarding for new clients including workspace setup, access, and kick-off.",
        content: `# New Client Onboarding Checklist

## Pre-Onboarding
- [ ] Confirm signed agreement
- [ ] Collect client contact details
- [ ] Assign account operator

## Workspace Setup
- [ ] Create client workspace in portal
- [ ] Set up shared document folder
- [ ] Configure communication channel
- [ ] Send portal access invitation

## Kick-Off
- [ ] Schedule kick-off call
- [ ] Prepare discovery questionnaire
- [ ] Share welcome pack
- [ ] Set expectations on response times

## First Week
- [ ] Complete discovery session
- [ ] Document initial priorities
- [ ] Create first work items
- [ ] Send first progress update`,
      },
      {
        title: "Discovery Call Guide",
        description: "Structured agenda for initial client conversations to understand needs and scope.",
        content: `# Discovery Call Guide

## Opening (5 min)
- Introductions
- Agenda overview
- Permission to take notes

## Business Context (15 min)
- What does your business do?
- Current team size and structure
- Revenue stage and growth goals
- Key challenges right now

## Operational Needs (15 min)
- Which functions need the most support?
- Current tools and systems in use
- Pain points in daily operations
- What does success look like in 90 days?

## Logistics (10 min)
- Preferred communication style
- Availability and time zones
- Budget expectations
- Timeline for getting started

## Wrap-Up (5 min)
- Summarise key takeaways
- Outline next steps
- Confirm follow-up date`,
      },
      {
        title: "Welcome Pack",
        description: "Introduction to services, communication protocols, and portal access instructions.",
        content: `# Welcome to Support Studio™

## Your Team
- **Account Operator**: [Name]
- **Email**: [email]
- **Response Time**: Within 4 business hours

## Communication
- Primary: Portal messaging
- Urgent: Email with [URGENT] in subject
- Calls: By appointment via portal

## Portal Access
1. Check your email for the invitation
2. Set your password
3. Complete your profile
4. Explore your dashboard

## What Happens Next
1. Week 1: Discovery and setup
2. Week 2: First deliverables begin
3. Week 4: First progress review
4. Monthly: Performance report`,
      },
    ],
  },
  {
    name: "SOP Templates",
    templates: [
      {
        title: "Standard Operating Procedure",
        description: "Base template for creating new SOPs with sections for purpose, scope, and steps.",
        content: `# Standard Operating Procedure

**Title**: [Procedure Name]
**Version**: 1.0
**Last Updated**: [Date]
**Owner**: [Name]

## Purpose
[Why this procedure exists]

## Scope
[What this covers and what it doesn't]

## Prerequisites
- [Requirement 1]
- [Requirement 2]

## Procedure

### Step 1: [Action]
- Detail
- Detail

### Step 2: [Action]
- Detail
- Detail

### Step 3: [Action]
- Detail
- Detail

## Exception Handling
[What to do when things go wrong]

## Review Schedule
- Reviewed: [Quarterly/Monthly]
- Next review: [Date]`,
      },
      {
        title: "Daily Operations Checklist",
        description: "Recurring task list for daily operational management.",
        content: `# Daily Operations Checklist

## Morning (Start of Day)
- [ ] Review inbox and flag priorities
- [ ] Check calendar for meetings
- [ ] Review task board for due items
- [ ] Respond to urgent client messages

## Midday
- [ ] Progress update on active work items
- [ ] Follow up on pending approvals
- [ ] Update project trackers

## End of Day
- [ ] Document completed tasks
- [ ] Prepare tomorrow's priorities
- [ ] Send any pending client updates
- [ ] Flag blockers for team`,
      },
      {
        title: "Escalation Procedure",
        description: "Clear escalation paths and response protocols for issues.",
        content: `# Escalation Procedure

## Severity Levels

### Level 1 — Low
- Non-urgent questions or minor issues
- Response: Within 24 hours
- Handler: Account Operator

### Level 2 — Medium
- Client dissatisfaction or missed deadline
- Response: Within 4 hours
- Handler: Senior Operator + notification to Manager

### Level 3 — High
- Service failure, data issue, or client escalation
- Response: Within 1 hour
- Handler: Operations Manager + immediate resolution plan

## Escalation Steps
1. Document the issue clearly
2. Notify the appropriate handler
3. Communicate with the client
4. Implement resolution
5. Post-incident review`,
      },
    ],
  },
  {
    name: "Report Structures",
    templates: [
      {
        title: "Weekly Progress Report",
        description: "Structured format for weekly client updates.",
        content: `# Weekly Progress Report

**Client**: [Name]
**Period**: [Date Range]
**Prepared by**: [Operator]

## Summary
[1-2 sentence overview of the week]

## Completed This Week
- [Task 1]
- [Task 2]
- [Task 3]

## In Progress
- [Task 1] — [% complete]
- [Task 2] — [% complete]

## Coming Next Week
- [Priority 1]
- [Priority 2]

## Blockers / Notes
- [Any issues or dependencies]`,
      },
      {
        title: "Monthly Summary Report",
        description: "Comprehensive monthly overview with KPIs.",
        content: `# Monthly Summary Report

**Client**: [Name]
**Month**: [Month Year]

## Executive Summary
[Overview of the month's performance]

## KPIs
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Tasks Completed | [X] | [Y] | ✅/⚠️ |
| Response Time | <4h | [Xh] | ✅/⚠️ |
| On-Time Delivery | 95% | [X%] | ✅/⚠️ |

## Key Achievements
1. [Achievement 1]
2. [Achievement 2]

## Challenges
1. [Challenge and how it was addressed]

## Recommendations
1. [Suggestion for improvement]

## Next Month Focus
- [Priority 1]
- [Priority 2]`,
      },
      {
        title: "Quarterly Business Review",
        description: "End-of-quarter review template covering engagement health.",
        content: `# Quarterly Business Review

**Client**: [Name]
**Quarter**: Q[X] [Year]

## Engagement Health: [🟢 Healthy / 🟡 Attention / 🔴 At Risk]

## Quarter in Review
### Goals Set
1. [Goal 1] — [Achieved/In Progress/Not Met]
2. [Goal 2] — [Status]

### Volume Summary
- Work items completed: [X]
- Requests handled: [X]
- Documents delivered: [X]

## Client Satisfaction
[Feedback summary or NPS score]

## Financial Summary
- Monthly retainer: R[X]
- Additional services: R[X]
- Total Q[X] revenue: R[X]

## Next Quarter Plan
1. [Strategic objective 1]
2. [Strategic objective 2]
3. [Strategic objective 3]`,
      },
    ],
  },
  {
    name: "Client Communication",
    templates: [
      {
        title: "Status Update Email",
        description: "Quick email template for routine progress updates.",
        content: `Subject: [Client Name] — Weekly Status Update

Hi [Name],

Here's a quick update on this week's progress:

**Completed:**
• [Item 1]
• [Item 2]

**In Progress:**
• [Item 1] — expected completion [date]

**Next Steps:**
• [Item 1]

Let me know if you have any questions.

Best,
[Your Name]
Support Studio™`,
      },
      {
        title: "Request Acknowledgment",
        description: "Standard response confirming receipt and next steps.",
        content: `Subject: Re: [Request Title]

Hi [Name],

Thanks for submitting your request. I've logged it in the system and here's the plan:

**Request**: [Brief description]
**Priority**: [Low/Medium/High]
**Expected Turnaround**: [X business days]

I'll keep you updated via the portal. If anything changes or you need to add context, reply here or update the request directly.

Best,
[Your Name]
Support Studio™`,
      },
      {
        title: "Meeting Follow-Up",
        description: "Post-meeting summary with action items and deadlines.",
        content: `Subject: Meeting Follow-Up — [Date]

Hi [Name],

Thanks for the call today. Here's a summary:

**Key Discussion Points:**
1. [Point 1]
2. [Point 2]

**Action Items:**
| Action | Owner | Deadline |
|--------|-------|----------|
| [Action 1] | [Name] | [Date] |
| [Action 2] | [Name] | [Date] |

**Next Meeting**: [Date/Time]

Let me know if I've missed anything.

Best,
[Your Name]
Support Studio™`,
      },
    ],
  },
];

const AdminTemplates = () => {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (template: Template) => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopiedTitle(template.title);
      toast({ title: "Copied to clipboard", description: template.title });
      setTimeout(() => setCopiedTitle(null), 2000);
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl text-foreground">Templates</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reusable templates to standardise delivery and improve efficiency. Click to preview, copy to use.
        </p>
      </motion.div>

      {templateCategories.map((cat, ci) => (
        <motion.div key={cat.name} {...stagger} transition={{ duration: 0.3, delay: ci * 0.06 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3 flex items-center gap-2">
            <LayoutTemplate size={14} strokeWidth={1.5} />
            {cat.name}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cat.templates.map((tpl) => (
              <button
                key={tpl.title}
                onClick={() => setPreviewTemplate(tpl)}
                className="bg-card border border-divider rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <FileText size={16} className="text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.5} />
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(tpl); }}
                    className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    {copiedTitle === tpl.title ? <Check size={14} className="text-primary" /> : <Copy size={14} strokeWidth={1.5} />}
                  </button>
                </div>
                <h4 className="text-sm font-medium text-foreground mt-3">{tpl.title}</h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{tpl.description}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye size={10} /> Preview
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-background border border-border w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl rounded-xl"
            >
              <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
                <h3 className="text-sm font-medium text-foreground">{previewTemplate.title}</h3>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => copyToClipboard(previewTemplate)}>
                    {copiedTitle === previewTemplate.title ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                    {copiedTitle === previewTemplate.title ? "Copied" : "Copy"}
                  </Button>
                  <button onClick={() => setPreviewTemplate(null)} className="text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {previewTemplate.content}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTemplates;
