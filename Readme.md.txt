# Sentilytics - AI-Powered Sentiment Analysis Platform

Sentilytics is a modern, full-stack style web application that leverages Generative AI (Gemini API) to perform advanced sentiment analysis on text datasets. It features a professional dashboard, interactive visualizations, and simulated machine learning performance metrics.

## 🚀 Features

-   AI-Powered NLP Uses Google's Gemini 2.5 Flash model for deep sentiment analysis.
-   Interactive Visualizations
    -   Sentiment Distribution Pie Charts.
    -   Dynamic, Sentiment-Specific Word Clouds (Positive, Negative, Neutral).
    -   Model Performance Bar Charts.
-   Simulated ML Metrics Estimates Logistic Regression and Decision Tree performance (Accuracy, F1-Score, Precision, Recall) on your specific dataset.
-   Dataset Management
    -   Upload CSV files.
    -   Select specific text columns for analysis.
    -   Persistent storage using IndexedDB (Server.db simulation).
-   Secure Authentication
    -   User Registration and Login.
    -   JWT-based session simulation.
    -   Protected Routes.
-   Live Demo Mode Instant access to a pre-populated analysis view with sample data.
-   Responsive Design Fully responsive UI built with React and Tailwind CSS.

## 🛠️ Tech Stack

-   Frontend React 19, TypeScript, Tailwind CSS, Lucide React (Icons).
-   Charts Recharts.
-   AI Engine Google Gemini API (`@googlegenai`).
-   Backend Simulation
    -   API Layer Mocked Node.jsExpress service.
    -   Database IndexedDB wrapper (`Server.db`) for persistent, client-side storage of large datasets without local storage quota limits.
-   Build Tool Vite (implied by the structure).

## 📂 Project Structure

```

├── frontend
│   ├── components      # Reusable UI components (Navbar, Card, Button, Input)
│   ├── pages           # Application views (Home, Dashboard, Analysis, etc.)
│   ├── services        # Gemini AI integration service
│   ├── App.tsx          # Main application logic and routing
│   └── types.ts         # TypeScript interfaces
├── backend
│   ├── api.ts           # Simulated Backend API Controller
│   └── database.ts      # IndexedDB Wrapper (Server.db)
├── index.html           # Entry HTML
├── index.tsx            # React Entry Point
└── metadata.json        # Project metadata
```

## ⚙️ Setup & Installation

1.  Clone the repository (if applicable) or download the source.

2.  Install Dependencies
    This project uses standard React dependencies. If running locally with Node.js
    ```bash
    npm install
    ```

3.  Environment Configuration
    You must provide a valid Google Gemini API Key.
    Create a `.env` file in the root directory
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  Run the Application
    ```bash
    npm start
    # or
    npm run dev
    ```

## 📖 Usage Guide

1.  Authentication
    -   Click Get Started to register a new account.
    -   Or click Live Demo on the home page to instantly experience the app with sample data.

2.  Dashboard
    -   View your uploaded datasets.
    -   See quick stats on your data history.

3.  Uploading Data
    -   Go to the Upload page.
    -   Select a CSV file from your computer.
    -   Important Select the column containing the text you want to analyze (e.g., Review, Comment, Tweet).
    -   Click Process Dataset.

4.  Analysis
    -   Once processed, view the Analysis page.
    -   Explore the Sentiment Pie Chart.
    -   Analyze distinct Word Clouds for Positive, Negative, and Neutral terms.
    -   Download the full analysis report as a JSON file.

5.  ML Metrics
    -   Navigate to the Metrics page to see how standard ML models would likely perform on your data, complete with Confusion Matrices.

## ⚠️ Note on Backend

This project uses a sophisticated Client-Side Simulation for the backend to allow it to run entirely in the browser (e.g., on StackBlitz or local static servers) without setting up a separate Node.jsMySQL server.
-   Database Uses `IndexedDB` (browser database) to store users and datasets persistently.
-   API `backendapi.ts` simulates network delays and controller logic.

## 📄 License

This project is open-source and available for educational and portfolio purposes.
