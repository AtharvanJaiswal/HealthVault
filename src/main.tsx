
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Debug: Verify environment variables are loaded
console.log("ENV URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("ENV ANON KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

createRoot(document.getElementById("root")!).render(<App />);
