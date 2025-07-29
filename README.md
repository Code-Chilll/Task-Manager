# Task Manager - Full Stack Application

A modern, feature-rich task management application built with Spring Boot backend and Next.js frontend, featuring user authentication, task management, email notifications, and responsive design.

## 🚀 Features

- **User Authentication & Authorization**
  - Secure user registration and login
  - OTP-based email verification
  - Role-based access control (User/Admin)
  - Password encryption with Spring Security

- **Task Management**
  - Create, read, update, and delete tasks
  - Task categorization and priority levels
  - Due date management
  - Task status tracking
  - Email notifications for task deadlines

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Component-based architecture with Radix UI
  - Form validation with React Hook Form and Zod
  - Smooth animations and transitions

- **Backend Features**
  - RESTful API with Spring Boot
  - PostgreSQL database with JPA/Hibernate
  - Email service integration
  - Input validation and error handling
  - Pagination support

## 🏗️ Architecture

```
Task-Manager/
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/
│   │   └── org/example/taskmanager/
│   │       ├── controller/  # REST Controllers
│   │       ├── service/     # Business Logic
│   │       ├── repository/  # Data Access Layer
│   │       ├── model/       # Entity Classes
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── config/      # Configuration Classes
│   │       └── util/        # Utility Classes
│   └── src/main/resources/
│       └── application.properties
└── frontend/               # Next.js React Application
    ├── src/
    │   ├── app/            # Next.js App Router
    │   ├── components/     # Reusable UI Components
    │   └── lib/            # Utility Functions
    └── public/             # Static Assets
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.3
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security Crypto
- **Email**: JavaMail API
- **Build Tool**: Maven
- **Validation**: Bean Validation API

### Frontend
- **Framework**: Next.js 15.3.4
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Form Management**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Build Tool**: npm

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Task-Manager
```

### 2. Backend Setup
```bash
cd backend
# Configure database in application.properties
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 📖 Documentation

- [Backend Documentation](./backend/README.md) - Detailed backend setup and API documentation
- [Frontend Documentation](./frontend/README.md) - Frontend development guide and component documentation

## 🔧 Configuration

### Environment Variables
Create appropriate environment files for both frontend and backend:

**Backend** (`application.properties`):
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/taskmanager
spring.datasource.username=your_username
spring.datasource.password=your_password

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm run lint
```

## 📦 Deployment

### Backend Deployment
```bash
cd backend
mvn clean package
java -jar target/Task-Manager-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Next.js team for the React framework
- Radix UI for accessible components
- Tailwind CSS for utility-first styling


---

**Note**: This is a full-stack application demonstrating modern web development practices with Spring Boot and Next.js. Make sure to configure your database and email settings before running the application.
