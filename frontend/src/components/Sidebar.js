import React from "react";
import {
  Users,
  Star,
  Briefcase,
  User,
  Home,
  Building,
  Sparkles,
  Tag,
  Download,
} from "lucide-react";

export default function Sidebar({
  activeCategory,
  setActiveCategory,
  contacts = [],
  onOpenImportExport,
}) {
  const categories = [
    { id: "All", label: "All Contacts", icon: Users },
    { id: "Favorites", label: "Favorites", icon: Star },
    { id: "Work", label: "Work", icon: Briefcase },
    { id: "Personal", label: "Personal", icon: User },
    { id: "Family", label: "Family", icon: Home },
    { id: "Client", label: "Clients", icon: Building },
    { id: "Friend", label: "Friends", icon: Sparkles },
    { id: "Other", label: "Other", icon: Tag },
  ];

  const getCount = (catId) => {
    if (catId === "All") return contacts.length;
    if (catId === "Favorites") return contacts.filter((c) => c.is_favorite).length;
    return contacts.filter(
      (c) => (c.category || "").toLowerCase() === catId.toLowerCase()
    ).length;
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-section-title">Categories & Tags</div>
        <div className="sidebar-nav-list">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = getCount(cat.id);
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <div className="sidebar-item-left">
                  <Icon size={18} />
                  <span>{cat.label}</span>
                </div>
                <span className="sidebar-count-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-section-title">Tools & Management</div>
        <button
          className="sidebar-item"
          onClick={onOpenImportExport}
          title="Import or Export contacts"
        >
          <div className="sidebar-item-left">
            <Download size={18} />
            <span>Export / Import</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
