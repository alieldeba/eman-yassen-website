import { LayoutPanelTop } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

function GroupsButton() {
  const navigate = useNavigate();

  return (
    <Button variant="outline" size="icon" onClick={() => navigate("/")}>
      <LayoutPanelTop size={16} strokeWidth={1} absoluteStrokeWidth />
    </Button>
  );
}

export default React.memo(GroupsButton);
