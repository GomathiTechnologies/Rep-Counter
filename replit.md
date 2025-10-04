# Rep Counter - AI Workout Tracker

## Overview

Rep Counter is an AI-powered workout tracking application that uses pose detection technology to automatically count exercise repetitions. The application leverages TensorFlow.js and MediaPipe to detect body movements through the device camera and track various exercises including squats, bicep curls, push-ups, jumping jacks, and lunges. Users can track their daily workout sessions with automatic rep counting, eliminating the need for manual counting during exercises.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Design system follows "New York" style with dark mode as default
- Custom color palette optimized for data clarity and professional aesthetic

**State Management Pattern**
- React Query handles all server-side data with configurable cache behavior
- Local component state using React hooks (useState, useRef, useEffect)
- Context API for cross-cutting concerns (toast notifications, tooltips)
- No global state management library - relies on React Query's built-in caching

### Backend Architecture

**Server Framework**
- Express.js REST API with TypeScript
- Modular route registration pattern for API endpoints
- Custom logging middleware for request/response tracking
- Error handling middleware for consistent error responses

**Data Storage Strategy**
- In-memory storage using Map data structure (MemStorage class)
- Drizzle ORM configured for PostgreSQL (migration-ready but not currently active)
- Schema defined with type inference for compile-time safety
- Storage interface pattern allows easy swapping between implementations

**API Design**
- RESTful endpoints for session management:
  - POST /api/sessions - Create new workout session
  - GET /api/sessions - Retrieve all sessions
  - GET /api/sessions/today - Get today's sessions
- Request validation using Zod schemas derived from Drizzle table definitions
- JSON request/response format with proper HTTP status codes

### AI/ML Integration

**Pose Detection System**
- TensorFlow.js for browser-based machine learning
- MediaPipe Pose model for real-time skeletal tracking
- Custom rep counting logic based on body position analysis:
  - Tracks vertical movement of key body landmarks
  - State machine pattern (isDown/isUp) for movement detection
  - Movement history tracking for accuracy improvements

**Camera Integration**
- getUserMedia API for camera access
- Canvas rendering for pose visualization overlay
- Video stream management with proper cleanup on unmount
- Real-time frame analysis without backend processing

### External Dependencies

**Third-Party Services**
- Google Fonts (Inter, JetBrains Mono) for typography
- TensorFlow.js CDN for ML model loading
- MediaPipe for pre-trained pose detection models

**Development Tools**
- Replit-specific plugins for development experience:
  - Runtime error overlay for debugging
  - Cartographer for code navigation
  - Dev banner for environment awareness

**Database (Configured but Inactive)**
- Neon Database serverless PostgreSQL (configured via @neondatabase/serverless)
- Connection pool ready with DATABASE_URL environment variable
- Drizzle migrations directory structure in place for future activation

**Build & Deployment**
- esbuild for server-side code bundling
- Vite for optimized client bundle with code splitting
- Production build outputs to dist/ directory
- Environment-aware configuration (NODE_ENV detection)

### Design System Philosophy

The application follows a "system-based with modern dashboard inspiration" approach, drawing from Linear's data presentation, Notion's organizational clarity, and Material Design principles. The design prioritizes function over form with clear information hierarchy, efficient workflows, and a professional trust-building aesthetic suitable for fitness tracking.