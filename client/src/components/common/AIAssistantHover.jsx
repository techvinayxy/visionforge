import { Link } from "react-router-dom";
import "./AIAssistantHover.css";

function AIAssistantHover() {
  return (
    <Link
      className="vf-ai-hover"
      to="/ai-assistant"
      aria-label="Open Nexus AI Assistant"
      title="Chat with Nexus AI"
    >
      <span className="vf-ai-hover-icon" aria-hidden="true">✳</span>
      <span className="vf-ai-hover-label">Ask Nexus AI</span>
    </Link>
  );
}

export default AIAssistantHover;
