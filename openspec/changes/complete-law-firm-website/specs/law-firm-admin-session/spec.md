## ADDED Requirements

### Requirement: Session-based admin authentication
The system SHALL use iron-session for cookie-based session management to authenticate admin users.

#### Scenario: Session cookie is signed and encrypted
- **WHEN** a login succeeds and session is created
- **THEN** the session cookie is signed with SESSION_SECRET to prevent tampering

#### Scenario: Session stores admin identity
- **WHEN** a session is created after login
- **THEN** it contains adminId, email, and isLoggedIn: true

#### Scenario: Invalid session is rejected
- **WHEN** an API request is made with a tampered or expired session cookie
- **THEN** the request is treated as unauthenticated

### Requirement: Admin middleware protects /admin routes
The system SHALL provide middleware that redirects unauthenticated users to /admin/login.

#### Scenario: Authenticated admin accesses admin page
- **WHEN** a user with valid session accesses /admin/*
- **THEN** the requested page is rendered normally

#### Scenario: Unauthenticated user redirected to login
- **WHEN** a user without valid session accesses /admin/* (except /admin/login)
- **THEN** the user is redirected to /admin/login

### Requirement: Admin credentials are hashed
The system SHALL store admin passwords using bcrypt hashing.

#### Scenario: Password is hashed on storage
- **WHEN** an admin password is set or changed
- **THEN** the stored value is a bcrypt hash, not plaintext

#### Scenario: Login verifies against hash
- **WHEN** admin attempts login
- **THEN** the provided password is compared against the stored bcrypt hash using bcrypt.compare()