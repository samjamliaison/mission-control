import { Task } from "@/components/tasks/task-card"

export interface TaskTemplate {
  id: string
  name: string
  category: string
  icon: string
  description: string
  title: string
  taskDescription: string
  priority: "low" | "medium" | "high"
  suggestedAssignee?: string
  tags?: string[]
  estimatedDuration?: string
  color: string
}

export const taskTemplates: TaskTemplate[] = [
  {
    id: "bug-fix",
    name: "Bug Fix",
    category: "Development",
    icon: "🐛",
    description: "Investigate and resolve software bugs or system issues",
    title: "Fix: [Bug Description]",
    taskDescription: `**Issue Description:**
[Describe the bug or issue]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2] 
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Priority:** Critical/High/Medium/Low
**Affected Systems:** [List affected components]
**Assigned to:** [Team member]

**Acceptance Criteria:**
- [ ] Issue is identified and root cause determined
- [ ] Fix is implemented and tested
- [ ] No regression issues introduced
- [ ] Documentation updated if needed`,
    priority: "high",
    suggestedAssignee: "Manus",
    tags: ["bug", "development", "fix"],
    estimatedDuration: "2-4 hours",
    color: "#ef4444"
  },
  {
    id: "feature-request",
    name: "Feature Request",
    category: "Development",
    icon: "✨",
    description: "Implement new feature or functionality",
    title: "Feature: [Feature Name]",
    taskDescription: `**Feature Overview:**
[Brief description of the feature]

**User Story:**
As a [user type], I want [functionality] so that [benefit].

**Requirements:**
- [ ] [Requirement 1]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

**Acceptance Criteria:**
- [ ] Feature works as specified
- [ ] UI/UX meets design requirements  
- [ ] All edge cases handled
- [ ] Tests written and passing
- [ ] Documentation updated

**Technical Notes:**
[Any technical considerations or constraints]

**Dependencies:**
[List any dependencies on other tasks or systems]`,
    priority: "medium",
    suggestedAssignee: "Jarvis",
    tags: ["feature", "development", "enhancement"],
    estimatedDuration: "1-3 days",
    color: "#8b5cf6"
  },
  {
    id: "research",
    name: "Research",
    category: "Analysis",
    icon: "🔬",
    description: "Research and investigate new technologies or approaches",
    title: "Research: [Research Topic]",
    taskDescription: `**Research Objective:**
[What are we trying to learn or discover?]

**Research Questions:**
- [Question 1]
- [Question 2]
- [Question 3]

**Methodology:**
- [ ] Literature review
- [ ] Competitor analysis  
- [ ] Technical feasibility study
- [ ] Proof of concept development
- [ ] Expert interviews

**Deliverables:**
- [ ] Research findings document
- [ ] Recommendations and next steps
- [ ] Technical specifications (if applicable)
- [ ] Cost-benefit analysis

**Timeline:**
[Expected completion date]

**Success Metrics:**
[How will we measure success?]`,
    priority: "low",
    suggestedAssignee: "Luna",
    tags: ["research", "analysis", "investigation"],
    estimatedDuration: "3-5 days",
    color: "#06b6d4"
  },
  {
    id: "content-creation",
    name: "Content Creation",
    category: "Content",
    icon: "📝",
    description: "Create marketing content, documentation, or media",
    title: "Content: [Content Title]",
    taskDescription: `**Content Type:**
[Blog post / Video / Documentation / Social media / etc.]

**Target Audience:**
[Who is this content for?]

**Content Goals:**
- [ ] [Goal 1]
- [ ] [Goal 2] 
- [ ] [Goal 3]

**Content Outline:**
1. [Section 1]
2. [Section 2]
3. [Section 3]

**Key Messages:**
- [Message 1]
- [Message 2]
- [Message 3]

**Distribution Channels:**
- [ ] Website/Blog
- [ ] Social media
- [ ] Email newsletter
- [ ] Documentation site

**Success Metrics:**
- Views/reads target: [number]
- Engagement rate: [percentage]
- Conversions: [number]

**Due Date:** [Date]
**Review Required:** [Yes/No]`,
    priority: "medium",
    suggestedAssignee: "Monica",
    tags: ["content", "marketing", "communication"],
    estimatedDuration: "4-8 hours",
    color: "#f59e0b"
  },
  {
    id: "deployment",
    name: "Deploy",
    category: "Operations",
    icon: "🚀",
    description: "Deploy applications or infrastructure changes",
    title: "Deploy: [System/Application Name]",
    taskDescription: `**Deployment Target:**
[Environment: Production / Staging / Development]

**What's Being Deployed:**
- [ ] Application version: [version number]
- [ ] Database changes: [Yes/No]
- [ ] Configuration updates: [Yes/No]
- [ ] Infrastructure changes: [Yes/No]

**Pre-Deployment Checklist:**
- [ ] Code reviewed and approved
- [ ] Tests passing in CI/CD
- [ ] Staging deployment successful
- [ ] Database backup created
- [ ] Rollback plan prepared

**Deployment Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Post-Deployment Verification:**
- [ ] Application starts successfully
- [ ] Key functionality verified
- [ ] Performance metrics normal
- [ ] No critical errors in logs

**Rollback Plan:**
[How to rollback if issues occur]

**Scheduled Time:** [Date and time]
**Expected Downtime:** [Duration]`,
    priority: "high",
    suggestedAssignee: "Hamza",
    tags: ["deployment", "operations", "release"],
    estimatedDuration: "1-2 hours",
    color: "#10b981"
  }
]

export const getTemplateById = (id: string): TaskTemplate | undefined => {
  return taskTemplates.find(template => template.id === id)
}

export const getTemplatesByCategory = (category: string): TaskTemplate[] => {
  return taskTemplates.filter(template => template.category === category)
}

export const getAllCategories = (): string[] => {
  return Array.from(new Set(taskTemplates.map(template => template.category)))
}

export const createTaskFromTemplate = (template: TaskTemplate, customizations?: Partial<Task>): Partial<Task> => {
  return {
    title: template.title,
    description: template.taskDescription,
    priority: template.priority,
    assignee: template.suggestedAssignee || "",
    status: "todo" as const,
    ...customizations
  }
}