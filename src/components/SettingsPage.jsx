import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ArrowLeft, User, MapPin, Phone, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./SettingsPage.css";

export default function SettingsPage() {
  const { currentUser, userData } = useAuth();
  const [profile, setProfile] = useState(userData.profile);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { profile });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <header className="settings-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft />
          </button>
          <h1>Profile Settings</h1>
        </header>

        <form onSubmit={handleSave} className="settings-form">
          <section className="settings-section">
            <h2>
              <User size={18} /> Basic Information
            </h2>
            <div className="form-grid">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                />
              </div>
              <div className="input-group full-width">
                <label>
                  <Phone size={14} /> Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h2>
              <MapPin size={18} /> Shipping Address
            </h2>
            <div className="form-grid">
              <div className="input-group full-width">
                <label>Address Line 1</label>
                <input
                  type="text"
                  value={profile.addressLine1}
                  onChange={(e) =>
                    setProfile({ ...profile, addressLine1: e.target.value })
                  }
                />
              </div>
              <div className="input-group full-width">
                <label>Address Line 2 / Landmark</label>
                <input
                  type="text"
                  value={profile.addressLine2}
                  onChange={(e) =>
                    setProfile({ ...profile, addressLine2: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) =>
                    setProfile({ ...profile, city: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label>State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) =>
                    setProfile({ ...profile, state: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label>Pin Code</label>
                <input
                  type="text"
                  value={profile.pinCode}
                  onChange={(e) =>
                    setProfile({ ...profile, pinCode: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          <button type="submit" className="save-settings-btn">
            <Save size={18} /> SAVE ALL CHANGES
          </button>
        </form>
      </div>
    </div>
  );
}
