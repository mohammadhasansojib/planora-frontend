# Copilot Instructions

## 1. Project Overview

This is the frontend application for **Planora — Project Management System**.

Technology stack:

* Next.js 16
* App Router
* TypeScript
* Tailwind CSS
* shadcn/ui

The frontend integrates with an existing backend API.

The backend API is the source of truth for:

* Available endpoints
* Request and response structures
* Authentication behavior
* Business rules
* Supported functionality

---

## 2. Source of Truth

Before implementing a feature, review the relevant project documentation:

* `PRD.md` — product requirements and scope
* `DESIGN.md` — UI/UX and design rules
* `API.md` — documented backend API
* `PHASES.md` — implementation phases and workflow

Do not invent functionality that is not supported by these documents or the existing backend API.

If the required backend behavior is unclear, do not assume it.

Ask for clarification or identify the uncertainty before implementing it.

---

## 3. Development Approach

Development should be incremental.

Follow this workflow:

```text
Phase
  ↓
Feature
  ↓
Small Task
  ↓
Implementation
  ↓
Code Review
  ↓
Run
  ↓
Test with Backend
  ↓
Fix
  ↓
Commit
```

Do not implement an entire phase or multiple unrelated features in one request unless explicitly instructed.

Prefer small, focused changes.

---

## 4. Role of Copilot

Copilot is an implementation assistant.

Copilot may help with:

* Writing components
* Writing forms
* Creating API functions
* Creating TypeScript types
* Implementing loading/error/empty states
* Reusing shadcn/ui components
* Writing repetitive code
* Refactoring existing code
* Fixing identified bugs
* Writing tests when requested

Copilot must not independently decide:

* Product requirements
* Feature scope
* Application architecture
* Business rules
* API behavior
* Authentication strategy
* Data model changes
* New major dependencies
* New product features

The developer makes these decisions.

---

## 5. Implementation Rules

### Follow Existing Documentation

Always follow `PRD.md`, `DESIGN.md`, `API.md`, and `PHASES.md`.

Do not contradict the documented requirements.

### Keep Changes Focused

When asked to implement a task:

* Modify only the necessary files.
* Avoid unrelated refactoring.
* Avoid changing working code without a reason.
* Do not introduce unnecessary abstractions.

### Prefer Simplicity

Use the simplest implementation that satisfies the requirement.

Do not introduce:

* Complex state management without a clear need.
* Extra libraries without approval.
* Over-engineered abstractions.
* Premature optimization.

### Reuse Existing Components

Prefer existing shadcn/ui components and project components.

Before creating a new reusable component, check whether an existing component can be reused.

Extract a component when it provides meaningful reuse or consistency.

---

## 6. Next.js Guidelines

Use the Next.js App Router conventions already established by the project.

Prefer:

* Server Components by default.
* Client Components only when client-side behavior is required.
* Route-based organization.
* TypeScript throughout the project.

Do not add `"use client"` unnecessarily.

Do not move logic between Server and Client Components without a clear reason.

---

## 7. TypeScript Guidelines

Use TypeScript strictly and prefer explicit types for:

* API request data
* API response data
* Component props
* Form data
* Important application state

Avoid:

```ts
any
```

unless there is a documented and necessary reason.

Do not silence TypeScript errors simply to make the build pass.

---

## 8. API Integration

Use the documented backend API from `API.md`.

Important rules:

* Use the configured API base URL.
* Match documented HTTP methods and paths.
* Match documented request structures.
* Handle API responses explicitly.
* Handle API errors appropriately.
* Do not hardcode production API URLs inside components.
* Keep API communication separate from presentation where practical.

Do not create frontend endpoints that do not exist in the backend.

If the backend API and documentation appear inconsistent, stop and identify the mismatch instead of guessing.

---

## 9. Authentication

Authentication must follow the existing backend API.

Supported documented operations include:

* Register
* Login
* Refresh token
* Google authentication

The frontend should:

* Maintain authenticated state correctly.
* Handle expired access tokens according to the documented refresh flow.
* Protect authenticated application areas.
* Handle logout appropriately.
* Avoid exposing sensitive authentication data unnecessarily.

Do not invent a different authentication mechanism.

---

## 10. UI and Design

Follow `DESIGN.md`.

The UI should be:

* Clean
* Simple
* Consistent
* Responsive
* Accessible
* Practical

Prefer shadcn/ui components when appropriate.

Maintain consistency in:

* Buttons
* Forms
* Dialogs
* Tables
* Cards
* Badges
* Navigation
* Spacing
* Typography
* Feedback states

Avoid unnecessary:

* Animations
* Gradients
* Decorative elements
* Shadows
* Complex interactions

---

## 11. Forms

Forms should:

* Have clear labels.
* Validate user input.
* Display useful validation messages.
* Prevent duplicate submission.
* Show a loading/submitting state.
* Display API errors.
* Preserve user input when practical.
* Use appropriate input types.

Use clear action labels such as:

* Create
* Save
* Update
* Cancel
* Delete

Avoid vague labels such as:

* Submit
* Click Here
* Continue

when a more descriptive action is possible.

---

## 12. Loading, Empty, and Error States

Every data-driven feature should consider:

### Loading

Show an appropriate loading state while data is being requested.

### Empty

Explain when no data exists and provide a useful next action when appropriate.

Example:

```text
No projects yet.
Create your first project to get started.
```

### Error

Show a clear user-friendly error message.

Do not expose raw backend errors directly when they are not suitable for users.

Provide retry actions when appropriate.

---

## 13. Responsive Design

The application must work across:

* Desktop
* Tablet
* Mobile

Do not design only for desktop and attempt to fix mobile later.

When implementing a UI feature, consider smaller screens during the initial implementation.

Tables, forms, dialogs, navigation, and primary actions should remain usable on mobile.

---

## 14. Accessibility

Use accessible HTML and components.

Pay attention to:

* Labels
* Keyboard navigation
* Focus states
* Dialog accessibility
* Button names
* Form controls
* Color contrast
* Semantic HTML

Prefer accessible shadcn/ui components where available.

Do not rely only on color to communicate important information.

---

## 15. Code Quality

Code should be:

* Readable
* Maintainable
* Consistent
* Type-safe
* Focused

Prefer small functions and components with clear responsibilities.

Avoid deeply nested logic when it can be simplified.

Avoid duplication when a meaningful reusable abstraction exists.

Do not refactor unrelated code while implementing a small feature.

---

## 16. Error Handling

Handle expected failures explicitly.

Examples:

* Validation errors
* Unauthorized requests
* Forbidden actions
* Not found responses
* Network failures
* Server errors

User-facing messages should be understandable.

Do not hide errors silently.

Do not use generic success messages when the operation actually failed.

---

## 17. Dependencies

Do not add a new package unless:

1. It is necessary for the requested feature.
2. Existing project dependencies cannot reasonably solve the problem.
3. The dependency is explicitly approved by the developer.

Prefer existing:

* Next.js functionality
* TypeScript
* Tailwind CSS
* shadcn/ui
* Existing project utilities

---

## 18. File and Folder Changes

Before creating a new file:

1. Check whether an existing file already serves the purpose.
2. Follow the project's existing folder structure.
3. Keep related functionality together.
4. Avoid unnecessary folder nesting.

Do not reorganize the project structure without an explicit task requiring it.

---

## 19. Testing and Verification

After implementing a task:

1. Check TypeScript errors.
2. Check lint/build errors where applicable.
3. Run the application.
4. Test the feature with the real backend when the feature depends on backend functionality.
5. Verify loading, success, empty, and error states where applicable.
6. Verify responsive behavior for UI changes.

Do not consider a feature complete only because the code compiles.

---

## 20. Working with the Developer

When given a task:

### Before coding

Understand:

* What is being requested.
* Which phase it belongs to.
* Which documentation applies.
* Which existing code should be reused.

If the task is unclear, ask for clarification instead of making major assumptions.

### During coding

Keep the implementation focused on the requested task.

Do not silently expand the scope.

### After coding

Briefly explain:

* What was changed.
* Which files were changed.
* Any important implementation decisions.
* Anything that still needs verification.

---

## 21. Do Not Do This

Do not:

* Build the entire application from one prompt.
* Invent backend endpoints.
* Invent business rules.
* Change the product requirements.
* Replace the architecture without approval.
* Add unnecessary dependencies.
* Rewrite unrelated code.
* Over-engineer simple features.
* Skip testing with the real backend.
* Hide errors to make the UI appear successful.
* Implement features outside the current phase without approval.

---

## 22. Implementation Principle

The goal is not to generate as much code as possible.

The goal is to build Planora incrementally with:

**Understand → Implement → Test → Review → Commit → Continue**

The developer controls the architecture, requirements, scope, and decisions.

Copilot assists with implementation while keeping the codebase simple, maintainable, and aligned with the project documentation.
