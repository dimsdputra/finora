import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  format,
  getYear,
  isSameMonth,
  isSameYear,
  setMonth,
  setYear,
} from "date-fns";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "./Button";
import cn from "classnames";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Controller, type Control, type Path } from "react-hook-form";
import { Label } from "./Label";
import classNames from "classnames";

export type MonthSelectionValue = Date | DateRange | undefined; // Single date or range
export type MonthPickerMode = "single" | "range";

export interface MonthPickerProps {
  mode?: MonthPickerMode;
  value?: MonthSelectionValue;
  onChange: (monthDate: MonthSelectionValue | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultYear?: number;
  fixedYear?: boolean; // If true, the year cannot be changed
}

const getMonthRange = (year: number, month: number) => {
  // month: 1-based (1 = January, 5 = May)
  const from = new Date(year, month, 1, 0, 0, 0, 0);
  // Last day of month: set day=0 of next month
  const to = new Date(year, month, 0, 23, 59, 59, 999);
  return { from, to };
};

function MonthCalendar({
  mode = "single",
  value,
  onChange,
  className,
  placeholder = "Select month",
  disabled = false,
  defaultYear,
  fixedYear = false,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(
    value instanceof Date
      ? getYear(value)
      : value && typeof value === "object" && "from" in value && value.from
      ? getYear(value.from)
      : defaultYear ?? getYear(new Date())
  );

  const handleMonthSelect = (monthIndex: number) => {
    const { from, to } = getMonthRange(displayYear, monthIndex);

    if (mode === "single") {
      onChange(from);
      setOpen(false);
    } else if (mode === "range") {
      const current = value as DateRange | undefined;
      let newRange: DateRange;

      if (!current?.from || current.to) {
        newRange = { from, to: undefined };
      } else if (from < current.from) {
        const prevRange = getMonthRange(
          current.from.getFullYear(),
          current.from.getMonth()
        );
        newRange = { from, to: prevRange.to };
      } else {
        const prevRange = getMonthRange(
          current.from.getFullYear(),
          current.from.getMonth()
        );
        newRange = { from: prevRange.from, to };
        setOpen(false);
      }
      onChange(newRange);
    }
  };

  const displayValue = useMemo(() => {
    if (!value) return placeholder;

    if (mode === "range") {
      const val = value as DateRange;
      if (val.from && val.to)
        return `${format(val.from, "LLL y")} - ${format(val.to, "LLL y")}`;
      if (val.from) return format(val.from, "LLL y");
      return placeholder;
    }

    return format(value as Date, "MMMM y");
  }, [value, mode, placeholder]);

  const isMonthEqual = (a?: Date, b?: Date) =>
    !!a && !!b && isSameMonth(a, b) && isSameYear(a, b);

  const getButtonVariant = (
    monthDate: Date
  ): "accent" | "secondary" | "outline" => {
    if (mode === "single" && isMonthEqual(value as Date, monthDate))
      return "accent";
    if (mode === "range" && value && "from" in value && value.from) {
      const { from, to } = value;
      if (from && to && monthDate >= from && monthDate <= to)
        return "secondary";
      if (from && isMonthEqual(from, monthDate)) return "secondary";
      if (to && isMonthEqual(to, monthDate)) return "secondary";
    }
    return "outline";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-base-100 border-[1px] hover:bg-base-100/70 min-h-9 !h-full",
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
          {/* Year Navigation */}
          <div
            className={classNames(
              "flex items-center p-2",
              !fixedYear ? "justify-between" : "justify-center"
            )}
          >
            {!fixedYear && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisplayYear((prev) => prev - 1)}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            )}
            <span className="text-sm font-semibold">{displayYear}</span>
            {!fixedYear && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisplayYear((prev) => prev + 1)}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-1 text-center">
            {Array.from({ length: 12 }).map((_, i) => {
              const monthDate = setMonth(setYear(new Date(), displayYear), i);

              return (
                <Button
                  key={i}
                  variant={getButtonVariant(monthDate)}
                  size="sm"
                  className={cn("w-full h-10 border-none")}
                  onClick={() => handleMonthSelect(i)}
                >
                  {format(monthDate, "MMM")}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MonthPickerForm<T extends { [key: string]: any }>({
  mode = "single",
  label,
  name,
  control,
  className,
  fixedYear = false, // If true, the year cannot be changed
  defaultYear, // Default year to display if fixedYear
}: {
  mode?: "single" | "range";
  name: Path<T>;
  label?: string;
  control: Control<T, any, T>;
  className?: string;
  fixedYear?: boolean; // If true, the year cannot be changed
  defaultYear?: number; // Default year to display if fixedYear is true
}) {
  return (
    <div className="relative w-auto" data-slot="wrapper">
      {label && <Label className="mb-3">{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <MonthCalendar
              mode={mode}
              value={field.value}
              onChange={field.onChange}
              className={className}
              defaultYear={defaultYear}
              fixedYear={fixedYear}
            />
          );
        }}
      />
    </div>
  );
}

export { MonthCalendar as MonthPicker, MonthPickerForm };
