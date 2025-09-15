import React from "react";

function Loader({ className }) {
  return (
    <div
      className={`flex items-center justify-center font-bold print-none ${className}`}
    >
      <p>جاري التحميل ...</p>
    </div>
  );
}

export default Loader;
