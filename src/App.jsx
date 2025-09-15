import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import Routes from "./Routes";
import { Toaster } from "./components/ui/toaster";
import React from "react";
import { KeyRound, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import GroupsButton from "./components/GroupsButton";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ModeToggle />
      <Link to="/change-password" className="relative top-16 -right-4">
        <Button variant="outline" size="icon" className="focus-visible:ring-0">
          <KeyRound size={20} strokeWidth={1.25} />
        </Button>
      </Link>
      <div>
        <Button
          variant="outline"
          size="icon"
          className="focus-visible:ring-0 absolute top-5 right-16"
          asChild
        >
          <a href="/barcode">
            <QrCode size={20} strokeWidth={1.25} />
          </a>
        </Button>
      </div>
      <Toaster />
      <main className="mt-24 px-5 sm:px-10 md:px-20">
        <Routes />
      </main>
    </ThemeProvider>
  );
}

export default React.memo(App);
