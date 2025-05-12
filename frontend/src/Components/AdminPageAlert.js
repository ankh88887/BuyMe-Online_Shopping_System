import { useEffect } from "react";
import "./AdminPageAlert.css";

const Alert = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`alert ${type}`}>
            <span>{message}</span>
            <button className="close-button" onClick={onClose}>
                ×
            </button>
        </div>
    );
};

export default Alert;