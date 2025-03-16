export const HTTP_STATUS = {
    OK: 200, // Successful request
    CREATED: 201, // Resource successfully created
    ACCEPTED: 202, // Request accepted, processing in progress
    NO_CONTENT: 204, // Successful request with no content to return
    BAD_REQUEST: 400, // Invalid request
    UNAUTHORIZED: 401, // Authentication failed
    FORBIDDEN: 403, // Access denied
    NOT_FOUND: 404, // Resource not found
    CONFLICT: 409, // Conflict
    UNPROCESSABLE_ENTITY: 422, // Semantic errors
    INTERNAL_SERVER_ERROR: 500, // Server-side error
    SERVICE_UNAVAILABLE: 503, // Service unavailable
  };