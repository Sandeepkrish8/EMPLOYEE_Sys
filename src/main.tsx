
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { AppProvider } from "./app/context/AppContext";
  import { AuthProvider } from "./app/context/AuthContext";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <AppProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppProvider>
  );
  
