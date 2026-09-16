interface SelectOption {
  value: string | number;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?:
    | "text"
    | "password"
    | "number"
    | "date"
    | "textarea"
    | "select";
  value: string | number | undefined;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => void;
  required?: boolean;
  placeholder?: string;
  min?: string;
  step?: string;
  rows?: number;
  options?: SelectOption[];
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  min,
  step,
  rows = 3,
  options = [],
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
      </label>

      <br />

      {type === "textarea" && (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
        />
      )}

      {type === "select" && (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}

      {type !== "textarea" &&
        type !== "select" && (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            step={step}
            required={required}
          />
        )}
    </div>
  );
}

export default FormField;