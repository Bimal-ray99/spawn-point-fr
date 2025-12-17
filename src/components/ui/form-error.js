import { AlertCircle } from "lucide-react";

export const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 border border-red-200">
      <AlertCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
