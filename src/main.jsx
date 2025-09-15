import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "dayjs/locale/ar";
import dayjs from "dayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

dayjs.locale("ar");

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense>
        <QueryClientProvider client={queryClient}>
          <App />
          <Analytics />
        </QueryClientProvider>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
