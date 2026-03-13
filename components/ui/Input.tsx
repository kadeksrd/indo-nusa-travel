import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          } disabled:bg-gray-50 disabled:text-gray-400 ${className}`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
export default Input;
