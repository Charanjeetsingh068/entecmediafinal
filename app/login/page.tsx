"use client";

import { useEffect } from "react";

export default function LoginRedirect() {
  useEffect(() => {
    window.location.replace("/admin/index.html");
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#090a10", color: "#fff", fontFamily: "sans-serif" }}>
      <p>Redirecting to Admin Portal...</p>
    </div>
  );
}
