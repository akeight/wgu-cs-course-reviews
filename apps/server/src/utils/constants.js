// Constants and Enums for validation, error messages, status codes, and consistency

export const API_VERSION = 'v1'

// Enums for key-value pairs
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  VERY_HARD: 'very hard',
}

// Array version for dropdowns
export const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard', 'very hard']

export const RATING_VALUES = {
  POOR: 1,
  FAIR: 2,
  GOOD: 3,
  VERY_GOOD: 4,
  EXCELLENT: 5,
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}

export const ERROR_MESSAGES = {
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
}
