import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import "./PolicyModal.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Link } from "react-router-dom";

const POLICY_CONTENT = {
  "Privacy Policy": `At Vanokhi, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit or make a purchase from www.vanokhi.com
. By using our website, you agree to the practices described in this policy.

<strong>Contact Information</strong>

If you have any questions or concerns regarding this Privacy Policy, please contact us at:

Email: support@vanokhi.com

Address: Pune, Maharashtra, India

<strong>SECTION 1: INFORMATION WE COLLECT</strong>

When you interact with Vanokhi, we may collect the following information:

Personal details such as your name, email address, phone number, billing address, and shipping address

Payment-related information (processed securely via third-party gateways; we do not store card details)

Technical data such as IP address, browser type, device information, and browsing behavior on our website

We may also collect your email address for marketing communication, only if you choose to opt in.

<strong>SECTION 2: CONSENT</strong>
How Do You Give Consent?

By providing your personal information to complete a transaction, place an order, or contact customer support, you consent to its collection and use for that specific purpose.

For marketing communications, your consent is always optional and can be withdrawn at any time.

How Can You Withdraw Consent?

You may withdraw your consent by:

Emailing us at support@vanokhi.com

<strong>SECTION 3: USE OF INFORMATION</strong>

We use your information to:

Process and fulfill orders

Communicate order updates and customer support

Improve our website, services, and customer experience

Send promotional emails or updates (only if you opt in)

<strong>SECTION 4: INFORMATION DISCLOSURE</strong>

Vanokhi does not sell, rent, or trade your personal information. However, we may disclose your data in the following cases:

Legal Obligations: If required by law or to protect our legal rights

Business Transfers: In the event of a merger, acquisition, or sale

Service Providers: Trusted third parties involved in payment processing, shipping, marketing, or website operations, bound by confidentiality agreements

<strong>SECTION 5: PAYMENT SECURITY</strong>

All payments are processed through secure, PCI-DSS–compliant payment gateways. Vanokhi does not store or have access to your sensitive financial information.

<strong>SECTION 6: THIRD-PARTY SERVICES</strong>

Third-party providers only collect and use your information as necessary to perform their services. Once you leave our website or are redirected to a third-party platform, their privacy policies will apply.

<strong>SECTION 7: SECURITY MEASURES</strong>

We implement industry-standard security practices to protect your personal data from unauthorized access, misuse, or alteration. In case of any data breach, we will notify affected users promptly.

<strong>SECTION 8: COOKIES</strong>
Vanokhi uses cookies to enhance your browsing experience and understand website traffic. You may disable cookies through your browser settings; however, some features of the website may not function properly.

<strong>SECTION 9: AGE RESTRICTION</strong>

By using this website, you confirm that you are at least the legal age in your jurisdiction or have parental/guardian consent.

<strong>SECTION 10: CHANGES TO THIS POLICY</strong>

Vanokhi reserves the right to update or modify this Privacy Policy at any time. Changes will be posted on this page with the revised date. Continued use of the website constitutes acceptance of those changes.`,

  "Shipping & Delivery Policy": `
At Vanokhi, every piece is thoughtfully crafted and carefully delivered. We aim to ensure a smooth and transparent shipping experience for our customers.

<strong>Order Processing</strong>

Orders are typically processed within 2–4 business days after confirmation.

During high-demand periods, sales, or new launches, processing times may be slightly longer.

<strong>Shipping Timeline</strong>

Domestic (India): 5–10 business days after dispatch

Delivery timelines may vary depending on location, courier partner, weather conditions, or unforeseen circumstances.

<strong>Shipping Charges</strong>

Shipping charges (if applicable) are calculated at checkout.

Any promotional free-shipping offers will be clearly communicated on the website.

<strong>Order Tracking</strong>

Once your order is shipped, you will receive a tracking link via email or SMS to monitor your delivery status.

<strong>Delivery Delays</strong>

Vanokhi is not responsible for delays caused by courier partners, natural events, or incorrect address details provided by the customer.`,

  "Return and Exchnage Policy": `Vanokhi follows a mindful, slow-fashion approach, producing limited pieces with attention to detail. Please read our policy carefully before placing an order.

<strong>Returns</strong>

We currently do not offer refunds unless the product received is damaged, defective, or incorrect.

Any issue must be reported within 48 hours of delivery with clear photos/videos shared via email.

<strong>Exchanges</strong>

Exchanges are allowed only for size issues, subject to availability.

Exchange requests must be raised within 3 days of delivery.

The product must be unused, unwashed, and in original condition with tags intact.

<strong>Non-Returnable Items</strong>

Custom-made pieces

Sale or discounted items

Accessories (if applicable)

<strong>Exchange Process</strong>

Once approved, customers are required to ship the product back to us.

Exchange dispatch will occur after quality inspection.

Shipping costs for exchanges may be borne by the customer unless the issue is from our end.`,

  "Terms of Service": `Welcome to Vanokhi. By accessing or using our website, you agree to the following terms and conditions.

<strong>General Conditions</strong>

By placing an order, you confirm that all information provided is accurate and complete.

Vanokhi reserves the right to refuse service to anyone for any reason at any time.

<strong>Product Information</strong>

We make every effort to display product colors and details accurately. However, slight variations may occur due to lighting, screen settings, or handcrafted nature of the garments.

Measurements may vary slightly as our pieces are crafted with artisanal processes.

<strong>Pricing & Payments</strong>

All prices are listed in INR and are inclusive/exclusive of taxes as mentioned.

Vanokhi reserves the right to modify prices without prior notice.

Payments are processed securely through third-party gateways.

<strong>Intellectual Property</strong>

All content on this website, including images, text, logos, and designs, is the exclusive property of Vanokhi.

Any unauthorized use, reproduction, or distribution is strictly prohibited.

<strong>Limitation of Liability</strong>

Vanokhi shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.

<strong>Governing Law</strong>

These terms shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of Pune, Maharashtra.`,
};

export default function PolicyModal({ isOpen, onClose, policyTitle }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="policy-overlay" onClick={onClose}>
          <motion.div
            className="policy-modal"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="policy-modal-header">
              <div className="header-title">
                <span className="subtitle">Our Policies</span>
                <h2>{policyTitle}</h2>
              </div>
              <button className="policy-close-btn" onClick={onClose}>
                <X size={28} />
              </button>
            </div>

            <div className="policy-modal-body">
              <div
                className="policy-text-content"
                dangerouslySetInnerHTML={{
                  __html:
                    POLICY_CONTENT[policyTitle] || "Content coming soon...",
                }}
              />
            </div>

            <div className="policy-modal-footer">
              <p>
                Have more questions?{" "}
                <span>
                  <Link
                    to="/contact"
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={onClose}
                  >
                    Contact Support
                  </Link>
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
