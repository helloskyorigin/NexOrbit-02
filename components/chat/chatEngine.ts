import { AIMode, ChatMessage, SourceReference, FindingItem, ChatAction } from './types';

export const MOCK_CHAT_SOURCES: Record<string, SourceReference> = {
  gmailAlpha: {
    id: 'src-gmail-1',
    connector: 'gmail',
    connectorName: 'Gmail',
    title: 'Project Alpha spec review & timeline',
    snippet: 'Rahul Mehta: "We are aiming for Friday COB to submit the final spec review before release."',
    timestamp: 'Today, 9:15 AM',
    sender: 'Rahul Mehta <rahul@alpha-client.com>',
  },
  calendarSync: {
    id: 'src-cal-1',
    connector: 'calendar',
    connectorName: 'Calendar',
    title: 'Project Alpha Sync',
    snippet: 'Event scheduled for Tomorrow 10:00 AM with Rahul Mehta, Aryan, and Dev Leads in Room 4.',
    timestamp: 'Tomorrow, 10:00 AM',
    sender: 'Google Calendar (Sync Room)',
  },
  calendarClientCall: {
    id: 'src-cal-2',
    connector: 'calendar',
    connectorName: 'Calendar',
    title: 'Client Review & Feedback Session',
    snippet: 'Event scheduled for Tomorrow 1:30 PM with Rahul Mehta and Product Operations.',
    timestamp: 'Tomorrow, 1:30 PM',
    sender: 'Google Calendar',
  },
  driveProposal: {
    id: 'src-drive-1',
    connector: 'drive',
    connectorName: 'Google Drive',
    title: 'Project_Alpha_Master_Brief_v2.pdf',
    snippet: 'Section 4.1 Target Timeline explicitly notes Monday August 18 as the core delivery sign-off date.',
    timestamp: 'Updated Aug 11',
    sender: 'Shared with Aryan / Product Strategy',
  },
  notionRoadmap: {
    id: 'src-notion-1',
    connector: 'notion',
    connectorName: 'Notion',
    title: 'Alpha Engineering Roadmap & Sprint 14',
    snippet: 'Sprint 14 tracking: 8 tasks completed, 2 in code review, deadline aligned with v2 brief.',
    timestamp: 'Yesterday, 5:30 PM',
  },
  githubPr: {
    id: 'src-github-1',
    connector: 'github',
    connectorName: 'GitHub',
    title: 'PR #142: Core API Alignment & Telemetry',
    snippet: 'Merged by Aryan into main. CI/CD automated tests passing 100%.',
    timestamp: 'Aug 12, 2:10 PM',
  },
};

export function generateAIResponse(query: string, mode: AIMode): {
  text: string;
  sourcesUsed?: SourceReference[];
  findings?: FindingItem[];
  actions?: ChatAction[];
} {
  const q = query.toLowerCase().trim();

  // If in pure general mode, or if auto mode detected a general question
  const isExplicitGeneral = mode === 'general';
  const isExplicitConnected = mode === 'connected';

  // 1. Quantum Computing / General Knowledge
  if (q.includes('quantum') || (isExplicitGeneral && (q.includes('what is') || q.includes('explain')))) {
    return {
      text: `**Quantum computing** is a multidisciplinary field comprising aspects of computer science, physics, and mathematics that utilizes the principles of quantum mechanics to solve complex problems faster than classical computers.

### Core Principles:
1. **Superposition**: Unlike classical bits that represent either 0 or 1, quantum bits (**qubits**) can exist in multidimensional states representing both 0 and 1 simultaneously.
2. **Entanglement**: Qubits can become intrinsically linked such that the quantum state of one instantaneously determines the state of another, regardless of distance.
3. **Quantum Interference**: Quantum algorithms use interference patterns to amplify correct computational pathways and cancel out incorrect ones.

### Primary Practical Applications:
- **Cryptography & Security**: Post-quantum lattice cryptography and quantum key distribution (QKD).
- **Molecular Simulation & Drug Discovery**: Simulating complex protein folding and molecular interactions.
- **Optimization Problems**: Large-scale financial risk modeling, logistics, and supply chain routing.`,
      actions: [
        { id: 'act-copy', label: 'Copy Explanation', actionType: 'copy_text' },
        { id: 'act-deep', label: 'Explore Qubit Superposition Math', actionType: 'custom' },
      ],
    };
  }

  // 2. Email Writing / Text Generation
  if (q.includes('write') && (q.includes('email') || q.includes('message') || q.includes('reply') || q.includes('proposal'))) {
    return {
      text: `Here is a refined, professional email draft tailored for high clarity and executive polish:

**Subject:** Update on Project Alpha Deliverables & Timeline Alignment

**Hi Rahul,**

Thank you for sending over the latest notes. I wanted to quickly touch base regarding our upcoming milestone targets.

We are currently tracking ahead of schedule on core deliverables. To ensure comprehensive QA coverage and automated regression tests before final deployment, our engineering timeline is structured for final sign-off by **Monday morning**.

Let's review the final checklist during our scheduled sync **tomorrow at 10:00 AM**. Looking forward to our discussion!

Best regards,  
**Satyam**  
*Lead Architect, NEXORBIT*`,
      actions: [
        { id: 'act-copy-email', label: 'Copy Email Draft', actionType: 'copy_text' },
        { id: 'act-send-gmail', label: 'Open in Gmail Composer', actionType: 'draft_reply' },
      ],
    };
  }

  // 3. Plan Tomorrow / Planning & Brainstorming
  if (q.includes('plan tomorrow') || q.includes('schedule') || q.includes('my day') || q.includes('plan my day')) {
    const sources = [MOCK_CHAT_SOURCES.calendarSync, MOCK_CHAT_SOURCES.calendarClientCall, MOCK_CHAT_SOURCES.driveProposal];
    return {
      text: `Here is an optimized time-blocked plan for tomorrow based on your scheduled commitments and workspace priorities:

### 🌅 Morning
- **08:30 AM – 09:30 AM**: ☕ Morning Review & Email triage (Review Rahul's notes on Project Alpha).
- **09:30 AM – 10:00 AM**: 📑 Meeting Prep: Review *Project_Alpha_Master_Brief_v2.pdf*.
- **10:00 AM – 11:00 AM**: 🤝 **Project Alpha Sync** (Live meeting with Rahul & Dev Leads).

### ☀️ Afternoon
- **11:15 AM – 12:45 PM**: 🎯 Deep Focus: Review PR #142 and unblock Sprint 14 backlog tasks.
- **01:30 PM – 02:15 PM**: 📞 **Client Review & Feedback Session** (Google Calendar).
- **02:30 PM – 04:30 PM**: ⚡ Engineering sprint execution & documentation update in Notion.

### 🌆 Wrap-up
- **05:00 PM – 05:30 PM**: 🏁 Clean My Day: Log key decisions and plan next day goals.`,
      sourcesUsed: sources,
      actions: [
        { id: 'act-copy-plan', label: 'Copy Day Plan', actionType: 'copy_text' },
        { id: 'act-open-cal', label: 'View in Calendar', actionType: 'view_meeting' },
      ],
    };
  }

  // 4. Where is Proposal / Document search
  if (q.includes('proposal') || q.includes('where is') || q.includes('document') || q.includes('brief')) {
    const sources = [MOCK_CHAT_SOURCES.driveProposal, MOCK_CHAT_SOURCES.notionRoadmap];
    return {
      text: `The **Project Alpha Proposal** is located in your **Google Drive** root workspace as:

📄 **\`Project_Alpha_Master_Brief_v2.pdf\`**  
- **Location**: \`/Shared Drives/Product Strategy/Project Alpha/\`
- **Last Modified**: August 11 by Aryan
- **Key Summary**: Section 4.1 outlines target deliverables, architectural scope, and sign-off criteria scheduled for Monday, August 18.
- **Related Documentation**: Linked to the *Alpha Engineering Roadmap* in **Notion** (Sprint 14).`,
      sourcesUsed: sources,
      actions: [
        { id: 'act-open-drive', label: 'Preview Document', actionType: 'open_source', payload: MOCK_CHAT_SOURCES.driveProposal },
        { id: 'act-copy-link', label: 'Copy Document Path', actionType: 'copy_text' },
      ],
    };
  }

  // 5. Rahul's Email / Communication queries
  if (q.includes('rahul') || (q.includes('email') && !q.includes('write'))) {
    const sources = [MOCK_CHAT_SOURCES.gmailAlpha, MOCK_CHAT_SOURCES.calendarSync];
    return {
      text: `**Rahul Mehta** sent an email today at **9:15 AM** with the subject:  
✉️ *"Project Alpha spec review & timeline"*

> *"We are aiming for Friday COB to submit the final spec review before release."*

### Key Context & Findings:
1. **Deadline Ambiguity**: Rahul's email targets Friday 5:00 PM, while your project master document lists Monday August 18.
2. **Scheduled Sync**: You have a 1-on-1 Sync with Rahul tomorrow at **10:00 AM** to reconcile these milestones.`,
      sourcesUsed: sources,
      findings: [
        {
          id: 'find-email-1',
          type: 'conflict',
          title: 'Timeline discrepancy with Rahul',
          timestamp: 'Today, 9:15 AM',
          description: 'Client email asks for Friday COB, but master project brief specifies Monday.',
          sources: [MOCK_CHAT_SOURCES.gmailAlpha, MOCK_CHAT_SOURCES.driveProposal],
          actionLabel: 'Review Conflict →',
          actionType: 'review_conflict',
        },
      ],
      actions: [
        { id: 'act-draft-reply', label: 'Draft Reply to Rahul', actionType: 'draft_reply' },
        { id: 'act-review-conflict', label: 'Review Conflict Details', actionType: 'review_conflict' },
      ],
    };
  }

  // 6. Meetings / Calendar queries
  if (q.includes('meeting') || q.includes('calendar') || q.includes('events')) {
    const sources = [MOCK_CHAT_SOURCES.calendarSync, MOCK_CHAT_SOURCES.calendarClientCall];
    return {
      text: `You have **2 upcoming meetings** scheduled on your Google Calendar for tomorrow:

1. **Project Alpha Sync** (10:00 AM – 10:45 AM)
   - **Attendees**: Rahul Mehta, Dev Leads, Aryan
   - **Agenda**: Milestone sign-off, spec review, and Friday vs. Monday timeline confirmation.
   - **Attachments**: *Project_Alpha_Master_Brief_v2.pdf*

2. **Client Review & Feedback Session** (01:30 PM – 02:15 PM)
   - **Attendees**: Rahul Mehta, Product Operations
   - **Location**: Google Meet (Sync Room 4)`,
      sourcesUsed: sources,
      actions: [
        { id: 'act-prep-brief', label: 'Prepare Meeting Briefing', actionType: 'view_meeting' },
        { id: 'act-view-cal', label: 'Open Google Calendar', actionType: 'view_meeting' },
      ],
    };
  }

  // 7. What Changed / Deadline conflicts / Project Alpha status
  if (q.includes('what changed') || q.includes('conflict') || q.includes('alpha') || q.includes('deadline')) {
    const sources = [
      MOCK_CHAT_SOURCES.gmailAlpha,
      MOCK_CHAT_SOURCES.calendarSync,
      MOCK_CHAT_SOURCES.driveProposal,
      MOCK_CHAT_SOURCES.notionRoadmap,
    ];
    return {
      text: `NEXORBIT analyzed your workspace updates across **Gmail**, **Calendar**, **Google Drive**, and **Notion**. Here are the critical insights:

### ⚠️ Primary Attention Item:
- **Deadline Conflict Detected**: Rahul's latest email notes **Friday COB** as the deliverable deadline, whereas the master scope document (*Project_Alpha_Master_Brief_v2.pdf*) targets **Monday, August 18**.

### 📊 Sprint 14 Status:
- 8 engineering tasks completed in **Notion**, 2 tasks in code review.
- PR #142 (*Core API Alignment*) merged successfully on **GitHub**.
- Sync meeting scheduled for **Tomorrow at 10:00 AM**.`,
      sourcesUsed: sources,
      findings: [
        {
          id: 'find-alpha-1',
          type: 'conflict',
          title: 'Deadline conflict: Friday vs Monday',
          timestamp: '2 min ago',
          description: 'Client email mentions Friday while project document specifies Monday.',
          sources: [MOCK_CHAT_SOURCES.gmailAlpha, MOCK_CHAT_SOURCES.driveProposal],
          actionLabel: 'Review Conflict →',
          actionType: 'review_conflict',
        },
        {
          id: 'find-alpha-2',
          type: 'meeting',
          title: 'Project Alpha Sync tomorrow',
          timestamp: '10:00 AM',
          description: 'Sync scheduled with 4 attendees to finalize release date.',
          sources: [MOCK_CHAT_SOURCES.calendarSync],
          actionLabel: 'View Meeting →',
          actionType: 'view_meeting',
        },
      ],
      actions: [
        { id: 'act-conflict', label: 'Review Conflict Analysis', actionType: 'review_conflict' },
        { id: 'act-draft', label: 'Draft Clarification Email', actionType: 'draft_reply' },
      ],
    };
  }

  // Default Universal Response
  const isConnectedSearch = mode === 'connected' || (mode === 'auto' && (q.includes('my') || q.includes('team') || q.includes('project')));

  if (isConnectedSearch) {
    const sources = [MOCK_CHAT_SOURCES.driveProposal, MOCK_CHAT_SOURCES.notionRoadmap, MOCK_CHAT_SOURCES.gmailAlpha];
    return {
      text: `Based on your connected workspace records across **Google Drive**, **Notion**, and **Gmail**:

- **Current Workspace Context**: Working on Project Alpha milestone verification and Sprint 14 delivery.
- **Relevant Insights**: We cross-referenced your query against 3 indexed items. All documents and emails are in sync with your local cache.

Is there a specific detail, document excerpt, or draft communication you would like NEXORBIT to generate?`,
      sourcesUsed: sources,
      actions: [
        { id: 'act-more', label: 'Search More Files', actionType: 'custom' },
        { id: 'act-copy-gen', label: 'Copy Summary', actionType: 'copy_text' },
      ],
    };
  }

  return {
    text: `Here is the analysis for: **"${query}"**

1. **Strategic Perspective**: Clarifying scope, dependencies, and execution milestones ensures clean alignment across your workflow.
2. **Recommended Approach**: Break the objective down into incremental deliverables with verifiable verification criteria.
3. **Execution Ready**: NEXORBIT can assist with drafting specifications, writing code, generating emails, or retrieving referenced workspace artifacts whenever needed.`,
    actions: [
      { id: 'act-copy-default', label: 'Copy Answer', actionType: 'copy_text' },
    ],
  };
}
