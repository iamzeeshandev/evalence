import { toast, Toaster, ToastOptions } from 'react-hot-toast';
import { X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'loading' | 'custom' | 'blank';
type NotificationOptions = ToastOptions & {
  type?: NotificationType;
  dismissible?: boolean;
  duration?: number;
};

const DEFAULT_OPTIONS: NotificationOptions = {
  position: 'top-right',
  duration: 5000,
  dismissible: true,
};

class ToastService {
  static show(message: string, options?: NotificationOptions): string {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const { type = 'success', dismissible, ...toastOptions } = mergedOptions;

    // Wrap message with close button if dismissible
    const content = (
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        {dismissible && (
          <button
            onClick={() => toast.dismiss()}
            className="ml-2 text-gray-500 cursor-pointer hover:text-gray-800"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );

    switch (type) {
      case 'success':
        return toast.success(content, toastOptions);
      case 'error':
        return toast.error(content, toastOptions);
      case 'loading':
        return toast.loading(content, toastOptions);
      case 'custom':
        return toast.custom(content, toastOptions);
      case 'blank':
        return toast(content, toastOptions);
      default:
        return toast(content, toastOptions);
    }
  }

  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: NotificationOptions,
  ): Promise<T> {
    return toast.promise(promise, messages, {
      ...DEFAULT_OPTIONS,
      ...options,
    });
  }

  static get Toaster() {
    return (
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-background !text-foreground !border !rounded-lg !shadow-md',
          duration: DEFAULT_OPTIONS.duration,
        }}
      />
    );
  }
}

export { ToastService };
