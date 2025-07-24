package org.example.taskmanager.util;

import java.util.regex.Pattern;

public class ValidationUtils {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    
    private static final Pattern STRONG_PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 6;
    }

    public static boolean isStrongPassword(String password) {
        return password != null && STRONG_PASSWORD_PATTERN.matcher(password).matches();
    }

    public static boolean isValidName(String name) {
        return name != null && !name.trim().isEmpty() && name.length() >= 2 && name.length() <= 100;
    }

    public static boolean isValidTaskName(String taskName) {
        return taskName != null && !taskName.trim().isEmpty() && taskName.length() <= 200;
    }

    public static boolean isValidPriority(String priority) {
        if (priority == null) return false;
        String lowerPriority = priority.toLowerCase();
        return "low".equals(lowerPriority) || "medium".equals(lowerPriority) || "high".equals(lowerPriority);
    }

    public static boolean isValidDescription(String description) {
        return description == null || description.length() <= 1000;
    }

    public static String sanitizeInput(String input) {
        if (input == null) return null;
        return input.trim();
    }
}
