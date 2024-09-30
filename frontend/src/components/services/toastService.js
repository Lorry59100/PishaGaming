// toastService.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

let toastId = null;

export const ToastSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const ToastCenteredSuccess = (message) => {
  toast.success(message, {
    position: "top-center",
    className: "big-toast",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const ToastCenteredWarning = (message) => {
  toastId = toast.warning(message, {
    position: "top-center",
    className: "big-toast",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
  console.log('ToastCenteredWarning called with message:', message);
};

export const ToastImportantSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const ToastError = (errorMessage) => {
  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const ToastErrorWithLink = (message, linkText, linkUrl) => {
  toast.error(
    React.createElement(
      'div',
      null,
      message,
      ' Vous pouvez en obtenir un nouveau ',
      React.createElement('a', { href: linkUrl }, linkText)
    ),
    {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      theme: "dark",
    }
  );
};

export const dismissToast = () => {
  if (toastId) {
    console.log('dismissToast called');
    toast.dismiss(toastId);
    toastId = null;
  }
};
