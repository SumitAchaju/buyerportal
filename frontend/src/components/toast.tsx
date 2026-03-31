import { toast, type ToastOptions as ToastifyOptions } from "react-toastify";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  type LucideProps,
} from "lucide-react";

interface ToastOptions {
  title: string;
  message: string;
  variant: "success" | "warning" | "error";
}

interface ToastBodyProps extends Omit<ToastOptions, "variant"> {
  icon: React.FC<LucideProps>;
  iconColor: string;
  iconBg: string;
}

const CloseButton = ({
  closeToast,
}: {
  closeToast?: (e: React.MouseEvent<HTMLElement>) => void;
}) => (
  <button
    onClick={closeToast}
    className="absolute top-2 right-2 p-1 rounded-full opacity-40 hover:opacity-100 hover:bg-black/8 transition-all cursor-pointer"
    aria-label="Close"
  >
    <X size={11} strokeWidth={2.5} />
  </button>
);

const ToastBody = ({
  title,
  message,
  icon: Icon,
  iconColor,
  iconBg,
}: ToastBodyProps) => (
  <div className="flex items-start gap-3 pr-5">
    <div
      className="rounded-full p-1.5 shrink-0 flex items-center justify-center"
      style={{ background: iconBg }}
    >
      <Icon size={16} color={iconColor} strokeWidth={2.5} />
    </div>
    <div>
      <p className="font-medium text-sm leading-snug">{title}</p>
      <p className="text-xs mt-0.5 opacity-75 leading-relaxed">{message}</p>
    </div>
  </div>
);

const baseOptions: ToastifyOptions = {
  closeButton: CloseButton,
  icon: false,
};

export default function showToast({ title, message, variant }: ToastOptions) {
  switch (variant) {
    case "success":
      toast.success(
        <ToastBody
          title={title}
          message={message}
          icon={CheckCircle}
          iconColor="#3B6D11"
          iconBg="rgba(99,153,34,0.12)"
        />,
        {
          ...baseOptions,
          className:
            "!bg-[#f4f9ee] !border !border-[#c0dd97] !text-[#27500a] !shadow-none !rounded-[14px] !p-[10px_12px]",
        },
      );
      break;

    case "warning":
      toast.warning(
        <ToastBody
          title={title}
          message={message}
          icon={AlertTriangle}
          iconColor="#854F0B"
          iconBg="rgba(186,117,23,0.12)"
        />,
        {
          ...baseOptions,
          className:
            "!bg-[#fdf6ea] !border !border-[#fac775] !text-[#412402] !shadow-none !rounded-[14px] !p-[10px_12px]",
        },
      );
      break;

    case "error":
      toast.error(
        <ToastBody
          title={title}
          message={message}
          icon={XCircle}
          iconColor="#A32D2D"
          iconBg="rgba(163,45,45,0.10)"
        />,
        {
          ...baseOptions,
          className:
            "!bg-[#fdf2f2] !border !border-[#f7c1c1] !text-[#501313] !shadow-none !rounded-[14px] !p-[10px_12px]",
        },
      );
      break;
  }
}
