import { InputProps } from "@/interfaces";

const Input = ({
    width,
    type,
    name,
    placeholder,
    autoComplete,
    value,
    onChange,
}: InputProps): JSX.Element => (
    <input
        className={`search-input truncate outline-none px-5 py-2 md:py-1 rounded-full bg-slate-800 text-base ring-2 focus:ring-4 focus:ring-sky-500 transition-all selection:bg-rose-700 selection:text-rose-300 font-bold ${width}`}
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
    />
);

export default Input;
