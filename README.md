
# MarkPDF - Interactive PDF Highlighter & Annotation Tool


MarkPDF is a full-stack web application designed to bring the experience of physical reading into the digital world. It allows users to upload PDF documents, highlight important text, and add comments, all stored securely and associated with their personal account. This tool solves the problem of transient, device-locked annotations by providing a centralized, web-accessible platform for your documents and notes.



![msedge_cmFImaMWr5](https://github.com/user-attachments/assets/ac7dcb3f-6377-44a3-8682-20a29d8c9d63)


---

## ⚡ Features

-   **Secure User Authentication:** JWT-based registration and login system to keep your documents private.
-   **Personalized Dashboard:** A central hub to upload new PDFs and access all your existing documents.
-   **Interactive PDF Viewer:** A smooth, responsive viewer to read your documents directly in the browser.
-   **Persistent Highlighting:** Select text to create highlights that are saved permanently to your account.
-   **Add Comments:** Attach comments to any highlight to add context or notes.
-   **Annotation Sidebar:** Easily navigate through all your highlights in a document using a clickable sidebar.
-   **RESTful API:** A well-structured backend API to manage users, files, and highlights.

---

## 🛠️ Tech Stack

This project is a full MERN stack application, built with modern tools for a robust and scalable architecture.

| Component      | Technology                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend** | [React](https://react.dev/), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [MongoDB](https://www.mongodb.com/)                                        |
| **Database** | [Mongoose](https://mongoosejs.com/) (ODM for MongoDB)                                                       |
| **PDF Viewer** | [react-pdf-highlighter](https://github.com/agentcooper/react-pdf-highlighter)                               |
| **API Client** | [Axios](https://axios-http.com/)                                                                            |
| **Auth** | [JSON Web Tokens (JWT)](https://jwt.io/), [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)                      |
| **File Uploads** | [Multer](https://github.com/expressjs/multer)                                                               |

---

## 📦 Installation & Setup Guide

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm
-   MongoDB (local instance or a cloud service like MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/markpdf.git
cd markpdf
````

### 2\. Backend Setup

The backend server handles all the logic, database interactions, and file storage.

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install

# Create a .env file in the Backend directory
touch .env
```

Add the following environment variables to your `.env` file. Replace the placeholder values with your own.

```env
# Your MongoDB connection string
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/markpdf?retryWrites=true&w=majority

# A strong, secret string for signing JWTs
JWT_SECRET=your_super_secret_jwt_key

# The port for the server to run on (optional, defaults to 5001)
PORT=5001
```

### 3\. Frontend Setup

The client is a React application built with Vite.

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install
```

### 4\. Running the Application

You'll need two separate terminal windows to run both the backend and frontend servers concurrently.

**In Terminal 1 (from `/Backend`):**

```bash
# Start the Node.js Express server
npm start
```

Your backend API should now be running on `http://localhost:5001`.

**In Terminal 2 (from `/client`):**

```bash
# Start the React development server
npm run dev
```

Your frontend application should now be running and accessible at `http://localhost:5173`.

-----

## 🚀 Usage

1.  **Register:** Open `http://localhost:5173` in your browser and create a new account.
2.  **Login:** Log in with your credentials to access your dashboard.
3.  **Upload PDF:** On the dashboard, use the upload button to select and upload a PDF file.
4.  **Open Viewer:** Click "Open" on any file in your list to go to the viewer page.
5.  **Highlight & Comment:** In the viewer, select any text. A small "Add Highlight" button will appear. Click it, add an optional comment, and save. Your highlight will appear in the sidebar and will be saved to the database.

-----

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

-----

## 👨‍💻 Author

**[AloneCoder]**

  * **GitHub**: [github.com/al0nec0der](https://www.google.com/search?q=https://github.com/al0nec0der)
  * **LinkedIn**: [linkedin.com/in/codewithteja](https://linkedin.com/in/codewithteja)


