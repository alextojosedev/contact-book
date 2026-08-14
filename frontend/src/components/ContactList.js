import React from "react";
import ContactCard from "./ContactCard";
import { UserX, Plus } from "lucide-react";

export default function ContactList({
  contacts,
  selectedContact,
  onSelectContact,
  onToggleFavorite,
  onEditContact,
  onDeleteContact,
  onCopyInfo,
  onOpenAddModal,
  sortBy,
  setSortBy,
  activeCategory,
  searchTerm,
  onClearSearch,
}) {
  return (
    <section className="contacts-pane">
      <div className="contacts-header">
        <div className="contacts-header-top">
          <div className="contacts-title">
            <span>{activeCategory}</span>
            <span className="sidebar-count-badge">{contacts.length}</span>
          </div>

          <div className="contacts-header-controls">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort contacts"
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="recent">Recently Added</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
      </div>

      <div className="contacts-list-scroll">
        {contacts.length === 0 ? (
          <div className="empty-details-state" style={{ padding: "3rem 1.5rem" }}>
            <div className="empty-icon-box">
              <UserX size={36} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                No Contacts Found
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: "260px" }}>
                {searchTerm
                  ? `No contacts matching "${searchTerm}".`
                  : `No contacts in ${activeCategory} category yet.`}
              </p>
            </div>
            {searchTerm ? (
              <button className="btn-secondary" onClick={onClearSearch}>
                Clear Search
              </button>
            ) : (
              <button className="btn-primary" onClick={onOpenAddModal}>
                <Plus size={16} />
                <span>Add First Contact</span>
              </button>
            )}
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isSelected={selectedContact && selectedContact.id === contact.id}
              onSelect={onSelectContact}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEditContact}
              onDelete={onDeleteContact}
              onCopyInfo={onCopyInfo}
            />
          ))
        )}
      </div>
    </section>
  );
}
