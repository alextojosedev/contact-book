import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

const PALETTE = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#0ea5e9", // Sky
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#14b8a6", // Teal
  "#f43f5e", // Rose
];

export default function ContactModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    category: "Personal",
    is_favorite: false,
    address: "",
    notes: "",
    avatar_color: "#6366f1",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        company: initialData.company || "",
        job_title: initialData.job_title || "",
        category: initialData.category || "Personal",
        is_favorite: Boolean(initialData.is_favorite),
        address: initialData.address || "",
        notes: initialData.notes || "",
        avatar_color: initialData.avatar_color || "#6366f1",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        job_title: "",
        category: "Personal",
        is_favorite: false,
        address: "",
        notes: "",
        avatar_color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      });
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please provide a contact name.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.name?.[0] ||
          "Failed to save contact. Please verify all details."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? "Edit Contact" : "Create New Contact"}
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
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

            {/* Avatar Color Picker */}
            <div className="form-group">
              <label className="form-label">Avatar Color</label>
              <div className="color-picker-group">
                {PALETTE.map((c) => (
                  <div
                    key={c}
                    className={`color-swatch ${formData.avatar_color === c ? "active" : ""}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setFormData({ ...formData, avatar_color: c })}
                  />
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Johnathan Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                autoFocus
                required
              />
            </div>

            {/* Phone & Email */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Company & Job Title */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Product Manager"
                  value={formData.job_title}
                  onChange={(e) =>
                    setFormData({ ...formData, job_title: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Category & Favorite */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Family">Family</option>
                  <option value="Client">Client</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group" style={{ justifyContent: "center" }}>
                <label className="form-label">Favorite</label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.is_favorite}
                    onChange={(e) =>
                      setFormData({ ...formData, is_favorite: e.target.checked })
                    }
                    style={{ width: "auto" }}
                  />
                  <span>Mark as favorite ⭐</span>
                </label>
              </div>
            </div>

            {/* Physical Address */}
            <div className="form-group">
              <label className="form-label">Physical Address</label>
              <input
                type="text"
                placeholder="123 Market Street, Suite 400, San Francisco, CA"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes & Details</label>
              <textarea
                rows={3}
                placeholder="Add any helpful notes, context, or meeting highlights..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              <Check size={16} />
              <span>{isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Contact"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
