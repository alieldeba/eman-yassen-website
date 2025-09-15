import { ArrowLeft, BadgeAlert } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import React from "react";

function NotFound() {
  return (
    <main className="w-full h-[calc(100vh-180px)] flex flex-col gap-5 items-center justify-center">
      <BadgeAlert size={56} />
      <h3 className="text-3xl">عذرا هذه الصفحة غير موجودة</h3>
      <Link to="/">
        <Button variant="ghost" className="flex gap-2 items-center">
          المجموعات <ArrowLeft size={16} />
        </Button>
      </Link>
    </main>
  );
}

export default React.memo(NotFound);
