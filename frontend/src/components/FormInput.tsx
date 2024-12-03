import { EyeClosed, EyeOff, LucideIcon } from "lucide-react";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
  Icon?: LucideIcon;
  name?: string;
  showPassword?: boolean;
  setShowPassword?: Dispatch<SetStateAction<boolean>>;
  isPassword?: boolean;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  Icon,
  name,
  showPassword = false,
  setShowPassword,
  isPassword,
  required = false,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="size-5 text-base-content/40" />
          </div>
        )}

        <input
          type={type}
          name={name}
          className={`input input-bordered w-full ${Icon ? "pl-10" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
        />

        {isPassword && setShowPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="size-5 text-base-content/40 hover:text-base-content/60" />
            ) : (
              <EyeClosed className="size-5 text-base-content/40 hover:text-base-content/60" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
