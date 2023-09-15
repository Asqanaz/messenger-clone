'use client'
import ReactSelect from 'react-select'

export default function Select({ 
    disabled,
    label,
    options,
    onChange,
    value
}) {
  return (
    <div
        className="z-[100]"
    >
        <label htmlFor="" 
            className="block tex-sm font-medium leading-6 text-gray-900"
        >
            {label}
        </label>
        <div className="mt-2">
            <ReactSelect 
                isDisabled = {disabled}
                value = {value}
                onChange = {onChange}
                isMulti
                options = {options}
                menuPortalTarget={document.body}
                styles = {{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                    })
                }}
                classNames = {{
                    control: () => 'text-sm'
                }}
            />
        </div>
    </div>
  )
}
