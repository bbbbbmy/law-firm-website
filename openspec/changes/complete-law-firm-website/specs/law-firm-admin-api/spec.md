## ADDED Requirements

### Requirement: Admin authentication endpoints exist
The system SHALL provide API endpoints for admin login, logout, and session retrieval.

#### Scenario: Admin can login with valid credentials
- **WHEN** POST /api/admin/auth/login is called with valid email and password
- **THEN** a session cookie is set and { success: true, admin: { email } } is returned

#### Scenario: Admin login fails with invalid credentials
- **WHEN** POST /api/admin/auth/login is called with invalid email or password
- **THEN** 401 status is returned with { error: "Invalid credentials" }

#### Scenario: Admin can logout
- **WHEN** POST /api/admin/auth/logout is called
- **THEN** session cookie is cleared and { success: true } is returned

#### Scenario: Admin can check session status
- **WHEN** GET /api/admin/auth/session is called
- **THEN** current session data is returned or { isLoggedIn: false } if no session exists

### Requirement: Article CRUD endpoints
The system SHALL provide REST endpoints for creating, reading, updating, and deleting articles.

#### Scenario: List all articles
- **WHEN** GET /api/admin/articles is called
- **THEN** all articles are returned as JSON array with id, slug, type, language, title, summary, publishedAt

#### Scenario: Create new article
- **WHEN** POST /api/admin/articles is called with article data
- **THEN** article is created in database and created article is returned with id

#### Scenario: Update existing article
- **WHEN** PUT /api/admin/articles/[id] is called with updated data
- **THEN** article is updated in database and updated article is returned

#### Scenario: Delete article
- **WHEN** DELETE /api/admin/articles/[id] is called
- **THEN** article is deleted from database and { success: true } is returned

### Requirement: Team member CRUD endpoints
The system SHALL provide REST endpoints for managing team members.

#### Scenario: List all team members
- **WHEN** GET /api/admin/team is called
- **THEN** all team members are returned as JSON array sorted by sortOrder

#### Scenario: Create new team member
- **WHEN** POST /api/admin/team is called with member data
- **THEN** team member is created and returned with id

#### Scenario: Update team member
- **WHEN** PUT /api/admin/team/[id] is called with updated data
- **THEN** team member is updated and returned

#### Scenario: Delete team member
- **WHEN** DELETE /api/admin/team/[id] is called
- **THEN** team member is deleted and { success: true } is returned

### Requirement: Banner CRUD endpoints
The system SHALL provide REST endpoints for managing banners.

#### Scenario: List all banners
- **WHEN** GET /api/admin/banners is called
- **THEN** all banners are returned as JSON array sorted by sortOrder

#### Scenario: Create new banner
- **WHEN** POST /api/admin/banners is called with banner data
- **THEN** banner is created and returned with id

#### Scenario: Update banner
- **WHEN** PUT /api/admin/banners/[id] is called with updated data
- **THEN** banner is updated and returned

#### Scenario: Delete banner
- **WHEN** DELETE /api/admin/banners/[id] is called
- **THEN** banner is deleted and { success: true } is returned

### Requirement: Page content endpoints
The system SHALL provide endpoints for retrieving and updating page content.

#### Scenario: Get page content by slug
- **WHEN** GET /api/admin/pages/[slug] is called
- **THEN** page data with both zh and en content variations is returned

#### Scenario: Update page content
- **WHEN** PUT /api/admin/pages/[slug] is called with content data
- **THEN** page content is updated for the specified language and updated content is returned

### Requirement: File upload endpoint
The system SHALL provide an endpoint for uploading images.

#### Scenario: Upload image file
- **WHEN** POST /api/upload is called with multipart form data containing an image file
- **THEN** the file is saved and a URL to the file is returned

#### Scenario: Upload fails for invalid file type
- **WHEN** POST /api/upload is called with non-image file
- **THEN** 400 status is returned with { error: "Only image files are allowed" }

#### Scenario: Upload fails for files exceeding size limit
- **WHEN** POST /api/upload is called with file larger than 5MB
- **THEN** 400 status is returned with { error: "File size must be under 5MB" }