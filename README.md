React + Vite This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

@vitejs/plugin-react uses Babel for Fast Refresh @vitejs/plugin-react-swc uses SWC for Fast Refresh Chat App developed using instantDB and IndexedDB for both online and offline capabilities.

This project is a React-based chat application that incorporates IndexedDB for local data storage, enabling offline functionality. The app allows users to manage contacts and chat messages, even when there is no internet connection. Below, you’ll find the instructions to set up and run the application, along with insights into the design choices, challenges faced, and the usage of key React features like hooks, context, and custom hooks.

Features

Offline Capability: Contacts and messages are stored in IndexedDB, so users can access them without an internet connection.

Dynamic State Management: Implemented using React’s useReducer and useContext.

Real-Time Updates: User actions like adding or deleting messages are reflected immediately in the UI and saved to local storage.

Simple and Intuitive UI: Designed with Tailwind CSS for responsiveness and aesthetics.

Setup and Installation Prerequisites Node.js (v14 or higher) npm or yarn

Steps to Run the Application Clone the Repository: git clone cd chat-app

Install Dependencies: npm install or yarn install

Start the Development Server: npm run dev or yarn start

Access the Application: Open http://localhost:5173 in your browser.

Build for Production: npm run build or yarn build
