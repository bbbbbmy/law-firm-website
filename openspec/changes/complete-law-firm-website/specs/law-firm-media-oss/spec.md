## ADDED Requirements

### Requirement: OSS integration for production file storage
The system SHALL integrate with Alibaba Cloud OSS for storing and retrieving images in production environment.

#### Scenario: Production upload sends file to OSS
- **WHEN** a file upload request is made in production environment
- **THEN** the file is uploaded to the configured OSS bucket and a public OSS URL is returned

#### Scenario: OSS bucket uses correct directory structure
- **WHEN** files are uploaded to OSS
- **THEN** they are organized under /banners/, /team/, /articles/, /qrcodes/ based on file type

### Requirement: Local file storage for development
The system SHALL store uploaded files locally in the public/uploads directory during development.

#### Scenario: Development upload saves file locally
- **WHEN** a file upload request is made in development environment
- **THEN** the file is saved to public/uploads/[type]/ directory and a relative URL is returned

### Requirement: Abstract upload service
The system SHALL provide a unified upload service that automatically selects the appropriate storage backend based on environment.

#### Scenario: Upload service detects environment
- **WHEN** upload service is called
- **THEN** it checks if OSS credentials are configured and uses OSS if available, otherwise falls back to local storage

#### Scenario: Same API interface for local and OSS
- **WHEN** upload service saves a file (local or OSS)
- **THEN** the returned URL format is consistent and usable in both environments

### Requirement: OSS SDK configuration
The system SHALL configure the Alibaba Cloud OSS SDK with credentials from environment variables.

#### Scenario: OSS client is initialized with credentials
- **WHEN** the application starts in production
- **THEN** OSS client is initialized with accessKeyId, accessKeySecret, and bucket from environment variables

#### Scenario: OSS operations handle errors gracefully
- **WHEN** OSS upload or delete operation fails
- **THEN** an appropriate error is logged and thrown for API handling