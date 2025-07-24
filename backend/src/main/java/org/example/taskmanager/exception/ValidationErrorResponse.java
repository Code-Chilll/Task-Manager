package org.example.taskmanager.exception;

import java.time.LocalDateTime;
import java.util.List;

public class ValidationErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private List<FieldError> fieldErrors;
    private String path;

    public ValidationErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ValidationErrorResponse(int status, String error, List<FieldError> fieldErrors, String path) {
        this();
        this.status = status;
        this.error = error;
        this.fieldErrors = fieldErrors;
        this.path = path;
    }

    // Getters and setters
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public List<FieldError> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(List<FieldError> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public static class FieldError {
        private String field;
        private Object rejectedValue;
        private String message;

        public FieldError(String field, Object rejectedValue, String message) {
            this.field = field;
            this.rejectedValue = rejectedValue;
            this.message = message;
        }

        // Getters and setters
        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public Object getRejectedValue() {
            return rejectedValue;
        }

        public void setRejectedValue(Object rejectedValue) {
            this.rejectedValue = rejectedValue;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
