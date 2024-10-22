import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface FloatingLabelInputProps {
  label: string;
  value: string;
  placeholder?: string;
  isTextarea?: boolean;
  className?: string;
}

export const FloatingLabelInput = ({
  label,
  value,
  placeholder,
  isTextarea,
  className,
}: FloatingLabelInputProps) => {
  const InputComponent = isTextarea ? Textarea : Input;
  return (
    <div className="group relative">
      <label className="absolute left-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50">
        {label}
      </label>
      <InputComponent
        className={`${isTextarea ? "h-32" : "h-10"} ${className}`}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};
