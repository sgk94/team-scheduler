# ⚛️ React + Firebase Auth Starter Kit

A minimal, production-ready boilerplate for Firebase Authentication (Email/Password) with React, React Router, and Tailwind CSS.  
Perfect for quickly bootstrapping SaaS apps, dashboards, or membership portals.

---

## 🚀 Features

- 🔐 Firebase Auth (Email/Password)
- ⚛️ React 19 + TypeScript
- 🛡 Protected routes with React Router
- 🌐 Context-based global auth state
- 🎨 TailwindCSS v3 styling
- 🔍 Type-safe, minimal, and extensible
- 🚪 Logout, redirects, and error handling

---

## 📦 Tech Stack

- [React 19](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [React Router v6](https://reactrouter.com/)
- [Tailwind CSS v3](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

## 🛠️ Getting Started

1. **Clone or download** the project.

2. **Install dependencies**

   This project uses [Vite](https://vitejs.dev/) — no extra config needed:

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Visit the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable **Email/Password** auth under **Authentication → Sign-in method**
   - Add the following to a `.env` file in your project root:

     ```env
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```

4. **Start the local dev server**

   ```bash
   npm run dev
   ```

---

## 📄 Pages + Features

- `/login` – sign in with email/password
- `/register` – create a new account
- `/dashboard` – protected route (redirects if not logged in)
- `PrivateRoute` – reusable route guard
- `AuthContext` – global auth state and methods

---

## 🗂 Folder Structure

```txt
src/
├── context/
│   ├── AuthContext.tsx
│   └── AuthProvider.tsx
├── firebase/
│   └── config.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── routes/
│   └── PrivateRoute.tsx
├── App.tsx
```

---

## 📜 License

MIT — free to use for personal and commercial projects.

---

## ✨ Author

Made with 💻 by **sgk94**  
Feel free to [reach out](mailto:kimsha004@gmail.com) with questions, feedback, or custom requests!
