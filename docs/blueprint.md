# **App Name**: SmartQueue

## Core Features:

- Secure User & Admin Authentication: JWT-based signup and login system for both regular users and administrators, ensuring secure access to their respective functionalities.
- User Queue Request & Real-time Status Display: Allows users to request entry into a queue and, upon approval, displays their unique token number, current serving number, their position in the queue, and an estimated wait time, all updated dynamically.
- Admin Pending Request Management: Administrators can securely access a panel to view incoming queue entry requests, with options to approve or reject them. Approval automatically generates and assigns a token.
- Admin Live Queue Control Panel: Provides administrators with tools to manage the live queue, including calling the next token, skipping a token, resetting the entire queue, and broadcasting messages to all queued users.
- Real-Time User Notifications: Users receive instant browser notifications and in-app toast popups when their turn is approaching or has been called, powered by Socket.io.
- Real-time Data Synchronization (Socket.io): Utilizes Socket.io for bidirectional communication, ensuring all client interfaces (user and admin) reflect the most current queue status without requiring page refreshes.
- Queue & User Data Persistence (MongoDB): Storage and retrieval of user information, queue entries, token numbers, status (pending/approved/served), and positional data using a MongoDB database.

## Style Guidelines:

- The application employs a sophisticated dark theme, leveraging shades of deep blue to evoke professionalism and clarity. The primary color is a rich indigo (#5F5FDB), chosen for its ability to stand out against dark backgrounds, signifying key interactions and states. The background is a very dark, slightly desaturated blue-gray (#17171C), providing a calm and focused environment for data display. An analogous accent color, a vibrant sky blue (#84DAFF), is used sparingly for highlights and crucial notifications, drawing user attention effectively.
- Body and headline font: 'Inter' (sans-serif) for a modern, objective, and highly readable interface suitable for displaying real-time data and queue information. Its clean lines contribute to a professional aesthetic.
- Minimalist and functional vector icons are recommended, designed to clearly convey actions (e.g., play, skip, approve) and statuses. Icons should maintain a consistent style, blending seamlessly with the modern and clean aesthetic of the dashboard.
- A responsive, grid-based layout prioritizes clear data presentation and intuitive navigation. User and admin interfaces will feature distinct sections for status, controls, and incoming requests, optimized for readability and efficient task execution across various screen sizes. The design accommodates both clean dashboard principles and potential 'glassmorphism' elements for visual depth.
- Subtle and purposeful animations are incorporated for state transitions, toast notifications, and element interactions. These smooth micro-interactions enhance user feedback and perception of responsiveness without causing distraction, reinforcing the application's modern feel.