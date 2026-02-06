// src/components/SettingsPage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ArrowLeft, User, MapPin, Phone, Save, Mail } from "lucide-react";
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
      toast.success("Profile Updated");
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-glass-card">
        <header className="settings-header">
          <button onClick={() => navigate(-1)} className="back-circle">
            <ArrowLeft />
          </button>
          <div>
            <h1>Account Settings</h1>
            <p className="subtitle">Manage your profile and shipping details</p>
          </div>
        </header>

        <form onSubmit={handleSave} className="modern-form">
          <div className="form-sections-grid">
            <section className="form-card">
              <h3>
                <User size={20} /> Personal Details
              </h3>
              <div className="input-row">
                <div className="field">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
              <div className="field disabled">
                <label>
                  Registered Email
                </label>
                <input type="text" value={currentUser?.email} disabled />
              </div>
            </section>

            <section className="form-card">
              <h3>
                <MapPin size={20} /> Shipping Destination
              </h3>
              <div className="field">
                <label>Address Line 1 (House No, Street)</label>
                <input
                  type="text"
                  value={profile.addressLine1}
                  onChange={(e) =>
                    setProfile({ ...profile, addressLine1: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Address Line 2 (Area, Locality)</label>
                <input
                  type="text"
                  value={profile.addressLine2}
                  onChange={(e) =>
                    setProfile({ ...profile, addressLine2: e.target.value })
                  }
                />
              </div>
              <div className="input-row">
                <div className="field">
                  <label>Landmark</label>
                  <input
                    type="text"
                    value={profile.landmark}
                    onChange={(e) =>
                      setProfile({ ...profile, landmark: e.target.value })
                    }
                  />
                </div>
                <div className="field">
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
              <div className="input-row">
                <div className="field">
                  <label>Country</label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) =>
                      setProfile({ ...profile, country: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>State</label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) =>
                      setProfile({ ...profile, state: e.target.value })
                    }
                  />
                </div>
              </div>
            </section>
          </div>

          <button type="submit" className="save-btn-modern">
            <Save size={18} /> SAVE ALL CHANGES
          </button>
        </form>
      </div>
    </div>
  );
}
