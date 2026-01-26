# DatumFlow - Automated Date Management System

A web-based automated date management and dynamic pricing system for Swedish grocery retail, designed to reduce food waste through efficient expiration date tracking and intelligent price adjustments.

## Features

-   Dashboard for date management and discounts
-   Dynamic pricing algorithm based on expiration dates (50% red zone, 25% orange, 15% yellow)
-   Color-coded urgency indicators for products approaching expiration
-   Automated discount suggestions with manual override options
-   Two-step confirmation workflow for price changes
-   Edit or reset discounts for handled products
-   Real-time product status updates
-   Filtering and search functionality

## Prerequisites

-   Node.js (v16 or higher)
-   npm (comes with Node.js)
-   Git

## Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Paajt/DatumFlow.git
cd DatumFlow
```

### 2. Install Dependencies

```bash
npm run setup
```

This command installs all required dependencies for the root project, backend, and frontend.

### 3. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cd backend
```

Create a new file named `.env` and add the following credentials:

```env
MONGODB_URI=<credentials-provided-by-author>
PORT=5001
NODE_ENV=development
```

**Note:** MongoDB credentials will be provided separately by the project author.

### 4. Seed the Database

Return to the root directory and seed the database with sample products:

```bash
cd ..
npm run seed
```

This populates the database with curated Swedish grocery products for testing and demonstration.

### 5. Start the Application

```bash
npm run dev
```

This command starts both the backend server and frontend application concurrently.

### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

## Technology Stack

### Frontend

-   **React** - UI library
-   **Vite** - Build tool and development server
-   **React Router DOM** - Client-side routing
-   **Tailwind CSS** - Utility-first CSS framework
-   **Axios** - HTTP client
-   **date-fns** - Date utility library

### Backend

-   **Node.js** with ES Modules
-   **Express** - Web framework
-   **MongoDB** with **Mongoose** - Database and ODM
-   **Axios** - HTTP client for external APIs
-   **CORS** - Cross-Origin Resource Sharing
-   **dotenv** - Environment variable management
-   **Nodemon** - Development auto-restart

### Development Tools

-   **Concurrently** - Run multiple commands simultaneously
-   **Vitest** - Modern unit testing framework
-   **ESLint** - Code linting
-   **PostCSS** & **Autoprefixer** - CSS processing

## Available Commands

From the root directory (`DatumFlow/`):

-   `npm run setup` - Install all dependencies (root, backend, frontend)
-   `npm run seed` - Seed database with Swedish grocery mock data
-   `npm run seed:mock` - Explicitly seed with mock data
-   ~~`npm run seed:real`~~ - Seed database with real data from Open Food Facts API
    **(Currently not working properly, don't use this)**
-   `npm run dev` - Start both backend and frontend concurrently
-   `npm test` - Run all backend unit tests

## Testing

The system includes unit tests for business logic:

-   **PricingAlgorithm**: Validates discount calculations for all urgency zones, price validation and edge cases.
-   **Product Model**: Verifies expiration date calculations, urgency level classification and product status management.

## Troubleshooting

### Port Already in Use

If port 5001 or 5173 is already in use, modify the port in:

-   Backend: `backend/.env` (PORT variable)
-   Frontend: `frontend/vite.config.js`

### Database Connection Issues

Ensure that:

-   MongoDB credentials are correctly set in `backend/.env`

### Dependencies Installation Fails

Try installing dependencies manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Concurrently Fails

Try running backend and frontend manually:

```bash

# Run backend
cd backend
npm run dev

# Run frontend
cd ../frontend
npm run dev

```

Open your browser and navigate to:

```
http://localhost:5173
```
