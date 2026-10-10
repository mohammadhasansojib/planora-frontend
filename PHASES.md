# Implementation Phases

## 1. Overview

This document defines the implementation order for the Planora frontend.

The frontend should be developed incrementally rather than building the entire application at once.

The implementation workflow is:

```text
Phase
  ↓
Feature
  ↓
Small Task
  ↓
Implement
  ↓
Review
  ↓
Test with Backend
  ↓
Commit
```

Each phase should be completed and verified before moving to the next phase.

---

# 2. Development Principles

### 2.1 Build Incrementally

Do not implement multiple unrelated features at the same time.

Work on one focused feature or small task at a time.

### 2.2 Use the Real Backend

Whenever an API integration is available, test the frontend against the real backend.

Avoid building large amounts of mock functionality that will later need to be replaced.

### 2.3 Keep the First Version Simple

Implement the documented backend functionality first.

Avoid adding:

* Unnecessary features
* Complex abstractions
* Advanced state management without a need
* Premature optimization
* Undocumented backend functionality

### 2.4 Review Before Moving Forward

After each meaningful task:

1. Review the implementation.
2. Check the UI.
3. Test the API interaction.
4. Fix issues.
5. Commit the changes.

---

# 3. Phase 0 — Project Foundation

### Goal

Prepare the frontend project structure and development foundation.

### Tasks

* Confirm Next.js 16 App Router setup.
* Confirm TypeScript configuration.
* Confirm Tailwind CSS.
* Confirm shadcn/ui.
* Establish the application directory structure.
* Configure environment variables.
* Configure the API base URL.
* Establish basic reusable UI patterns.
* Add the initial application layout structure.
* Verify the project builds successfully.

### Expected Result

The project should have a clean foundation ready for feature development.

---

# 4. Phase 1 — Application Layout

### Goal

Build the basic authenticated application shell.

### Tasks

* Create dashboard layout.
* Create header.
* Create sidebar navigation.
* Add responsive navigation behavior.
* Add theme support.
* Create basic page container/layout components.
* Create initial dashboard page.
* Add placeholder navigation pages where necessary.

### Expected Result

The user can navigate through the main application structure.

The interface should already follow the approved `DESIGN.md`.

---

# 5. Phase 2 — Authentication

### Goal

Connect the frontend to the backend authentication system.

### API Features

```text
POST /auth/register
POST /auth/login
POST /auth/refresh-token
POST /auth/google
```

### Tasks

* Build registration page.
* Build login page.
* Connect registration API.
* Connect login API.
* Implement authenticated application state.
* Implement access-token handling.
* Implement refresh-token flow according to the final frontend authentication strategy.
* Handle authentication errors.
* Protect authenticated routes.
* Add logout behavior when supported by the frontend authentication flow.
* Add Google authentication if included in the first implementation.

### Expected Result

A user can register, log in, maintain an authenticated session, and access protected application areas.

---

# 6. Phase 3 — Organizations

### Goal

Implement organization management.

### API Features

```text
POST /organizations
GET /organizations
POST /organizations/:organizationId/members
```

### Tasks

* Create organization page/interface.
* Display user's organizations.
* Create organization form.
* Connect organization APIs.
* Add organization selection/context where required.
* Build organization member interface.
* Add member form.
* Handle loading, empty, success, and error states.

### Expected Result

A user can create organizations, view their organizations, and use the available organization member functionality.

---

# 7. Phase 4 — Teams

### Goal

Implement team management.

### API Features

```text
POST /teams
POST /teams/:teamId/members
GET /teams/:teamId/members
GET /teams
```

### Tasks

* Build teams page.
* Display teams.
* Add pagination.
* Create team form.
* Connect team creation API.
* Build team member interface.
* Add team member form.
* Display the team's current member roster.
* Handle API states.
* Connect organization context where required.

### Expected Result

A user can view teams, create teams, and use the documented team-member functionality.

---

# 8. Phase 5 — Projects

### Goal

Implement project management.

### API Features

```text
POST /projects
POST /projects/:projectId/members
GET /projects/:projectId/members
GET /projects
```

### Tasks

* Build projects page.
* Display projects.
* Add pagination.
* Create project form.
* Connect project creation API.
* Build project details/context.
* Build project member interface.
* Add project member form.
* Display the project's current member roster.
* Handle loading, empty, success, and error states.

### Expected Result

A user can view projects, create projects, and use the documented project-member functionality.

---

# 9. Phase 6 — Sprints

### Goal

Implement sprint creation and project-based sprint management.

### API Feature

```text
POST /sprints
```

### Tasks

* Build project sprint section.
* Display sprint information.
* Create sprint form.
* Add start date/time input.
* Add end date/time input.
* Connect sprint creation API.
* Handle validation.
* Handle loading and API errors.

### Expected Result

A user can create sprints associated with projects and view the resulting sprint information.

---

# 10. Phase 7 — Tasks

### Goal

Implement the main task management functionality.

### API Features

```text
POST /tasks
GET /tasks
POST /tasks/:taskId/assign
```

### Tasks

* Build task list.
* Build task creation form.
* Connect task creation API.
* Display task information.
* Implement search.
* Implement sorting.
* Implement pagination.
* Build task details interface.
* Implement task-to-sprint assignment.
* Handle loading, empty, success, and error states.

### Expected Result

A user can create, view, search, sort, paginate, and assign tasks to sprints.

---

# 11. Phase 8 — Task Collaboration

### Goal

Add collaboration features to task details.

### API Features

```text
POST /tasks/:taskId/subtasks
POST /tasks/:taskId/attachment
POST /comments
```

### Tasks

#### Subtasks

* Add subtask section.
* Create subtask form.
* Connect subtask API.
* Display created subtasks.

#### Comments

* Add comment section.
* Create comment form.
* Connect comment API.
* Display created comments.

#### Attachments

* Add attachment section.
* Build file upload interface.
* Use multipart form submission.
* Connect attachment API.
* Display returned attachment information.

### Expected Result

A user can collaborate on tasks through subtasks, comments, and attachments.

---

# 12. Phase 9 — Payments

### Goal

Implement the documented payment flow.

### API Features

```text
POST /payments/create-payment
POST /payments/callback
```

### Tasks

* Build payment initiation UI.
* Connect payment creation API.
* Handle returned payment information.
* Redirect the user to the returned payment URL.
* Handle payment success state.
* Handle payment failure state.
* Handle payment cancellation state.
* Implement frontend callback/success routing based on the final backend behavior.

### Expected Result

The frontend can initiate the supported payment flow and display the appropriate payment state.

---

# 13. Phase 10 — UX and Responsive Refinement

### Goal

Improve the overall application experience after the core functionality works.

### Tasks

* Review all pages against `DESIGN.md`.
* Improve spacing and visual hierarchy.
* Verify responsive behavior.
* Improve mobile navigation.
* Review forms.
* Review loading states.
* Review empty states.
* Review error states.
* Review success feedback.
* Review dialogs.
* Review tables and lists.
* Improve accessibility.
* Remove unnecessary UI complexity.

### Expected Result

The application should feel consistent and polished across desktop, tablet, and mobile.

---

# 14. Phase 11 — Integration Testing and Final Review

### Goal

Verify that the complete frontend works correctly with the backend.

### Tasks

Test the main workflow:

```text
Register/Login
      ↓
Organization
      ↓
Team
      ↓
Project
      ↓
Sprint
      ↓
Task
      ↓
Subtask / Comment / Attachment
      ↓
Payment
```

Verify:

* Authentication.
* Protected routes.
* API requests.
* API responses.
* Form validation.
* Loading states.
* Empty states.
* Error handling.
* Pagination.
* Search.
* Sorting.
* File uploads.
* Payment flow.
* Responsive behavior.
* Accessibility basics.

### Expected Result

The complete documented backend functionality should be usable through the frontend.

---

# 15. Phase Completion Criteria

A phase is considered complete when:

* The planned functionality is implemented.
* The UI follows `DESIGN.md`.
* The implementation uses the documented API.
* Basic error handling exists.
* Loading states exist where appropriate.
* The feature works with the real backend.
* No obvious regressions are introduced.
* The code has been reviewed.
* Changes have been committed.

Do not move to the next phase simply because the code has been written.

The feature should be **implemented, tested, reviewed, and working**.

---

# 16. Task Granularity

Each phase should be divided into small implementation tasks.

Example:

```text
Phase 7 — Tasks

Task 1
Create task API function.

Task 2
Create task form.

Task 3
Connect form to API.

Task 4
Create task list.

Task 5
Add task search.

Task 6
Add task sorting.

Task 7
Add pagination.

Task 8
Create task details.

Task 9
Add sprint assignment.

Task 10
Test complete task flow.
```

Do not ask Copilot to implement the entire phase in one request.

---

# 17. Copilot Workflow

GitHub Copilot should be used as an implementation assistant.

For each task:

```text
1. Define the task.
2. Review existing documentation.
3. Ask Copilot for the specific implementation.
4. Review generated code.
5. Run the application.
6. Test the feature.
7. Fix issues.
8. Commit.
```

Copilot should not decide:

* Product requirements.
* Application architecture.
* Feature scope.
* API behavior.
* Business rules.

Those decisions remain controlled by the project documentation and developer.

---

# 18. Recommended Implementation Order

The implementation order is:

```text
Phase 0
Project Foundation
        ↓
Phase 1
Application Layout
        ↓
Phase 2
Authentication
        ↓
Phase 3
Organizations
        ↓
Phase 4
Teams
        ↓
Phase 5
Projects
        ↓
Phase 6
Sprints
        ↓
Phase 7
Tasks
        ↓
Phase 8
Task Collaboration
        ↓
Phase 9
Payments
        ↓
Phase 10
UX & Responsive Refinement
        ↓
Phase 11
Integration Testing & Final Review
```

This order follows the application's main dependency hierarchy:

**Organization → Team → Project → Sprint → Task → Collaboration**

---

# 19. Scope Control

If a new feature is discovered during implementation:

1. Determine whether it is already supported by the backend.
2. Determine whether it is required by the PRD.
3. Determine whether it belongs to the current phase.
4. If not, record it for a later phase or update the project documentation first.

Do not expand the current task unnecessarily.

The goal is to keep implementation controlled and avoid turning a small task into a large feature.

---

# 20. Guiding Principle

Build Planora in small, working increments.

**Do not optimize for writing the most code.**

Optimize for:

**Understand → Implement → Test → Review → Commit → Continue**
