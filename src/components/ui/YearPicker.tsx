import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { Button } from "./Button";
import cn from "classnames";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Controller, type Control, type Path } from "react-hook-form";
import { Label } from "./Label";

export type YearSelectionValue =
  | number
  | { from?: number; to?: number }
  | undefined;
export type YearPickerMode = "single" | "range";

export interface YearPickerProps {
  mode?: YearPickerMode;
  value?: YearSelectionValue;
  onChange: (year: YearSelectionValue) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const getYearsGrid = (centerYear: number) => {
  const start = centerYear - (centerYear % 12);
  return Array.from({ length: 12 }, (_, i) => start + i);
};

function YearCalendar({
  mode = "single",
  value,
  onChange,
  className,
  placeholder = "Select year",
  disabled = false,
}: YearPickerProps) {
  const [open, setOpen] = useState(false);
  const initialYear = (() => {
    if (typeof value === "number") return value;
    if (value && "from" in value && value.from) return value.from;
    return new Date().getFullYear();
  })();
  const [centerYear, setCenterYear] = useState(initialYear);

  const handleYearSelect = (year: number) => {
    if (mode === "single") {
      onChange(year);
      setOpen(false);
    } else if (mode === "range") {
      const current = value as { from?: number; to?: number } | undefined;
      let newRange: { from: number; to?: number };

      if (!current?.from || current.to) {
        newRange = { from: year };
      } else if (year < current.from) {
        newRange = { from: year, to: current.from };
      } else {
        newRange = { from: current.from, to: year };
        setOpen(false);
      }

      onChange(newRange);
    }
  };

  const displayValue = useMemo(() => {
    if (!value) return placeholder;

    if (mode === "range" && typeof value === "object") {
      const { from, to } = value;
      if (from && to) return `${from} - ${to}`;
      if (from) return `${from}`;
    }

    if (typeof value === "number") return `${value}`;

    return placeholder;
  }, [value, mode, placeholder]);

  const getButtonVariant = (
    year: number
  ): "accent" | "secondary" | "outline" => {
    if (mode === "single" && value === year) return "accent";
    if (mode === "range" && value && typeof value === "object") {
      const { from, to } = value;
      if (from && to && year >= from && year <= to) return "secondary";
      if (from && year === from) return "secondary";
      if (to && year === to) return "secondary";
    }
    return "outline";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[200px] justify-start text-left font-normal bg-base-100 border-[1px] hover:bg-base-100/70 min-h-9 !h-full",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{displayValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col p-2">
          {/* Navigation */}
          <div className="flex justify-between items-center p-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCenterYear((prev) => prev - 12)}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">{`${
              centerYear - (centerYear % 12)
            } - ${centerYear - (centerYear % 12) + 11}`}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCenterYear((prev) => prev + 12)}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Year Grid */}
          <div className="grid grid-cols-3 gap-1 text-center">
            {getYearsGrid(centerYear).map((year) => (
              <Button
                key={year}
                variant={getButtonVariant(year)}
                size="sm"
                className={cn("w-full h-10 border-none")}
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function YearPickerForm<T extends { [key: string]: any }>({
  mode = "single",
  name,
  control,
  className,
  label,
}: {
  mode?: YearPickerMode;
  name: Path<T>;
  control: Control<T, any, T>;
  className?: string;
  label?: string;
}) {
  return (
    <div className="relative w-auto" data-slot="wrapper">
      {label && (
        <Label className="mb-3">
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <YearCalendar
            mode={mode}
            value={field.value}
            onChange={field.onChange}
            className={className}
          />
        )}
      />
    </div>
  );
}

export { YearCalendar as YearPicker, YearPickerForm };
