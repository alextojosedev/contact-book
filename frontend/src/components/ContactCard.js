import React from "react";
import { Star } from "lucide-react";

export const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getColorForContact = (contact) => {
  if (contact.avatar_color && contact.avatar_color.startsWith("#")) {
    return contact.avatar_color;
  }
  const colors = [
    "#6366f1", // Indigo
    "#ec4899", // Pink
    "#0ea5e9", // Sky
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#14b8a6", // Teal
    "#f43f5e", // Rose
  ];
  let hash = 0;
  const str = contact.name || "A";
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function ContactCard({
  contact,
  isSelected,
  onSelect,
  onToggleFavorite,
}) {
  const bgColor = getColorForContact(contact);
  const initials = getInitials(contact.name);
  const catClass = `tag-${(contact.category || "personal").toLowerCase()}`;

  return (
    <div
      className={`contact-card animate-fade-in ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(contact)}
    >
      <div className="contact-card-left">
        <div className="avatar-circle" style={{ backgroundColor: bgColor }}>
          {initials}
        </div>
        <div className="contact-info-block">
          <span className="contact-name">
            {contact.name}
          </span>
          <span className="contact-subtext">
            {contact.job_title ? `${contact.job_title}` : ""}
            {contact.job_title && contact.company ? ` • ` : ""}
            {contact.company ? `${contact.company}` : (contact.phone || contact.email || "No contact info")}
          </span>
          <div>
            <span className={`category-tag ${catClass}`}>
              {contact.category || "Personal"}
            </span>
          </div>
        </div>
      </div>

      <div className="contact-card-actions">
        <button
          className={`fav-star-btn ${contact.is_favorite ? "is-fav" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(contact);
          }}
          title={contact.is_favorite ? "Unmark favorite" : "Mark favorite"}
        >
          <Star size={18} fill={contact.is_favorite ? "#f59e0b" : "none"} />
        </button>
      </div>
    </div>
  );
}
