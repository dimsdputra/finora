import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "./Badge";
import { Button } from "./Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./Command";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import classNames from "classnames";
import { useState } from "react";
import { Controller, type Control, type Path } from "react-hook-form";
import { Label } from "./Label";

export interface Option {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: Option[];
  selected: string[]; // Array of selected values
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
  className?: string;
  mode?: "single" | "multiple"; // Optional, default is "multiple"
}

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  mode = "multiple", // Default to multiple selection
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSelect = (value: string) => {
    // If the value is already selected, deselect it (set to undefined or empty string)
    if (selected?.[0] === value) {
      onChange([]); // or onChange("") if you prefer empty string
    } else {
      onChange([value]);
    }

    setOpen(false);
  };

  const handleMultiSelect = (value: string) => {
    const isSelected = selected.includes(value);
    let newSelected: string[];

    if (isSelected) {
      // This is the deselect logic
      newSelected = selected.filter((item) => item !== value);
    } else {
      // This is the select logic
      newSelected = [...selected, value];
    }
    onChange(newSelected);
  };

  const handleClearAll = () => {
    onChange([]);
    setOpen(false); // Close popover after clearing
  };

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="transparent"
          role="combobox"
          aria-expanded={open}
          className={classNames(
            "w-full justify-between border-base-300 rounded-md border !bg-base-100 !px-4 py-3 text-base-content shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-base-300 focus-visible:ring-[1px] min-h-9",
            selectedOptions.length > 0 ? "h-fit" : "h-9",
            className
          )}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-base-content/75">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <Badge key={option.value} variant="accent">
                  {option.label}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      mode === "multiple"
                        ? handleMultiSelect(option.value)
                        : handleSelect(option.value);
                    }}
                  >
                    <XMarkIcon className="ml-1 h-3 w-3 cursor-pointer text-error" />
                  </span>
                </Badge>
              ))}
            </div>
          )}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Search options..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label} // Value for keyboard navigation/search
                    onSelect={() =>
                      mode === "multiple"
                        ? handleMultiSelect(option.value)
                        : handleSelect(option.value)
                    }
                  >
                    {isSelected && <CheckIcon className="h-4 w-4" />}
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClearAll}
                    className="justify-center text-center"
                  >
                    Clear All
                    <XMarkIcon className="ml-2 h-4 w-4 " />
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export interface SelectFormProps<T extends { [key: string]: any }> {
  name: Path<T>;
  control: Control<T, any, T>;
  options: Option[];
  placeholder?: string;
  className?: string;
  mode?: "single" | "multiple"; // Optional, default is "multiple"
  label?: string;
}

function SelectForm<T extends { [key: string]: any }>({
  name,
  control,
  options,
  placeholder = "Select options...",
  className,
  label,
  mode = "single", // Default to multiple selection
}: SelectFormProps<T>) {
  return (
    <div className="relative w-auto" data-slot="wrapper">
      {label && <Label className="mb-3">{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <MultiSelect
              options={options}
              selected={field.value || []}
              onChange={field.onChange}
              placeholder={placeholder}
              className={className}
              mode={mode} // Pass the mode to MultiSelect
            />
            {fieldState.error && (
              <span className="text-error text-xs mt-1">
                {fieldState.error.message ?? `${name} is required`}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
}

export { MultiSelect, SelectForm };
