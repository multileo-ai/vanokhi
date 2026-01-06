import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import "./PolicyModal.css";

const POLICY_CONTENT = {
  "Privacy Policy":
    "Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...Your privacy is important to us. We collect information to provide better services to all our users...",
  "Shipping & Delivery Policy":
    "Free shipping for domestic orders. Products are dispatched within 2-5 working days...",
  "Return and Exchnage Policy":
    "We have a 7-day return policy. Items must be unused and tags must be intact...",
  "Terms of Service":
    "By using Vanokhi, you agree to the following terms and conditions regarding your orders and usage...",
};

export default function PolicyModal({ isOpen, onClose, policyTitle }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="policy-overlay" onClick={onClose}>
          <motion.div
            className="policy-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="policy-modal-header">
              <h2>{policyTitle}</h2>
              <button className="policy-close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            <div className="policy-modal-body">
              <p className="policy-text-content">
                {POLICY_CONTENT[policyTitle] || "Content coming soon..."}
              </p>
            </div>
            <div className="policy-modal-footer">
              <button className="policy-accept-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
