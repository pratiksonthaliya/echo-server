# Echo - A Social Media Platform

## Overview

**Echo** is a Full Stack social media platform inspired by Twitter. It allows users to post, like, comment, bookmark, follow, and unfollow other users. The project is built using modern web technologies for both frontend and backend.

## Live Demo

Check out the live version here: [Echo Media](https://echo-media.vercel.app/)

## Features

- **Post Tweets**: Users can create new posts (tweets) and view them on their profiles and feeds.
- **Like Posts**: Users can like posts from other users or their own.
- **Comment on Posts**: Users can add comments to posts, fostering interaction and engagement.
- **Bookmark Posts**: Users can save posts to their bookmarks for later reference.
- **Follow/Unfollow Users**: Users can follow or unfollow other users, enabling them to customize their feed based on their interests.
- **Profile Viewing**: Users can view their own profile and the profiles of other users.
- **Authentication**: Google OAuth is used for secure sign-in.
- **Image Storage**: Integrated with **Amazon S3** for image storage.
- **Loaders**: Super cool loaders have been added to enhance the user experience for each feature.
- **Debouncing**: **Lodash** is used for debouncing input actions.
- **Icons**: **React Icons** and **Lucide-React** are used for various UI elements.
- **Toasts**: **React Hot Toast** is used for providing simple and effective user notifications.

## Tech Stack

### Backend:
- **Node.js**: Backend environment using GraphQL for server-side logic.
- **GraphQL**: API for efficient querying of data.
- **Prisma ORM**: Type-safe ORM for interacting with the PostgreSQL database.
- **PostgreSQL**: Relational database system to store user data and posts.
- **Vercel PostgreSQL**: Cloud-based PostgreSQL database management.
- **Redis**: Used for query caching to enhance performance.
- **JSON Web Tokens (JWT)**: Secure user authentication.

### Frontend:
- **Next.js**: Frontend framework for building React applications with server-side rendering.
- **TailwindCSS**: Utility-first CSS framework for fast and responsive styling.
- **React-Query**: Client-side caching of data and queries.
- **TypeScript**: Strongly typed programming language to maintain code quality.

### Hosting:
- **Vercel**: Deployment platform for both the frontend and backend.

## Installation

To run the project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/pratiksonthaliya/echo-server.git
git clone https://github.com/pratiksonthaliya/echo-client.git
```

### 2. Install dependencies
Navigate to the project directory and install the necessary dependencies for both frontend and backend:

```bash
# Backend dependencies
cd echo-server
yarn install
npx prisma generate && prisma migrate deploy
yarn build

# Frontend dependencies
cd echo-client
yarn install
yarn build
```

### 3. Set up environment variables
Create a `.env` file in the root directories of both `frontend` and `backend` and configure the following environment variables:

```bash
# Backend
PORT=8000
POSTGRES_URL=your-postgresql-url
POSTGRES_PRISMA_URL=your-postgresql-prisma-url
POSTGRES_URL_NO_SSL=your-postgresql-prisma-url-no-ssl
POSTGRES_URL_NON_POOLING=your-postgresql-prisma-url-non-pooling
POSTGRES_USER=your-postgresql-user
POSTGRES_HOST=your-postgresql-host
POSTGRES_PASSWORD=your-postgresql-password
POSTGRES_DATABASE=your-postgresql-database
JWT_SECRET=your-secret
REDIS_URL=your-redis-url
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AWS_DEFAULT_REGION=your-aws-default-region
AWS_S3_BUCKET=your-aws-s3-bucket
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key

# Frontend
NEXT_PUBLIC_API_URL=your-backend-url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. Run the development server
```bash
# Backend
cd echo-server
yarn dev

# Frontend
cd echo-client
yarn dev
```

The app will be running on `http://localhost:3000` for the frontend and `http://localhost:8000` for the backend.

## Usage

- **Post Tweets**: Click on the "New Post" button to create a tweet.
- **Like/Unlike Posts**: Click the heart icon on any post to like or unlike it.
- **Comment on Posts**: Open a post and type in your comment to engage in discussions.
- **Bookmark Posts**: Use the bookmark icon to save posts to your bookmarks.
- **Follow/Unfollow**: Visit another user's profile and click the "Follow" button to follow or unfollow them.

## Deployment

The project is deployed using **Vercel**. For local deployment or CI/CD pipeline integration, follow Vercel's guidelines.

## Contributing

Feel free to fork the repository and submit pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License.