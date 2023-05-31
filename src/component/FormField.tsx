import React from 'react'
import { useField } from 'formik'

export type FormFieldProps = {
    label?: string,
    name: string,
    type?: string,
    placeholder?: string,
    required: boolean,
    value: string,
    onChange?: (event: any) => void
    className?: string,
}
export const FormField = ({ label, name, type, placeholder, required, value, onChange}: FormFieldProps) => {
    const [field, meta] = useField(name)

    return (
        <label>
            {label}
            <input
                {...field}
                name={name}
                placeholder={placeholder}
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                className={meta.touched && meta.error ? 'error' : ''}
            />
            {meta.touched && meta.error && (
                <div className="error-message">{meta.error}</div>
            )}
        </label>
    );
};
