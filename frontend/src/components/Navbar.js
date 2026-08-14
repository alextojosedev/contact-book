import React from "react";
import {
  BookUser,
  Search,
  X,
  Plus,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export default function Navbar({
  searchTerm,
  setSearchTerm,
  theme,
  toggleTheme,
  user,
  onLogout,
  onOpenAddModal,
  onOpenAuthModal,
}) {
  return (
    <header className="navbar">
      <div className="brand-section">
        <div className="brand-icon">
          <BookUser size={22} />
        </div>
        <span>ContactBook</span>
      </div>

      <div className="search-bar-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, phone, company, or note..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchTerm("")}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="nav-actions">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user ? (
          <>
            <button className="btn-primary" onClick={onOpenAddModal}>
              <Plus size={18} />
              <span>Add Contact</span>
            </button>

            <div className="user-profile-pill">
              <div className="user-avatar-small">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <span>{user.first_name ? `${user.first_name}` : user.username}</span>
              <button
                onClick={onLogout}
                title="Log out"
                style={{ marginLeft: "4px", color: "var(--text-muted)", padding: "2px" }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <button className="btn-primary" onClick={onOpenAuthModal}>
            <UserIcon size={18} />
            <span>Sign In / Demo</span>
          </button>
        )}
      </div>
    </header>
  );
}
