import { useEffect } from "react";
import api from "./lib/api"; // adjust if your path differs

function TestConnection() {
  useEffect(() => {
    api.get("/test")
      .then((res) => console.log(res.data))
      .catch((err) => console.error("Error connecting:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Testing Backend Connection</h2>
      <p>Open your browser console to see the result.</p>
    </div>
  );
}

export default TestConnection;
