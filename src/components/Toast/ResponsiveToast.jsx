import React from 'react';
import { toast } from 'react-toastify';
import { FadeTransition } from '../Transitions/Transitions';

/**
 * Custom toast component with responsive design
 */
const ResponsiveToast = ({ 
  type = 'info', 
  title, 
  message, 
  action,
  actionText = 'Action',
  onClose 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0 w-5 h-5 text-green-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 w-5 h-5 text-red-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-5 h-5 text-yellow-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-5 h-5 text-blue-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 xs:p-4">
      {getIcon()}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm xs:text-base font-medium text-white mb-1">
            {title}
          </h4>
        )}
        <p className="text-xs xs:text-sm text-gray-300 leading-relaxed">
          {message}
        </p>
      </div>
      {action && (
        <button
          onClick={action}
          className="flex-shrink-0 px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          {actionText}
        </button>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Responsive toast utilities
 */
export const showToast = {
  success: (message, options = {}) => {
    toast.success(
      <ResponsiveToast type="success" message={message} {...options} />,
      {
        className: 'bg-slate-800 border border-slate-700',
        bodyClassName: 'p-0',
        hideProgressBar: true,
        closeButton: false,
        ...options.toastOptions
      }
    );
  },

  error: (message, options = {}) => {
    toast.error(
      <ResponsiveToast type="error" message={message} {...options} />,
      {
        className: 'bg-slate-800 border border-slate-700',
        bodyClassName: 'p-0',
        hideProgressBar: true,
        closeButton: false,
        ...options.toastOptions
      }
    );
  },

  warning: (message, options = {}) => {
    toast.warning(
      <ResponsiveToast type="warning" message={message} {...options} />,
      {
        className: 'bg-slate-800 border border-slate-700',
        bodyClassName: 'p-0',
        hideProgressBar: true,
        closeButton: false,
        ...options.toastOptions
      }
    );
  },

  info: (message, options = {}) => {
    toast.info(
      <ResponsiveToast type="info" message={message} {...options} />,
      {
        className: 'bg-slate-800 border border-slate-700',
        bodyClassName: 'p-0',
        hideProgressBar: true,
        closeButton: false,
        ...options.toastOptions
      }
    );
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        pending: {
          render: () => <ResponsiveToast type="info" message={messages.pending} />,
          className: 'bg-slate-800 border border-slate-700',
          bodyClassName: 'p-0',
          hideProgressBar: true,
          closeButton: false,
        },
        success: {
          render: ({ data }) => <ResponsiveToast type="success" message={messages.success} />,
          className: 'bg-slate-800 border border-slate-700',
          bodyClassName: 'p-0',
          hideProgressBar: true,
          closeButton: false,
        },
        error: {
          render: ({ data }) => <ResponsiveToast type="error" message={messages.error} />,
          className: 'bg-slate-800 border border-slate-700',
          bodyClassName: 'p-0',
          hideProgressBar: true,
          closeButton: false,
        }
      },
      options
    );
  }
};

export default ResponsiveToast;