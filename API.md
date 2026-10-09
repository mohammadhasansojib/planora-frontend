# API Documentation

## 1. API Overview

### Base URL

```text
http://localhost:5000/api/v1
```

All endpoint paths in this document are relative to the base URL.

Example:

```text
POST /auth/login
```

Full URL:

```text
http://localhost:5000/api/v1/auth/login
```

### Authentication

Endpoints marked with `auth: true` require authentication.

The authentication API currently provides access-token and refresh-token flows.

The frontend should follow the backend API behavior and should not assume additional authentication mechanisms that are not documented here.

---

# 2. Authentication

## 2.1 Register

**POST**

```text
/auth/register
```

### Authentication

```text
auth: false
```

### Request Body

```json
{
  "username": "Hasan",
  "email": "hasan@mail.com",
  "password": "12345678"
}
```

### Response

```json
{
  "success": true,
  "message": "Registration successful",
  "statusCode": 201,
  "data": {
    "user": {
      "id": "acc950d1-32d4-4764-adaf-5a311f022acd",
      "username": "Hasan",
      "email": "hasan@mail.com",
      "createdAt": "2026-09-04T10:27:16.446Z",
      "updatedAt": "2026-09-04T10:27:16.446Z"
    }
  }
}
```

---

## 2.2 Login

**POST**

```text
/auth/login
```

### Authentication

```text
auth: false
```

### Request Body

```json
{
  "email": "hasan@mail.com",
  "password": "12345678"
}
```

### Response

```json
{
  "success": true,
  "message": "login successful",
  "statusCode": 200,
  "data": {
    "accessToken": "access_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

The backend sets `accessToken` and `refreshToken` as HttpOnly cookies. The
access cookie lasts 24 hours and the refresh cookie lasts 7 days. Frontend
requests that need these cookies must use `credentials: "include"`. Frontend
JavaScript must not read or persist token values.

---

## 2.3 Refresh Token

**POST**

```text
/auth/refresh-token
```

### Authentication

```text
auth: false
```

### Request Body

No request body is required. The backend reads the `refreshToken` HttpOnly
cookie.

### Response

```json
{
  "success": true,
  "message": "token refreshed sucessfully",
  "statusCode": 200,
  "data": {
    "newAccessToken": "new_access_token_here"
  }
}
```

The backend sets the renewed `accessToken` HttpOnly cookie. The frontend must
send this request with `credentials: "include"` and must not read or persist
the token returned in the response body.

---

## 2.4 Logout

**POST**

```text
/auth/logout
```

### Authentication

```text
auth: true
```

### Request Body

No request body is required. The backend authenticates using the
`accessToken` HttpOnly cookie and clears both authentication cookies.

### Response

```json
{
  "success": true,
  "message": "user logout successfully",
  "statusCode": 200,
  "data": {
    "user": {
      "id": "acc950d1-32d4-4764-adaf-5a311f022acd",
      "email": "hasan@mail.com"
    }
  }
}
```

The frontend must send this request with `credentials: "include"`.

---

## 2.5 Google Authentication

**POST**

```text
/auth/google
```

### Authentication

```text
auth: false
```

### Request Body

```json
{
  "idToken": "id_token_from_google_here"
}
```

### Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "New tokens generated successfully",
  "data": {
    "accessToken": "access_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

---

# 3. Organizations

## 3.1 Create Organization

**POST**

```text
/organizations
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "name": "my org"
}
```

### Response

```json
{
  "success": true,
  "message": "Organization created successfully",
  "statusCode": 201,
  "data": {
    "organization": {
      "id": "organization-id",
      "name": "my org",
      "createdAt": "2026-09-05T05:03:00.520Z",
      "updatedAt": "2026-09-05T05:03:00.520Z"
    }
  }
}
```

---

## 3.2 Get User Organizations

**GET**

```text
/organizations
```

### Authentication

```text
auth: true
```

### Response

```json
{
  "success": true,
  "message": "get user's organizations successfully",
  "statusCode": 200,
  "data": {
    "organizations": [
      {
        "id": "organization-id",
        "name": "my org",
        "createdAt": "2026-09-05T05:03:00.520Z",
        "updatedAt": "2026-09-05T05:03:00.520Z"
      }
    ]
  }
}
```

---

## 3.3 Add Organization Member

**POST**

```text
/organizations/:organizationId/members
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "email": "member@example.com"
}
```

The email must belong to an existing user. The API also continues to accept
`userId` for callers that already have the user's ID.

### Response

```json
{
  "success": true,
  "message": "Member added successfully",
  "statusCode": 201,
  "data": {
    "member": {
      "id": "member-id",
      "organizationId": "organization-id",
      "userId": "user-id",
      "role": "MEMBER",
      "createdAt": "2026-09-05T05:06:33.345Z",
      "updatedAt": "2026-09-05T05:06:33.345Z"
    }
  }
}
```

---

# 4. Teams

## 4.1 Create Team

**POST**

```text
/teams
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "name": "My Second Team",
  "organizationId": "organization-id"
}
```

### Response

```json
{
  "success": true,
  "message": "Team created successfully",
  "statusCode": 201,
  "data": {
    "team": {
      "id": "team-id",
      "name": "My Second Team",
      "organizationId": "organization-id",
      "createdAt": "2026-09-05T09:32:02.137Z",
      "updatedAt": "2026-09-05T09:32:02.137Z"
    }
  }
}
```

---

## 4.2 Add Team Member

**POST**

```text
/teams/:teamId/members
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "userId": "user-id",
  "role": "MEMBER"
}
```

### Response

```json
{
  "success": true,
  "message": "Member added to team successfully",
  "statusCode": 201,
  "data": {
    "member": {
      "id": "member-id",
      "teamId": "team-id",
      "userId": "user-id",
      "role": "MEMBER",
      "createdAt": "2026-09-05T09:59:40.064Z",
      "updatedAt": "2026-09-05T09:59:40.064Z"
    }
  }
}
```

---

## 4.3 Get Teams

**GET**

```text
/teams
```

### Authentication

```text
auth: true
```

### Query Parameters

| Parameter | Description              |
| --------- | ------------------------ |
| `page`    | Page number              |
| `limit`   | Number of teams per page |

Example:

```text
/teams?page=1&limit=10
```

### Response

```json
{
  "success": true,
  "message": "Retrived all teams successfully",
  "statusCode": 201,
  "data": {
    "teams": [
      {
        "id": "team-id",
        "name": "My Second Team",
        "organizationId": "organization-id",
        "createdAt": "2026-09-05T09:32:02.137Z",
        "updatedAt": "2026-09-05T09:32:02.137Z"
      }
    ]
  }
}
```

---

# 5. Projects

## 5.1 Create Project

**POST**

```text
/projects
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "name": "My Second Project",
  "teamId": "team-id"
}
```

### Response

```json
{
  "success": true,
  "message": "Project created successfully",
  "statusCode": 201,
  "data": {
    "project": {
      "id": "project-id",
      "name": "My Second Project",
      "teamId": "team-id",
      "createdAt": "2026-09-05T10:27:04.447Z",
      "updatedAt": "2026-09-05T10:27:04.447Z"
    }
  }
}
```

---

## 5.2 Add Project Member

**POST**

```text
/projects/:projectId/members
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "userId": "user-id",
  "role": "MEMBER"
}
```

### Response

```json
{
  "success": true,
  "message": "Member added to project successfully",
  "statusCode": 201,
  "data": {
    "member": {
      "id": "member-id",
      "projectId": "project-id",
      "userId": "user-id",
      "role": "MEMBER",
      "createdAt": "2026-09-05T10:31:52.840Z",
      "updatedAt": "2026-09-05T10:31:52.840Z"
    }
  }
}
```

---

## 5.3 Get Projects

**GET**

```text
/projects
```

### Authentication

```text
auth: true
```

### Query Parameters

| Parameter | Description                 |
| --------- | --------------------------- |
| `page`    | Page number                 |
| `limit`   | Number of projects per page |

Example:

```text
/projects?page=1&limit=10
```

### Response

```json
{
  "success": true,
  "message": "Retrived all projects successfully",
  "statusCode": 201,
  "data": {
    "projects": [
      {
        "id": "project-id",
        "name": "My Second Project",
        "teamId": "team-id",
        "createdAt": "2026-09-05T10:27:04.447Z",
        "updatedAt": "2026-09-05T10:27:04.447Z"
      }
    ]
  }
}
```

---

# 6. Sprints

## 6.1 Create Sprint

**POST**

```text
/sprints
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "name": "My first sprint",
  "projectId": "project-id",
  "startTime": "2026-09-05T11:46:07.779Z",
  "endTime": "2026-09-08T11:46:07.779Z"
}
```

### Response

```json
{
  "success": true,
  "message": "Sprint created successfully",
  "statusCode": 201,
  "data": {
    "sprint": {
      "id": "sprint-id",
      "name": "My first sprint",
      "projectId": "project-id",
      "startTime": "2026-09-05T11:46:07.779Z",
      "endTime": "2026-09-08T11:46:07.779Z",
      "createdAt": "2026-09-05T12:05:23.873Z",
      "updatedAt": "2026-09-05T12:05:23.873Z"
    }
  }
}
```

---

# 7. Tasks

## 7.1 Create Task

**POST**

```text
/tasks
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "title": "My First Task",
  "description": "This is very important",
  "projectId": "project-id"
}
```

### Response

```json
{
  "success": true,
  "message": "Task created successfully",
  "statusCode": 201,
  "data": {
    "task": {
      "id": "task-id",
      "projectId": "project-id",
      "sprintId": null,
      "title": "My First Task",
      "description": "This is very important",
      "createdAt": "2026-09-05T13:56:13.569Z",
      "updatedAt": "2026-09-05T13:56:13.569Z"
    }
  }
}
```

---

## 7.2 Assign Task to Sprint

**POST**

```text
/tasks/:taskId/assign
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "sprintId": "sprint-id"
}
```

### Response

```json
{
  "success": true,
  "message": "Task assigned successfully",
  "statusCode": 201,
  "data": {
    "task": {
      "id": "task-id",
      "projectId": "project-id",
      "sprintId": "sprint-id",
      "title": "My First Task",
      "description": "This is very important",
      "createdAt": "2026-09-05T13:56:13.569Z",
      "updatedAt": "2026-09-05T14:05:17.739Z"
    }
  }
}
```

---

## 7.3 Get Tasks

**GET**

```text
/tasks
```

### Authentication

```text
auth: true
```

### Query Parameters

| Parameter | Description                           |
| --------- | ------------------------------------- |
| `page`    | Page number                           |
| `limit`   | Number of tasks per page              |
| `sortBy`  | Field to sort by                      |
| `order`   | Sort order: `asc` or `desc`           |
| `term`    | Search term for title and description |

Example:

```text
/tasks?page=1&limit=10&sortBy=createdAt&order=desc&term=important
```

### Response

```json
{
  "success": true,
  "message": "Retrived all tasks successfully",
  "statusCode": 201,
  "data": {
    "tasks": [
      {
        "id": "task-id",
        "projectId": "project-id",
        "sprintId": "sprint-id",
        "title": "My First Task",
        "description": "This is very important",
        "createdAt": "2026-09-05T13:56:13.569Z",
        "updatedAt": "2026-09-05T14:05:17.739Z"
      }
    ]
  }
}
```

---

## 7.4 Create Subtask

**POST**

```text
/tasks/:taskId/subtasks
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "title": "First Subtask",
  "description": "This the description of the subtask"
}
```

### Response

```json
{
  "success": true,
  "message": "Subtask created successfully",
  "statusCode": 201,
  "data": {
    "subtask": {
      "id": "subtask-id",
      "title": "First Subtask",
      "description": "This the description of the subtask",
      "taskId": "task-id",
      "createdAt": "2026-09-05T15:10:38.493Z",
      "updatedAt": "2026-09-05T15:10:38.493Z"
    }
  }
}
```

---

## 7.5 Upload Task Attachment

**POST**

```text
/tasks/:taskId/attachment
```

### Authentication

```text
auth: true
```

### Request Body

The endpoint expects a file upload:

```text
attachment: <file>
```

### Response

```json
{
  "success": true,
  "message": "attachment added successfully",
  "statusCode": 200,
  "data": {
    "attachment": {
      "id": "attachment-id",
      "taskId": "task-id",
      "userId": "user-id",
      "fileURL": "https://example.com/file.png",
      "createdAt": "2026-09-11T14:47:43.383Z",
      "updatedAt": "2026-09-11T14:47:43.383Z"
    }
  }
}
```

---

# 8. Comments

## 8.1 Create Comment

**POST**

```text
/comments
```

### Authentication

```text
auth: true
```

### Request Body

```json
{
  "content": "This is comment content",
  "taskId": "task-id"
}
```

### Response

```json
{
  "success": true,
  "message": "Comment created successfully",
  "statusCode": 201,
  "data": {
    "comment": {
      "id": "comment-id",
      "content": "This is comment content",
      "userId": "user-id",
      "taskId": "task-id",
      "createdAt": "2026-09-05T16:19:18.431Z",
      "updatedAt": "2026-09-05T16:19:18.431Z"
    }
  }
}
```

---

# 9. Payments

## 9.1 Create Payment

**POST**

```text
/payments/create-payment
```

### Authentication

```text
auth: true
```

### Request Body

The documented request body is currently empty.

### Response

The endpoint returns payment information including a bKash payment URL.

```json
{
  "success": true,
  "message": "Payment Created Successfully",
  "statusCode": 200,
  "data": {
    "paymentID": "payment-id",
    "bkashURL": "https://sandbox.payment.bkash.com/...",
    "callbackURL": "http://localhost:5000/api/v1/payments/callback?...",
    "successCallbackURL": "http://localhost:5000/api/v1/payments/callback?...",
    "failureCallbackURL": "http://localhost:5000/api/v1/payments/callback?...",
    "cancelledCallbackURL": "http://localhost:5000/api/v1/payments/callback?...",
    "amount": "600",
    "intent": "sale",
    "currency": "BDT",
    "transactionStatus": "Initiated",
    "merchantInvoiceNumber": "Inv04324",
    "statusCode": "0000",
    "statusMessage": "Successful",
    "userId": "user-id"
  }
}
```

---

## 9.2 Payment Callback

**POST**

```text
/payments/callback
```

### Authentication

```text
auth: false
```

> The backend documentation notes that this is currently unauthenticated and is expected to become an authenticated route when integrated with the frontend.

### Request Body

The documented request body is empty.

### Response

The backend redirects to the frontend payment-success page.

The exact frontend redirect URL is not defined in the current API documentation.

---

# 10. Endpoint Summary

| Resource            | Method | Endpoint                                 | Auth |
| ------------------- | ------ | ---------------------------------------- | ---- |
| Auth                | POST   | `/auth/register`                         | No   |
| Auth                | POST   | `/auth/login`                            | No   |
| Auth                | POST   | `/auth/refresh-token`                    | No   |
| Auth                | POST   | `/auth/logout`                           | Yes  |
| Auth                | POST   | `/auth/google`                           | No   |
| Organization        | POST   | `/organizations`                         | Yes  |
| Organization        | GET    | `/organizations`                         | Yes  |
| Organization Member | POST   | `/organizations/:organizationId/members` | Yes  |
| Team                | POST   | `/teams`                                 | Yes  |
| Team Member         | POST   | `/teams/:teamId/members`                 | Yes  |
| Team                | GET    | `/teams`                                 | Yes  |
| Project             | POST   | `/projects`                              | Yes  |
| Project Member      | POST   | `/projects/:projectId/members`           | Yes  |
| Project             | GET    | `/projects`                              | Yes  |
| Sprint              | POST   | `/sprints`                               | Yes  |
| Task                | POST   | `/tasks`                                 | Yes  |
| Task Assignment     | POST   | `/tasks/:taskId/assign`                  | Yes  |
| Task                | GET    | `/tasks`                                 | Yes  |
| Subtask             | POST   | `/tasks/:taskId/subtasks`                | Yes  |
| Attachment          | POST   | `/tasks/:taskId/attachment`              | Yes  |
| Comment             | POST   | `/comments`                              | Yes  |
| Payment             | POST   | `/payments/create-payment`               | Yes  |
| Payment Callback    | POST   | `/payments/callback`                     | No   |

---

# 11. Frontend Integration Notes

### API Base URL

The frontend should keep the API base URL configurable rather than hardcoding the backend host throughout the application.

Example:

```text
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Endpoint calls should then use paths such as:

```text
/auth/login
/organizations
/teams
/projects
/tasks
```

### Backend as Source of Truth

The frontend should not assume endpoints, fields, operations, or business rules that are not documented by the backend.

If a required frontend feature is not supported by the current API documentation, it should be treated as a backend/API gap rather than implemented using invented frontend behavior.

### Authentication

The frontend authentication implementation should be based on the actual backend authentication flow.

The current API documentation explicitly exposes:

* Login sets HttpOnly access and refresh cookies.
* Refresh reads the HttpOnly refresh cookie and renews the access cookie.
* Logout clears both authentication cookies.
* Google authentication returns access and refresh tokens and sets cookies.

Protected frontend API requests must include credentials. When a protected
request returns HTTP 401, the frontend may refresh once using the refresh
cookie and retry the original request. The frontend must not read or persist
either token.

The backend does not currently document a current-user/session-check endpoint.
Strict route guarding and user identity display require such an endpoint or an
equivalent explicit API contract.

### Pagination

The following endpoints expose pagination parameters:

* `GET /teams`
* `GET /projects`
* `GET /tasks`

The documented query parameters are:

```text
page
limit
```

Tasks additionally support:

```text
sortBy
order
term
```

### File Uploads

Task attachments use:

```text
POST /tasks/:taskId/attachment
```

The request contains a file under the `attachment` field.

The frontend should use an appropriate multipart form request for this endpoint.

### Payments

The payment flow currently returns a `bkashURL`.

The frontend should use the returned payment information rather than constructing bKash URLs itself.

The exact frontend success/cancellation/failure routing should be finalized when the payment integration is implemented.

---

# 12. API Documentation Boundaries

This document describes the currently documented backend API.

It does **not** define:

* Undocumented CRUD operations.
* Undocumented role permissions.
* Undocumented status values.
* Undocumented response fields.
* Undocumented filtering behavior.
* Frontend-only business rules.

Any API changes should be reflected in this document before the corresponding frontend functionality is implemented.
