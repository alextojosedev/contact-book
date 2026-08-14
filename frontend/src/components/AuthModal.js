import React, { useState } from "react";
import { X, Sparkles, ArrowRight, LogIn, Mail } from "lucide-react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onDemoLogin,
  onGoogleAuth,
}) {
  const [tab, setTab] = useState("login"); // 'login' or 'register'
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await onLogin(formData.username, formData.password);
      } else {
        await onRegister(formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.username?.[0] ||
          "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async () => {
    setError("");
    setLoading(true);
    try {
      await onDemoLogin();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to log in as demo user.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async (email, name) => {
    setError("");
    setLoading(true);
    try {
      await onGoogleAuth({ email, name });
      setShowGooglePrompt(false);
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Google authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card animate-scale-in"
        style={{ maxWidth: "440px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            {showGooglePrompt
              ? "Sign in with Google"
              : tab === "login"
              ? "Welcome Back"
              : "Create an Account"}
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {showGooglePrompt ? (
          /* Google Account Chooser & Form */
          <div className="modal-body">
            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(244, 63, 94, 0.1)",
                  color: "var(--accent-rose)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--bg-app)",
                  border: "1px solid var(--border-subtle)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <GoogleIcon />
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Choose Google Account</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                Sign in or create your ContactBook account with Google
              </p>
            </div>

            {/* Quick Google Account Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                type="button"
                className="sidebar-item"
                style={{
                  border: "1px solid var(--border-subtle)",
                  padding: "0.75rem",
                  backgroundColor: "var(--bg-app)",
                }}
                onClick={() => handleGoogleSubmit("alex.morgan@gmail.com", "Alex Morgan")}
                disabled={loading}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: "#4285F4",
                      color: "#fff",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    A
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Alex Morgan</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      alex.morgan@gmail.com
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="sidebar-item"
                style={{
                  border: "1px solid var(--border-subtle)",
                  padding: "0.75rem",
                  backgroundColor: "var(--bg-app)",
                }}
                onClick={() => handleGoogleSubmit("sarah.connor@gmail.com", "Sarah Connor")}
                disabled={loading}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: "#EA4335",
                      color: "#fff",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    S
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Sarah Connor</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      sarah.connor@gmail.com
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0.75rem 0",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
              <span style={{ padding: "0 0.5rem" }}>OR USE ANOTHER GOOGLE ACCOUNT</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (googleEmail.trim()) {
                  handleGoogleSubmit(googleEmail.trim(), googleName.trim());
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <div className="form-group">
                <label className="form-label">Google Email</label>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowGooglePrompt(false)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                  disabled={loading || !googleEmail.trim()}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Social & Fast Auth Buttons */}
            <div style={{ padding: "1.25rem 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {/* Google Sign-In Button */}
              <button
                type="button"
                className="btn-secondary"
                style={{
                  width: "100%",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  borderColor: "var(--border-medium)",
                  backgroundColor: "var(--bg-app)",
                }}
                onClick={() => setShowGooglePrompt(true)}
                disabled={loading}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              {/* 1-Click Demo Account */}
              <button
                type="button"
                className="btn-primary"
                style={{
                  width: "100%",
                  height: "42px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                }}
                onClick={handleDemoClick}
                disabled={loading}
              >
                <Sparkles size={16} />
                <span>Instant Demo Account (1-Click)</span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0.75rem 0 0.25rem",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
                <span style={{ padding: "0 0.75rem" }}>OR WITH USERNAME</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
              </div>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                padding: "0 1.5rem",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  fontWeight: tab === "login" ? 700 : 500,
                  color: tab === "login" ? "var(--primary-600)" : "var(--text-secondary)",
                  borderBottom: tab === "login" ? "2px solid var(--primary-600)" : "none",
                }}
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  fontWeight: tab === "register" ? 700 : 500,
                  color: tab === "register" ? "var(--primary-600)" : "var(--text-secondary)",
                  borderBottom: tab === "register" ? "2px solid var(--primary-600)" : "none",
                }}
                onClick={() => {
                  setTab("register");
                  setError("");
                }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div
                    style={{
                      padding: "0.75rem",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "rgba(244, 63, 94, 0.1)",
                      color: "var(--accent-rose)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </div>
                )}

                {tab === "register" && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        placeholder="Alex"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({ ...formData, first_name: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        placeholder="Morgan"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({ ...formData, last_name: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Username *</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                    autoFocus
                  />
                </div>

                {tab === "register" && (
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%" }}
                  disabled={loading}
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : tab === "login" ? (
                    <>
                      <LogIn size={16} />
                      <span>Sign In</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight size={16} />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
