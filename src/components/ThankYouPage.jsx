import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./ThankYouPage.css";

const ConfettiPiece = ({ delay, x }) => (
    <motion.div
        initial={{ y: -20, opacity: 1, x: x }}
        animate={{
            y: window.innerHeight + 20,
            rotate: 360,
            opacity: 0,
        }}
        transition={{
            duration: Math.random() * 2 + 3,
            delay: delay,
            repeat: Infinity,
            ease: "linear",
        }}
        style={{
            position: "fixed",
            top: 0,
            width: Math.random() * 10 + 5 + "px",
            height: Math.random() * 10 + 5 + "px",
            background: [
                "#9a0002",
                "#d4af37", // Gold
                "#f8f8f8",
                "#ff4d4d",
            ][Math.floor(Math.random() * 4)],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            zIndex: 0,
        }}
    />
);

const ThankYouPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId } = location.state || {};
    const [countdown, setCountdown] = useState(8);

    const confettiCount = 30;

    useEffect(() => {
        window.scrollTo(0, 0);

        const timer = setInterval(() => {
            setCountdown((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            navigate("/orders");
        }
    }, [countdown, navigate]);

    return (
        <div className="thankyou-wrapper">
            {/* Aesthetic Confetti Background */}
            <div className="confetti-container">
                {[...Array(confettiCount)].map((_, i) => (
                    <ConfettiPiece
                        key={i}
                        delay={Math.random() * 5}
                        x={Math.random() * window.innerWidth}
                    />
                ))}
            </div>

            <motion.div
                className="thankyou-card"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <motion.div
                    className="thankyou-icon-circle"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.3,
                        damping: 15,
                    }}
                >
                    <motion.div
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Check size={40} className="check-icon" />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h1 className="thankyou-title">Order Confirmed!</h1>
                    <p className="thankyou-subtitle">The Vah Moment is on its way.</p>
                </motion.div>

                <motion.div
                    className="order-details-box"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <p className="thankyou-message">
                        Thank you for shopping with Vanokhi. Your order has been placed
                        successfully and is being processed.
                    </p>

                    {orderId && (
                        <div className="order-id-pill">
                            <span className="label">Order ID:</span>
                            <span className="value">{orderId}</span>
                        </div>
                    )}
                </motion.div>

                {/* Redirect Progress Bar */}
                <motion.div
                    className="redirect-timer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <p>Redirecting to orders in {countdown}s...</p>
                    <div className="progress-bar-bg">
                        <motion.div
                            className="progress-bar-fill"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 8, ease: "linear" }}
                        />
                    </div>
                </motion.div>

                <motion.div
                    className="thankyou-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <Link to="/orders" className="btn-continue">
                        <span>View Order Status</span>
                        <ArrowRight size={18} />
                    </Link>

                    <Link to="/all-products" className="btn-orders">
                        Continue Shopping
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ThankYouPage;
