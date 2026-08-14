import React, { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ContactList from "../components/ContactList";
import ContactDetails from "../components/ContactDetails";
import ContactModal from "../components/ContactModal";
import AuthModal from "../components/AuthModal";
import ImportExportModal from "../components/ImportExportModal";
import Toast from "../components/Toast";

export default function HomePage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name_asc");
  const [theme, setTheme] = useState(() => localStorage.getItem("cb_theme") || "light");
  
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cb_user")) || null;
    } catch {
      return null;
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Theme switch
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("cb_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("cb_access_token");
    localStorage.removeItem("cb_refresh_token");
    localStorage.removeItem("cb_user");
    setUser(null);
    setContacts([]);
    setSelectedContact(null);
    showToast("Signed out successfully", "info");
  }, [showToast]);

  // Auth check & load initial contacts
  const fetchContacts = useCallback(async () => {
    const token = localStorage.getItem("cb_access_token");
    if (!token) {
      setContacts([]);
      setSelectedContact(null);
      return;
    }

    try {
      const res = await api.get("/contacts/");
      setContacts(res.data);

      // Keep selected contact updated or default to first
      setSelectedContact((prev) => {
        if (prev) {
          const match = res.data.find((c) => c.id === prev.id);
          return match || (res.data.length > 0 ? res.data[0] : null);
        }
        return res.data.length > 0 ? res.data[0] : null;
      });
    } catch (err) {
      console.error("Error fetching contacts:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  }, [handleLogout]);

  // Check current user profile
  const checkCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("cb_access_token");
    if (!token) return;
    try {
      const res = await api.get("/auth/me/");
      setUser(res.data);
      localStorage.setItem("cb_user", JSON.stringify(res.data));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setContacts([]);
      setSelectedContact(null);
      showToast("Session expired. Please sign in again.", "info");
    };

    window.addEventListener("cb_auth_expired", handleAuthExpired);
    return () => window.removeEventListener("cb_auth_expired", handleAuthExpired);
  }, [showToast]);

  useEffect(() => {
    const token = localStorage.getItem("cb_access_token");
    if (token) {
      checkCurrentUser();
      fetchContacts();
    } else {
      // Open auth modal if not signed in so user can choose demo or sign in
      setIsAuthModalOpen(true);
    }
  }, [checkCurrentUser, fetchContacts]);

  // Auth Actions
  const handleLogin = async (username, password) => {
    const res = await api.post("/auth/token/", { username, password });
    localStorage.setItem("cb_access_token", res.data.access);
    localStorage.setItem("cb_refresh_token", res.data.refresh);
    
    // Fetch profile
    const profileRes = await api.get("/auth/me/");
    setUser(profileRes.data);
    localStorage.setItem("cb_user", JSON.stringify(profileRes.data));
    showToast(`Welcome back, ${profileRes.data.first_name || profileRes.data.username}!`);
    fetchContacts();
  };

  const handleRegister = async (formData) => {
    const res = await api.post("/auth/register/", formData);
    localStorage.setItem("cb_access_token", res.data.access);
    localStorage.setItem("cb_refresh_token", res.data.refresh);
    setUser(res.data.user);
    localStorage.setItem("cb_user", JSON.stringify(res.data.user));
    showToast("Account created successfully!");
    fetchContacts();
  };

  const handleDemoLogin = async () => {
    const res = await api.post("/auth/demo-login/");
    localStorage.setItem("cb_access_token", res.data.access);
    localStorage.setItem("cb_refresh_token", res.data.refresh);
    setUser(res.data.user);
    localStorage.setItem("cb_user", JSON.stringify(res.data.user));
    showToast("Logged in with Demo Account!");
    fetchContacts();
  };

  // Contact Operations
  const handleToggleFavorite = async (contact) => {
    try {
      const res = await api.post(`/contacts/${contact.id}/toggle-favorite/`);
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? res.data : c))
      );
      if (selectedContact && selectedContact.id === contact.id) {
        setSelectedContact(res.data);
      }
      showToast(
        res.data.is_favorite
          ? `Added ${contact.name} to Favorites ⭐`
          : `Removed ${contact.name} from Favorites`
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to update favorite status", "error");
    }
  };

  const handleSaveContact = async (data) => {
    if (editingContact) {
      const res = await api.put(`/contacts/${editingContact.id}/`, data);
      setContacts((prev) =>
        prev.map((c) => (c.id === editingContact.id ? res.data : c))
      );
      setSelectedContact(res.data);
      showToast(`Updated "${res.data.name}"`);
    } else {
      const res = await api.post("/contacts/", data);
      setContacts((prev) => [res.data, ...prev]);
      setSelectedContact(res.data);
      showToast(`Created contact "${res.data.name}"`);
    }
    setEditingContact(null);
  };

  const handleDeleteContact = async (contact) => {
    if (!window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      return;
    }
    try {
      await api.delete(`/contacts/${contact.id}/`);
      setContacts((prev) => prev.filter((c) => c.id !== contact.id));
      if (selectedContact && selectedContact.id === contact.id) {
        const remaining = contacts.filter((c) => c.id !== contact.id);
        setSelectedContact(remaining.length > 0 ? remaining[0] : null);
      }
      showToast(`Deleted ${contact.name}`, "info");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete contact", "error");
    }
  };

  const handleImportContacts = async (importedList) => {
    let count = 0;
    for (const item of importedList) {
      try {
        await api.post("/contacts/", item);
        count++;
      } catch (e) {
        console.error(e);
      }
    }
    await fetchContacts();
    showToast(`Successfully imported ${count} contacts!`);
  };

  const handleCopyInfo = (data, customMsg) => {
    let text = "";
    if (customMsg && (data.phone || data.email)) {
      text = data.phone || data.email;
    } else {
      text = `Name: ${data.name || ""}\nPhone: ${data.phone || "N/A"}\nEmail: ${data.email || "N/A"}\nCompany: ${data.company || "N/A"}\nJob: ${data.job_title || "N/A"}\nAddress: ${data.address || "N/A"}\nNotes: ${data.notes || "N/A"}`;
    }
    navigator.clipboard.writeText(text);
    showToast(customMsg || "Contact card copied to clipboard!");
  };

  // Filter & Sort Contacts locally for fast fluid responsiveness
  const filteredContacts = contacts
    .filter((c) => {
      // Category filter
      if (activeCategory === "Favorites" && !c.is_favorite) return false;
      if (
        activeCategory !== "All" &&
        activeCategory !== "Favorites" &&
        (c.category || "").toLowerCase() !== activeCategory.toLowerCase()
      ) {
        return false;
      }
      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = (c.name || "").toLowerCase().includes(q);
        const matchesEmail = (c.email || "").toLowerCase().includes(q);
        const matchesPhone = (c.phone || "").toLowerCase().includes(q);
        const matchesCompany = (c.company || "").toLowerCase().includes(q);
        const matchesTitle = (c.job_title || "").toLowerCase().includes(q);
        const matchesNotes = (c.notes || "").toLowerCase().includes(q);
        return (
          matchesName ||
          matchesEmail ||
          matchesPhone ||
          matchesCompany ||
          matchesTitle ||
          matchesNotes
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name_desc") {
        return (b.name || "").localeCompare(a.name || "");
      }
      if (sortBy === "recent") {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      if (sortBy === "company") {
        return (a.company || "").localeCompare(b.company || "");
      }
      // Default: Favorites first, then name A-Z
      if (a.is_favorite !== b.is_favorite) {
        return a.is_favorite ? -1 : 1;
      }
      return (a.name || "").localeCompare(b.name || "");
    });

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
        onOpenAddModal={() => {
          setEditingContact(null);
          setIsAddModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Split Layout */}
      <main className="main-workspace">
        {/* Left Sidebar */}
        <Sidebar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          contacts={contacts}
          onOpenImportExport={() => setIsImportExportOpen(true)}
        />

        {/* Center Contacts Explorer */}
        <ContactList
          contacts={filteredContacts}
          selectedContact={selectedContact}
          onSelectContact={(c) => {
            setSelectedContact(c);
            setIsMobileDetailOpen(true);
          }}
          onToggleFavorite={handleToggleFavorite}
          onEditContact={(c) => {
            setEditingContact(c);
            setIsAddModalOpen(true);
          }}
          onDeleteContact={handleDeleteContact}
          onCopyInfo={handleCopyInfo}
          onOpenAddModal={() => {
            setEditingContact(null);
            setIsAddModalOpen(true);
          }}
          sortBy={sortBy}
          setSortBy={setSortBy}
          activeCategory={activeCategory}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
        />

        {/* Right Details Inspector */}
        <ContactDetails
          contact={selectedContact}
          onToggleFavorite={handleToggleFavorite}
          onEditContact={(c) => {
            setEditingContact(c);
            setIsAddModalOpen(true);
          }}
          onDeleteContact={handleDeleteContact}
          onCopyInfo={handleCopyInfo}
          onCloseMobile={isMobileDetailOpen ? () => setIsMobileDetailOpen(false) : null}
        />
      </main>

      {/* Contact Form Modal (Add / Edit) */}
      <ContactModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleSaveContact}
        initialData={editingContact}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDemoLogin={handleDemoLogin}
      />

      {/* Export / Import Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        contacts={contacts}
        onImportContacts={handleImportContacts}
      />

      {/* Floating Notifications Toast Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
