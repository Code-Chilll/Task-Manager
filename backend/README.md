# Task Manager Backend

A robust Spring Boot REST API for the Task Manager application, providing secure user authentication, task management, and email notification services.

## 🏗️ Architecture Overview

The backend follows a layered architecture pattern with clear separation of concerns:

```
src/main/java/org/example/taskmanager/
├── controller/          # REST API Controllers
│   ├── AuthController.java
│   ├── TaskController.java
│   └── UserController.java
├── service/            # Business Logic Layer
│   ├── TaskService.java
│   ├── UserService.java
│   ├── OtpService.java
│   ├── PasswordService.java
│   ├── SendOTPService.java
│   └── TaskMailService.java
├── repository/         # Data Access Layer
│   ├── TaskRepository.java
│   ├── UserRepository.java
│   └── OtpRepository.java
├── model/             # Entity Classes
│   ├── Task.java
│   ├── User.java
│   └── OtpRecord.java
├── dto/               # Data Transfer Objects
│   └── TaskPageResponse.java
├── config/            # Configuration Classes
│   └── WebConfig.java
├── exception/         # Exception Handling
│   ├── GlobalExceptionHandler.java
│   └── ValidationErrorResponse.java
└── util/              # Utility Classes
    └── ValidationUtils.java
```

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.5.3
- **Language**: Java 17
- **Database**: PostgreSQL 12+
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security Crypto for password hashing
- **Email**: JavaMail API for SMTP communication
- **Validation**: Bean Validation API (Jakarta Validation)
- **Build Tool**: Maven 3.6+
- **Testing**: Spring Boot Test, JUnit 5

## 📋 Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher
- SMTP email service (Gmail, SendGrid, etc.)

## 🚀 Quick Start

### 1. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE taskmanager;
CREATE USER taskmanager_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO taskmanager_user;
```

### 2. Configuration

Create `application.properties` in `src/main/resources/`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/taskmanager
spring.datasource.username=taskmanager_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Application Configuration
app.jwt.secret=your_jwt_secret_key_here
app.jwt.expiration=86400000
```

### 3. Build and Run

```bash
# Navigate to backend directory
cd backend

# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Task Management Endpoints

#### Get All Tasks (Paginated)
```http
GET /api/tasks?page=0&size=10&sort=dueDate,asc
Authorization: Bearer <jwt_token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete Project Documentation",
  "description": "Write comprehensive documentation for the task manager project",
  "dueDate": "2024-01-15T23:59:59",
  "priority": "HIGH",
  "status": "PENDING"
}
```

#### Update Task
```http
PUT /api/tasks/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Task Title",
  "description": "Updated description",
  "dueDate": "2024-01-20T23:59:59",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS"
}
```

#### Delete Task
```http
DELETE /api/tasks/{id}
Authorization: Bearer <jwt_token>
```

### User Management Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

## 🔐 Security Features

### Password Security
- Passwords are hashed using BCrypt with Spring Security Crypto
- Salt rounds: 12 (configurable)
- One-way hashing prevents password recovery

### JWT Authentication
- Stateless authentication using JWT tokens
- Configurable token expiration
- Secure token generation and validation

### Input Validation
- Bean Validation annotations on DTOs
- Custom validation rules for business logic
- Comprehensive error handling with detailed messages

## 📧 Email Services

### OTP Verification
- 6-digit numeric OTP generation
- Email delivery via SMTP
- Configurable OTP expiration time
- Automatic cleanup of expired OTPs

### Task Notifications
- Email reminders for upcoming task deadlines
- Configurable notification timing
- HTML email templates

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=TaskServiceTest

# Run tests with coverage
mvn test jacoco:report
```

### Integration Tests
```bash
# Run integration tests
mvn test -Dtest=*IntegrationTest
```

### API Testing
Use the provided test data in `schema.sql` for development:
```bash
# Initialize test data
psql -d taskmanager -f schema.sql
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'PENDING',
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### OTP Records Table
```sql
CREATE TABLE otp_records (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
```

## 🔧 Configuration Options

### Application Properties

| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Server port | 8080 |
| `spring.jpa.hibernate.ddl-auto` | Database schema generation | update |
| `spring.jpa.show-sql` | Show SQL queries in logs | true |
| `app.jwt.expiration` | JWT token expiration (ms) | 86400000 |
| `app.otp.expiration` | OTP expiration time (minutes) | 10 |

### Environment Variables

For production deployment, use environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db:5432/taskmanager
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
export SPRING_MAIL_USERNAME=notifications@yourcompany.com
export SPRING_MAIL_PASSWORD=app_password
export APP_JWT_SECRET=your_production_jwt_secret
```

## 📦 Deployment

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/Task-Manager-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Traditional Deployment
```bash
# Build JAR file
mvn clean package

# Run with custom profile
java -jar target/Task-Manager-0.0.1-SNAPSHOT.jar --spring.profiles.active=production
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall settings
   - Enable "Less secure app access" for Gmail

3. **JWT Token Issues**
   - Verify JWT secret is configured
   - Check token expiration settings
   - Ensure proper Authorization header format

### Logs
Enable debug logging by adding to `application.properties`:
```properties
logging.level.org.example.taskmanager=DEBUG
logging.level.org.springframework.security=DEBUG
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add comprehensive tests for new features
3. Update API documentation
4. Follow Java coding conventions
5. Add proper error handling

## 📝 License

This project is licensed under the MIT License.

---

For more information, see the [main README](../README.md) or contact the development team.
