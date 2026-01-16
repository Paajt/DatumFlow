import { useEffect } from "react"


const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // Auto-close after 4 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = {
        success: 'bg-green-600',
        error: 'bg-red-700',
        info: 'bg-blue-600',
    }[type];

    const icon = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
    }[type];

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-fade-in">
            <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-75 pointer-events-auto`}>
                <span className="text-2xl">{icon}</span>
                <p className="font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-auto text-white hover:text-gray-200 text-xl"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Toast;