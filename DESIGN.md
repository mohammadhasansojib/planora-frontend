# Design Document

## 1. Design Overview

### Product

**Planora — Project Management System**

Planora should provide a clean, practical interface for managing organizations, teams, projects, sprints, and tasks.

The design should prioritize:

* Clarity
* Simplicity
* Fast navigation
* Consistency
* Responsive behavior
* Minimal visual clutter

The interface should feel like a practical productivity application rather than a marketing website.

---

## 2. Design Principles

### 2.1 Simple

Avoid unnecessary UI elements, animations, and decorative components.

Every element should have a clear purpose.

### 2.2 Consistent

Use the same:

* Button styles
* Form patterns
* Cards
* Dialogs
* Tables
* Badges
* Navigation patterns
* Spacing
* Typography

throughout the application.

### 2.3 Action-Oriented

Common actions should be easy to discover.

Examples:

* Create Organization
* Create Team
* Create Project
* Create Sprint
* Create Task
* Add Comment
* Add Subtask
* Upload Attachment

### 2.4 Feedback-Oriented

Every asynchronous action should provide appropriate feedback.

Examples:

* Loading state
* Success feedback
* Validation error
* API error
* Empty state

---

## 3. Visual Direction

### Overall Style

Use a modern SaaS/productivity-app style.

The interface should be:

* Clean
* Professional
* Minimal
* Spacious
* Easy to scan

Avoid excessive gradients, shadows, animations, and decorative illustrations.

### Theme

Support the existing shadcn/ui theme system.

The UI should work well with:

* Light mode
* Dark mode

Do not introduce a separate custom design system when an existing shadcn/ui component can satisfy the requirement.

---

## 4. Application Layout

The authenticated application should use a dashboard-style layout.

### Desktop

```text
┌──────────────────────────────────────────────────────┐
│ Header                                                │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│ Sidebar      │ Main Content                          │
│              │                                       │
│ Navigation   │ Page                                  │
│              │                                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘
```

### Sidebar

The sidebar should provide access to the major application areas.

Possible navigation:

* Dashboard
* Organizations
* Teams
* Projects
* Tasks

Context-specific navigation may appear when the user enters a project.

### Header

The header may contain:

* Current page/context
* Search where appropriate
* Theme toggle
* User/profile menu
* Logout

The header should remain simple and should not contain unnecessary controls.

---

## 5. Main Navigation Structure

The navigation should reflect the application's hierarchy.

```text
Dashboard

Organizations
  └── Organization
       ├── Members
       └── Teams

Teams
  └── Team
       ├── Members
       └── Projects

Projects
  └── Project
       ├── Overview
       ├── Sprints
       ├── Tasks
       └── Members

Tasks
  └── Task Details
       ├── Subtasks
       ├── Comments
       └── Attachments
```

The exact navigation should be refined during implementation based on usability.

---

## 6. Page Design Pattern

Most application pages should follow a consistent structure:

```text
Page Header
├── Title
├── Description (optional)
└── Primary Action

Content
├── Filters/Search (when needed)
├── Main Data
└── Pagination (when needed)
```

Example:

```text
Projects
Manage your projects

                         + Create Project

------------------------------------------------

Search / Filters

Project list
```

---

## 7. Dashboard

The dashboard should provide a useful overview rather than duplicating every feature.

Possible information:

* Organizations
* Teams
* Projects
* Tasks
* Recent activity or relevant summaries

The dashboard should remain simple in the first version.

Do not build complex analytics unless required.

---

## 8. CRUD Interfaces

CRUD functionality should use consistent patterns.

### Create

Prefer a dialog or dedicated form depending on complexity.

Simple entities:

* Organization
* Team
* Project
* Sprint

can generally use dialogs.

More complex entities such as tasks may use a dedicated page or larger dialog.

### Edit

Use the same form structure as creation where possible.

### Delete

If deletion is supported by the backend later:

1. Ask for confirmation.
2. Clearly identify what will be deleted.
3. Provide success/error feedback.

---

## 9. Forms

Forms should:

* Have clear labels.
* Provide useful validation messages.
* Disable submission while submitting.
* Show server/API errors.
* Preserve user input when possible.
* Use appropriate input types.

Form actions should clearly communicate:

* Submit
* Cancel
* Save
* Create

Avoid ambiguous button labels.

---

## 10. Data Display

Use the appropriate UI pattern based on the amount and type of data.

### Lists

Use cards or simple list layouts for smaller collections.

### Tables

Use tables for structured data such as:

* Members
* Teams
* Projects
* Tasks

### Cards

Use cards when visual grouping is useful.

Avoid putting every piece of information inside a card just for decoration.

---

## 11. Task Management UI

Tasks are one of the main parts of Planora.

The task interface should make the following easy to understand:

* Task title
* Description
* Project
* Sprint
* Created/updated information
* Subtasks
* Comments
* Attachments

The task list should support the backend's available:

* Search
* Sorting
* Pagination

Task details should provide a clear separation between the main task information and collaboration features.

---

## 12. Status, Feedback, and States

Every data-driven page should account for four primary states.

### Loading

Show an appropriate skeleton or loading indicator.

### Success

Display the requested data.

### Empty

Explain what is missing and provide an action where appropriate.

Example:

> No projects yet. Create your first project to get started.

### Error

Display a clear message and provide a retry action where appropriate.

Avoid exposing raw backend errors directly to users.

---

## 13. Notifications

Use toast/notification feedback for short-lived operation results.

Examples:

* "Project created successfully."
* "Task assigned successfully."
* "Comment added successfully."
* "Failed to create project."

Persistent or important errors should be displayed closer to the relevant UI instead of relying only on a toast.

---

## 14. Responsive Design

### Desktop

Use the full dashboard layout with sidebar and main content.

### Tablet

Reduce unnecessary spacing and allow content areas to adapt.

### Mobile

The sidebar should transform into an appropriate mobile navigation pattern.

Tables should not simply overflow the screen.

Forms and dialogs should adapt to smaller screens.

Primary actions should remain easily accessible.

---

## 15. Accessibility

The UI should:

* Use semantic HTML.
* Provide labels for form controls.
* Support keyboard navigation.
* Maintain visible focus states.
* Use accessible dialog and dropdown behavior.
* Avoid relying only on color to communicate information.
* Maintain readable text contrast.

Use shadcn/ui components where they provide accessible behavior out of the box.

---

## 16. Component Reuse

Prefer reusable components for repeated patterns.

Examples:

```text
PageHeader
DataTable
EmptyState
LoadingState
ErrorState
ConfirmDialog
FormDialog
SearchInput
Pagination
UserAvatar
StatusBadge
```

Do not create abstractions prematurely.

A component should be extracted when:

* It is reused.
* It represents a meaningful UI pattern.
* Reuse improves consistency.

---

## 17. UI Technology

The frontend is built with:

* Next.js 16
* App Router
* TypeScript
* Tailwind CSS
* shadcn/ui

Prefer existing shadcn/ui components over building equivalent components from scratch.

---

## 18. Design Boundaries

The frontend should not invent product functionality that is not supported by the backend.

The backend API remains the source of truth for available operations and data.

Visual and UX improvements are encouraged, but they should not change the application's business rules.

---

## 19. Design Goal

The final interface should make the main workflow feel natural:

**Organization → Team → Project → Sprint → Task → Collaboration**

A user should be able to understand where they are, what they can do, and what happened after an action without needing to learn the interface first.
