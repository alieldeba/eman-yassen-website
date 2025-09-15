import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "./ui/button";

export default function ButtonLoading() {
  return (
    <Button disabled className="gap-3 w-full">
      يرجى الإنتظار
      <ReloadIcon className="h-4 w-4 animate-spin" />
    </Button>
  );
}
