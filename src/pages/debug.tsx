// Absolute minimal page with no dependencies
export default function DebugPage() {
  return (
    <div style={{
      padding: "40px",
      background: "linear-gradient(to bottom, #111, #000)",
      minHeight: "100vh",
      color: "white",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{
        fontSize: "32px",
        color: "orange",
        marginBottom: "20px"
      }}>
        Debug Page - No Dependencies
      </h1>
      <div style={{
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "20px",
        borderRadius: "8px"
      }}>
        <p>If you can see this text, the issue is not with React rendering.</p>
        <p>Time now: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
