# ClickMe

## 1. Introduction

### Project Overview
ClickMe is a web application where each logged-in user can click a button to boost their personal score, which is then displayed on a real-time global leaderboard.

### Technical Stack
Built on the MERN stack (MongoDB, Express.js, React.js, Node.js), the application utilizes Tailwind CSS for responsive design and Socket.IO for live updates. It's deployed using AWS S3 for the frontend and Render for the backend, demonstrating advanced CI/CD practices.

## 2. Architecture and Design
ClickMe features a two-tier architecture with a decoupled frontend and backend. The frontend manages user interactions and visualizations, while the backend handles data operations, authentication, and real-time communication.

### Frontend Details
- **Technologies Used**: The user interface is built using React. Tailwind CSS is employed for its design and dynamic responsiveness.
- **Deployment**: The frontend is hosted on AWS S3.
- **Features Implemented**: The frontend includes an authentication system that secures user sessions. It integrates Socket.IO to enable real-time updates across the user interface, particularly within the leaderboard, which displays user scores live as they are updated.

### Backend Details
- **Technologies Used**: The server-side utilizes Node.js and Express.js to create a scalable and flexible API. MongoDB is used as a NoSQL database to store user data and click counts efficiently.
- **Deployment**: The backend is deployed on Render, which is connected to the GitHub repo to ensure continuous integration and delivery.
- **Database Design**: MongoDB stores user information and click data in one main collection. The collection holds user credentials and profile information, where passwords are securely stored using encryption. In addition to the click counts that tracks the number of clicks per user.

## 3. CI/CD Pipeline
The Continuous Integration and Continuous Deployment (CI/CD) pipeline for ClickMe is implemented using GitHub Actions. GitHub Actions workflows are configured to trigger on every push to the main branch of the repository. These workflows handle the deployment of both frontend and backend components of the application.

### Frontend Deployment
- When changes are pushed, the GitHub Actions workflow automatically builds the frontend React application.
- Upon a successful build, the static files are uploaded to AWS S3, which serves the frontend. This process ensures that the latest version of the UI is always live.

### Backend Deployment
- Simultaneously, any changes to the backend are detected by Render through a direct connection set up via the Render dashboard.

## 4. Security and Authentication
### Authentication Mechanism
- When a user logs in, the server generates a JWT that encapsulates the user's identity and grants them access to specific resources for a limited period. This token is stored in the user's session storage and used with certain requests to authenticate actions like clicking the button or accessing the leaderboard.
### Token Management
- The application periodically refreshes these tokens to maintain security while ensuring user sessions remain valid without interruption. Refresh tokens are used to securely generate new access tokens, which means users are not frequently asked to log in manually.
### Security Considerations
- **Environment Variables**: Sensitive information such as database connection strings and secret keys are stored in environment variables. This practice keeps critical data out of the codebase and reduces the risk of exposure.
- **Password Encryption and Decryption**: Passwords are encrypted before they are stored in MongoDB to protect user credentials even if database access is compromised. When validating user logins, the encrypted passwords are decrypted securely to check against the credentials provided by the user.

## 5. Real-time Data Handling
ClickMe utilizes Socket.IO, a powerful JavaScript library, to manage real-time web socket connections between the client and server. This implementation is crucial for two main features: the real-time updating of click counts and the dynamic leaderboard.

### Click Updates
- When a user clicks the button on the frontend, the action triggers a message to be sent via Socket.IO to the server. The server then processes the click, updates the database, and broadcasts the updated click count to all connected clients.

### Leaderboard Updates
- The leaderboard, which displays the scores of users in descending order, is updated in real-time as well. Each time a click is registered and the database is updated, the server sends out a broadcast via Socket.IO to all connected clients with the new leaderboard standings.

## 6. Access Instructions
### Online Access
- To access "ClickMe online, you can visit the following URL: [ClickMe Frontend](http://ayrproject.s3-website.us-east-2.amazonaws.com/)

### Offline Access
- **Clone the Repository**: First, clone the repository to your local machine using the following Git command: `git clone https://github.com/ADabti/AyrProject.git`
- **To start the Frontend**: navigate to the client folder in your terminal and run: `npm start` and the frontend will start on: http://localhost:3000/
- **To start the Backend**: navigate to the server folder in your terminal and run: `node ./index.js` and the backend will start on: http://localhost:5000/
