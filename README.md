# Next.js User Dashboard with TypeScript and Tailwind

A full-stack application featuring a user management dashboard built with Next.js, TypeScript, and Tailwind CSS, containerized with Docker.

## Features

- User management dashboard with CRUD operations
- Responsive design using Tailwind CSS
- Type-safe development with TypeScript
- Containerized deployment with Docker
- Integration with Google Cloud Functions and Firestore
- Authentication with Firebase Auth

## Prerequisites

- Node.js 18 or later
- Docker
- Google Cloud Platform account (for deployment)
- Firebase project

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Configuration
NEXT_PUBLIC_API_URL=your_cloud_functions_url
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nextjs-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase configuration to `.env.local`
   - Deploy Cloud Functions (see below)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying Cloud Functions

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in the functions directory:
   ```bash
   cd functions
   firebase init functions
   ```

4. Deploy functions:
   ```bash
   firebase deploy --only functions
   ```

## Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t nextjs-dashboard .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 nextjs-dashboard
   ```

## API Documentation

### Authentication

All API endpoints require Firebase Authentication. Include the Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### Endpoints

#### GET /users
- Returns a list of all users
- Response: `User[]`

#### GET /users/:id
- Returns a specific user by ID
- Response: `User`

#### POST /users
- Creates a new user
- Request body: `UserInput`
- Response: `User`

#### PUT /users/:id
- Updates an existing user
- Request body: `UserInput`
- Response: `User`

#### DELETE /users/:id
- Deletes a user
- Response: `void`

### Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface UserInput {
  name: string;
  email: string;
}
```

## Project Structure

```
.
├── src/
│   ├── components/    # React components
│   │   ├── UserForm.tsx
│   │   ├── UserList.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/      # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/         # Next.js pages
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   └── login.tsx
│   ├── services/      # API services
│   │   └── api.ts
│   ├── styles/        # Global styles
│   └── types/         # TypeScript types
├── functions/         # Cloud Functions
│   └── src/
│       └── index.ts
├── public/           # Static assets
├── Dockerfile        # Docker configuration
└── README.md        # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
