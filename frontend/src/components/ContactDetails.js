import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Building,
  Briefcase,
  Star,
  Copy,
  Edit2,
  Trash2,
  UserCheck,
  FileText,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { getInitials, getColorForContact } from "./ContactCard";

export default function ContactDetails({
  contact,
  onToggleFavorite,
  onEditContact,
  onDeleteContact,
  onCopyInfo,
  onCloseMobile,
}) {
  if (!contact) {
    return (
      <section className="details-pane">
        <div className="empty-details-state">
          <div className="empty-icon-box" style={{ width: "96px", height: "96px" }}>
            <UserCheck size={44} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Select a Contact
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", maxWidth: "300px" }}>
              Choose a contact from the list on the left to preview their complete profile, phone, email, and notes.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const bgColor = getColorForContact(contact);
  const initials = getInitials(contact.name);
  const catClass = `tag-${(contact.category || "personal").toLowerCase()}`;

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="details-pane animate-fade-in">
      {/* Mobile Back Button */}
      {onCloseMobile && (
        <button
          className="btn-secondary"
          onClick={onCloseMobile}
          style={{ marginBottom: "1rem", alignSelf: "flex-start" }}
        >
          <ArrowLeft size={16} />
          <span>Back to list</span>
        </button>
      )}

      {/* Hero Header Card */}
      <div className="detail-hero-card">
        <div className="detail-hero-header">
          <div className="detail-hero-profile">
            <div className="detail-avatar-large" style={{ backgroundColor: bgColor }}>
              {initials}
            </div>
            <div className="detail-hero-meta">
              <h2>
                <span>{contact.name}</span>
                <button
                  className={`fav-star-btn ${contact.is_favorite ? "is-fav" : ""}`}
                  onClick={() => onToggleFavorite(contact)}
                  title={contact.is_favorite ? "Unmark favorite" : "Mark favorite"}
                >
                  <Star size={22} fill={contact.is_favorite ? "#f59e0b" : "none"} />
                </button>
              </h2>
              <p>
                {contact.job_title ? `${contact.job_title}` : ""}
                {contact.job_title && contact.company ? " at " : ""}
                {contact.company ? `${contact.company}` : ""}
              </p>
              <span className={`category-tag ${catClass}`} style={{ marginTop: "0.5rem" }}>
                {contact.category || "Personal"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="detail-action-bar">
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="btn-primary">
              <Phone size={16} />
              <span>Call ({contact.phone})</span>
            </a>
          )}

          {contact.email && (
            <a href={`mailto:${contact.email}`} className="btn-secondary">
              <Mail size={16} />
              <span>Send Email</span>
            </a>
          )}

          <button
            className="btn-secondary"
            onClick={() => onCopyInfo(contact)}
            title="Copy full contact details"
          >
            <Copy size={16} />
            <span>Copy Card</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => onEditContact(contact)}
            title="Edit contact info"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>

          <button
            className="btn-danger"
            onClick={() => onDeleteContact(contact)}
            title="Delete contact"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Detailed Info Cards Grid */}
      <div className="detail-info-grid">
        {/* Contact Methods Card */}
        <div className="info-card">
          <div className="info-card-title">
            <Phone size={16} />
            <span>Contact Information</span>
          </div>

          <div className="info-row">
            <div className="info-row-left">
              <Phone size={16} />
              <span>Phone</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="info-row-value">{contact.phone || "Not set"}</span>
              {contact.phone && (
                <button
                  className="copy-btn-sm"
                  onClick={() => onCopyInfo({ phone: contact.phone }, "Phone copied!")}
                  title="Copy Phone"
                >
                  <Copy size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-row-left">
              <Mail size={16} />
              <span>Email</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="info-row-value">{contact.email || "Not set"}</span>
              {contact.email && (
                <button
                  className="copy-btn-sm"
                  onClick={() => onCopyInfo({ email: contact.email }, "Email copied!")}
                  title="Copy Email"
                >
                  <Copy size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-row-left">
              <MapPin size={16} />
              <span>Address</span>
            </div>
            <span className="info-row-value">{contact.address || "Not set"}</span>
          </div>
        </div>

        {/* Professional & Organization Card */}
        <div className="info-card">
          <div className="info-card-title">
            <Building size={16} />
            <span>Organization & Metadata</span>
          </div>

          <div className="info-row">
            <div className="info-row-left">
              <Building size={16} />
              <span>Company</span>
            </div>
            <span className="info-row-value">{contact.company || "Not set"}</span>
          </div>

          <div className="info-row">
            <div className="info-row-left">
              <Briefcase size={16} />
              <span>Job Title</span>
            </div>
            <span className="info-row-value">{contact.job_title || "Not set"}</span>
          </div>

          <div className="info-row">
            <div className="info-row-left">
              <Clock size={16} />
              <span>Created</span>
            </div>
            <span className="info-row-value">{formatDate(contact.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Notes Card */}
      {contact.notes && (
        <div className="info-card" style={{ marginTop: "1.25rem" }}>
          <div className="info-card-title">
            <FileText size={16} />
            <span>Notes & Context</span>
          </div>
          <p
            style={{
              fontSize: "0.9375rem",
              lineHeight: "1.6",
              color: "var(--text-primary)",
              whiteSpace: "pre-line",
              backgroundColor: "var(--bg-app)",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {contact.notes}
          </p>
        </div>
      )}
    </section>
  );
}
