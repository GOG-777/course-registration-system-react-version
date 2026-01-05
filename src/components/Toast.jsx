import { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgGradient = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-600'
  }[type];

  const icon = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  }[type];

  return (
    <div 
      className={`fixed top-6 right-6 ${bgGradient} text-white px-6 py-4 rounded-xl shadow-2xl z-[9999] flex items-center space-x-3 min-w-[320px] max-w-md animate-slide-in`}
      style={{ animation: 'slideIn 0.3s ease-out' }}
    >
      <i className={`fas ${icon} text-xl`}></i>
      <span className="font-medium flex-1">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-80 transition">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;