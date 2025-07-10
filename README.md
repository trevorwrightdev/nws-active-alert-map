# Modern NWS Active Alert Map

A real-time map application that displays active weather alerts from the National Weather Service (NWS). The application features an interactive map with alert overlays, real-time updates via Socket.io, and a detailed alert list view.

## Prerequisites

-   Node.js (v14 or higher)
-   npm (comes with Node.js)

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

The backend server will start on `http://localhost:3001` with nodemon for automatic reloading during development.

### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Serve the frontend application:
    ```bash
    npx serve
    ```

The frontend will be available at `http://localhost:3000` (or the next available port if 3000 is in use).

## Running the Application

1. Start the backend server first (in one terminal):

    ```bash
    cd backend
    npm run dev
    ```

2. Start the frontend server (in another terminal):

    ```bash
    cd frontend
    npx serve
    ```

3. Open your browser and navigate to the frontend URL (typically `http://localhost:3000`)
