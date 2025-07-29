# Task Manager Frontend

A modern, responsive React application built with Next.js 15, featuring a beautiful UI with Tailwind CSS, comprehensive form validation, and seamless integration with the Task Manager backend API.

## 🏗️ Architecture Overview

The frontend follows Next.js 15 App Router architecture with a component-based design:

```
src/
├── app/                    # Next.js App Router Pages
│   ├── admin/             # Admin Dashboard
│   │   └── page.js
│   ├── login/             # Authentication Pages
│   │   └── page.js
│   ├── signup/
│   │   └── page.js
│   ├── tasks/             # Task Management Pages
│   │   ├── page.js        # Task List
│   │   ├── add/
│   │   │   └── page.js    # Add Task
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.js # Edit Task
│   ├── layout.js          # Root Layout
│   ├── page.js            # Home Page
│   └── globals.css        # Global Styles
├── components/            # Reusable UI Components
│   └── ui/               # Base UI Components
│       ├── button.jsx
│       ├── card.jsx
│       ├── form.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── select.jsx
│       └── textarea.jsx
└── lib/                  # Utility Functions
    ├── auth.js           # Authentication Utilities
    └── utils.js          # General Utilities
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.4
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Form Management**: React Hook Form 7.59.0
- **Validation**: Zod 3.25.67
- **Icons**: Lucide React 0.525.0
- **Build Tool**: npm
- **Development**: ESLint, Turbopack

## 📋 Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create `.env.local` file in the frontend root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Authentication
NEXT_PUBLIC_JWT_STORAGE_KEY=taskmanager_token

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
```

### 3. Development Server

```bash
# Start development server with Turbopack
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📚 Component Documentation

### UI Components

#### Button Component
```jsx
import { Button } from '@/components/ui/button'

// Primary button
<Button variant="default" size="lg">
  Create Task
</Button>

// Secondary button
<Button variant="secondary" size="sm">
  Cancel
</Button>

// Destructive button
<Button variant="destructive">
  Delete Task
</Button>
```

#### Card Component
```jsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <h3>Task Title</h3>
  </CardHeader>
  <CardContent>
    <p>Task description goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Edit</Button>
  </CardFooter>
</Card>
```

#### Form Components
```jsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Input with label
<div>
  <Label htmlFor="title">Task Title</Label>
  <Input id="title" placeholder="Enter task title" />
</div>

// Select dropdown
<Select>
  <option value="low">Low Priority</option>
  <option value="medium">Medium Priority</option>
  <option value="high">High Priority</option>
</Select>

// Textarea
<Textarea placeholder="Enter task description" rows={4} />
```

### Page Components

#### Authentication Pages
- **Login Page** (`/login`): User authentication with email/password
- **Signup Page** (`/signup`): User registration with OTP verification
- **OTP Verification**: Email-based OTP verification flow

#### Task Management Pages
- **Task List** (`/tasks`): Display all tasks with pagination and filtering
- **Add Task** (`/tasks/add`): Create new tasks with form validation
- **Edit Task** (`/tasks/edit/[id]`): Update existing tasks
- **Task Details**: View task information and status

#### Admin Dashboard
- **Admin Panel** (`/admin`): Administrative functions and user management

## 🎨 Styling Guide

### Tailwind CSS Configuration

The project uses Tailwind CSS 4 with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### CSS Classes Usage

```jsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Dark mode support
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// Hover and focus states
<button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">

// Animations
<div className="transition-all duration-300 ease-in-out transform hover:scale-105">
```

## 🔐 Authentication Flow

### Login Process
1. User enters email and password
2. Form validation with Zod schema
3. API call to `/api/auth/login`
4. JWT token storage in localStorage
5. Redirect to dashboard

### Registration Process
1. User fills registration form
2. Email validation and password strength check
3. API call to `/api/auth/register`
4. OTP sent to user's email
5. OTP verification page
6. Account activation upon successful verification

### Token Management
```javascript
// Store token
localStorage.setItem('taskmanager_token', jwtToken);

// Retrieve token
const token = localStorage.getItem('taskmanager_token');

// Remove token (logout)
localStorage.removeItem('taskmanager_token');
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
```jsx
// Mobile-first responsive design
<div className="
  w-full                    // Mobile: full width
  md:w-1/2                  // Tablet: half width
  lg:w-1/3                  // Desktop: one-third width
  p-4                       // Mobile: small padding
  md:p-6                    // Tablet: medium padding
  lg:p-8                    // Desktop: large padding
">
```

## 🧪 Testing

### Linting
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Component Testing
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Example Test
```javascript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders button with correct text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

## 🔧 Configuration

### Next.js Configuration
```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig
```

### ESLint Configuration
```javascript
// eslint.config.mjs
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
]
```

## 📦 Build and Deployment

### Development Build
```bash
# Development server with hot reload
npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Static Export
```bash
# Export as static files
npm run export
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🚀 Performance Optimization

### Code Splitting
- Automatic code splitting with Next.js
- Dynamic imports for large components
- Route-based code splitting

### Image Optimization
```jsx
import Image from 'next/image'

<Image
  src="/task-icon.svg"
  alt="Task Icon"
  width={24}
  height={24}
  priority={true}
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# Run analysis
npm run analyze
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

2. **API Connection Issues**
   - Verify backend server is running
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Ensure CORS is configured on backend

3. **Styling Issues**
   - Clear browser cache
   - Restart development server
   - Check Tailwind CSS configuration

### Debug Mode
Enable debug mode in `.env.local`:
```env
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
```

## 🤝 Contributing

### Development Workflow
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes following coding standards
3. Test thoroughly
4. Update documentation
5. Create pull request

### Coding Standards
- Use functional components with hooks
- Follow ESLint rules
- Write meaningful component names
- Add proper TypeScript types (if using TS)
- Include proper error handling

### Component Guidelines
- Keep components small and focused
- Use proper prop validation
- Implement proper loading states
- Handle error states gracefully
- Make components reusable

## 📝 License

This project is licensed under the MIT License.

---

For more information, see the [main README](../README.md) or contact the development team.
