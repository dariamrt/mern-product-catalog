import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./src/contexts/AuthContext.jsx";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./src/styles/index.css";

import "./src/styles/components/Footer.css";
import "./src/styles/components/GlobalLayout.css";
import "./src/styles/components/Modal.css";
import "./src/styles/components/Navbar.css";
import "./src/styles/components/ProductCard.css";
import "./src/styles/components/ReviewList.css";

import "./src/styles/pages/Cart.css";
import "./src/styles/pages/Dashboard.css";
import "./src/styles/pages/Login.css";
import "./src/styles/pages/OrderDetails.css";
import "./src/styles/pages/ProductCatalog.css";
import "./src/styles/pages/ProductDetails.css";
import "./src/styles/pages/Profile.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
