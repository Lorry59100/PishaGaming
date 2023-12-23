// toastService.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <div>
      {message} Vous pouvez en obtenir un nouveau{" "}
      <a href={linkUrl}>{linkText}</a>
    </div>,
    {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      theme: "dark",
    }
  );
};
