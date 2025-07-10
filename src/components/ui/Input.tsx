import classNames from "classnames";
import * as React from "react";
import { Controller, type Control, type Path } from "react-hook-form";
import { Label } from "./Label";
import CurrencyInput from "react-currency-input-field";

const Input = <T extends { [key: string]: any }>({
  className,
  type,
  name,
  id = name,
  ...props
}: Omit<React.ComponentProps<"input">, "name" | "type"> & {
  name: Path<T>;
  label?: string;
  control?: Control<T, any, T>;
  icon?: React.ReactNode;
  isClearable?: boolean;
  type?: React.HTMLInputTypeAttribute | "currency" | undefined;
}) => {
  const baseStyle = classNames(
    "file:text-base-content placeholder:text-base-content/75 placeholder:text-xs selection:bg-primary-content selection:text-primary border-base-300 flex h-9 w-full min-w-0 rounded-md border bg-base-100 px-4 py-3 text-base-content shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-base-100 md:file:text-sm file:text-xs file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-xs lg:text-sm",
    "focus-visible:border-ring focus-visible:ring-base-300 focus-visible:ring-[1px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
  );

  return (
    <div className="relative w-auto" data-slot="wrapper">
      {props.label && (
        <Label className="mb-3">
          {props?.label}
          {props.required && <span className="text-error">*</span>}
        </Label>
      )}
      {props.control ? (
        <Controller
          name={name}
          control={props.control}
          render={({ field, fieldState }) => (
            <>
              <div className="relative w-full">
                {type !== "currency" ? (
                  <input
                    id={id}
                    type={type}
                    data-slot="input"
                    className={classNames(
                      "placeholder:text-xs !text-xs",
                      baseStyle,
                      className,
                      props.icon ? "pr-10" : ""
                    )}
                    {...props}
                    {...field}
                    value={field.value ?? ""}
                  />
                ) : (
                  <CurrencyInput
                    prefix={`${props?.prefix ?? ""} `}
                    data-number-to-fixed="4"
                    data-number-stepfactor="100"
                    placeholder={props.placeholder ?? "0.00"}
                    allowDecimals
                    decimalsLimit={4}
                    disableAbbreviations
                    className={classNames(
                      "placeholder:text-xs !text-xs",
                      baseStyle,
                      className,
                      props.icon ? "pr-10" : ""
                    )}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      e.preventDefault();
                      const { value = "" } = e.target;
                      const parsedValue = value.replace(/[^\d.]/gi, "");
                      field.onChange(parsedValue)
                    }}
                  />
                )}
                {props.icon && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer z-10">
                    {props.icon}
                  </span>
                )}
              </div>
              {fieldState.error && (
                <span className="text-error text-xs mt-1">
                  {fieldState.error.message ?? `${name} is required`}
                </span>
              )}
            </>
          )}
        />
      ) : (
        <input
          name={name}
          id={id}
          type={type}
          data-slot="input"
          className={classNames(baseStyle, className)}
          {...props}
        />
      )}
    </div>
  );
};

export { Input };
