import React, { useState } from "react";
import { X, Upload, FileSpreadsheet, FileCode, Check } from "lucide-react";

export default function ImportExportModal({
  isOpen,
  onClose,
  contacts,
  onImportContacts,
}) {
  const [importText, setImportText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  // Export to CSV
  const handleExportCSV = () => {
    if (!contacts.length) return;
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Job Title",
      "Category",
      "Is Favorite",
      "Address",
      "Notes",
    ];
    const rows = contacts.map((c) => [
      `"${(c.name || "").replace(/"/g, '""')}"`,
      `"${(c.email || "").replace(/"/g, '""')}"`,
      `"${(c.phone || "").replace(/"/g, '""')}"`,
      `"${(c.company || "").replace(/"/g, '""')}"`,
      `"${(c.job_title || "").replace(/"/g, '""')}"`,
      `"${(c.category || "Personal").replace(/"/g, '""')}"`,
      c.is_favorite ? "TRUE" : "FALSE",
      `"${(c.address || "").replace(/"/g, '""')}"`,
      `"${(c.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `contacts_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (!contacts.length) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(contacts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `contacts_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Import
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!importText.trim()) {
      setError("Please paste CSV or JSON contact data to import.");
      return;
    }

    try {
      let parsed = [];
      if (importText.trim().startsWith("[") || importText.trim().startsWith("{")) {
        const raw = JSON.parse(importText);
        parsed = Array.isArray(raw) ? raw : [raw];
      } else {
        // Simple CSV parser
        const lines = importText.trim().split("\n");
        if (lines.length > 1) {
          const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
            const obj = {};
            headers.forEach((h, idx) => {
              if (h.includes("name")) obj.name = cols[idx];
              else if (h.includes("mail")) obj.email = cols[idx];
              else if (h.includes("phone")) obj.phone = cols[idx];
              else if (h.includes("company")) obj.company = cols[idx];
              else if (h.includes("job") || h.includes("title")) obj.job_title = cols[idx];
              else if (h.includes("category")) obj.category = cols[idx] || "Personal";
              else if (h.includes("note")) obj.notes = cols[idx];
            });
            if (obj.name) parsed.push(obj);
          }
        }
      }

      if (!parsed.length) {
        setError("Could not find any valid contacts to import.");
        return;
      }

      await onImportContacts(parsed);
      setSuccess(`Successfully imported ${parsed.length} contacts!`);
      setImportText("");
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error(err);
      setError("Invalid format. Please verify JSON or CSV structure.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Export & Import Contacts</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(244, 63, 94, 0.1)",
                color: "var(--accent-rose)",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "var(--accent-emerald)",
                fontSize: "0.875rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Check size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* Export Section */}
          <div className="form-group">
            <label className="form-label">Export Current Address Book</label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={handleExportCSV}
                disabled={!contacts.length}
              >
                <FileSpreadsheet size={16} />
                <span>Export as CSV</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={handleExportJSON}
                disabled={!contacts.length}
              >
                <FileCode size={16} />
                <span>Export as JSON</span>
              </button>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "var(--border-subtle)", margin: "0.5rem 0" }} />

          {/* Import Section */}
          <form onSubmit={handleImportSubmit} className="form-group">
            <label className="form-label">Import Contacts (Paste CSV or JSON)</label>
            <textarea
              rows={4}
              placeholder={`Name,Email,Phone,Company\n"Alice Smith","alice@work.com","+15551234567","Acme Corp"`}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "0.5rem" }}
            >
              <Upload size={16} />
              <span>Import Contacts</span>
            </button>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
