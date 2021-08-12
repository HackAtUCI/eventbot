import { useState } from "react";
import "./tokenInput.css";

function TokenInput({ login }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const valid = await login(token);
    if (!valid) {
      setTokenValid(false);
      setLoading(false);
    }
  };

  const invalidMessage = <div className="invalid-feedback">invalid token</div>;

  return (
    <div>
      <h1>Enter Slack Token</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="token-input">Slack Token</label>
        <input
          type="password"
          id="token-input"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          Login
        </button>
        {tokenValid === false && invalidMessage}
      </form>
    </div>
  );
}

export default TokenInput;
