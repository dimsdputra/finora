import { format } from "date-fns";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { CalendarIcon } from "@heroicons/react/24/outline";
import type { DateRange, DayPickerProps } from "react-day-picker";
import { Controller, type Control, type Path } from "react-hook-form";
import { Label } from "./Label";
import { useState } from "react";

function DatePicker(props: {
  mode: "single" | "range";
  selected: Date | DateRange | undefined;
  onSelect: (date: Date | DateRange | undefined) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | DateRange | undefined) => {
    props.onSelect(date);
    // Close popover if a date is selected
    if (props.mode === "single" && date) {
      setOpen(false);
    }
    if (
      props.mode === "range" &&
      date &&
      (date as DateRange).from &&
      (date as DateRange).to &&
      (date as DateRange).from?.getTime() !== (date as DateRange).to?.getTime()
    ) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!props.selected}
          onClick={() => setOpen((prev) => !prev)}
          className="data-[empty=true]:text-base-content/80 !justify-start text-left font-normal bg-base-100 border-[1px] hover:bg-base-100/70 min-h-9 h-fit w-full"
        >
          <CalendarIcon />
          {props.mode === "single" ? (
            props.selected ? (
              format(props.selected as Date, "PPP")
            ) : (
              <span className="text-base-content/80">Pick a date</span>
            )
          ) : (props.selected as DateRange)?.from ||
            (props.selected as DateRange)?.to ? (
            `${
              (props.selected as DateRange).from
                ? format((props.selected as DateRange).from as Date, "PPP")
                : ""
            } - ${
              (props.selected as DateRange).to
                ? format((props.selected as DateRange).to as Date, "PPP")
                : ""
            }`
          ) : (
            <span className="text-base-content/80">Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {props.mode === "single" ? (
          <Calendar
            mode="single"
            selected={props.selected as Date | undefined}
            onSelect={handleSelect as (date: Date | undefined) => void}
          />
        ) : (
          <Calendar
            mode="range"
            selected={props.selected as DateRange | undefined}
            onSelect={handleSelect as (date: DateRange | undefined) => void}
            required={false}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function DatePickerForm<T extends { [key: string]: any }>({
  mode,
  name,
  control,
  label,
  ...props
}: {
  mode: "single" | "range";
  name: Path<T>;
  label?: string;
  control: Control<T, any, T>;
} & DayPickerProps) {
  return (
    <div className="relative w-auto" data-slot="wrapper">
      {label && <Label className="mb-3">{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <DatePicker
              {...props}
              mode={mode}
              selected={field.value}
              onSelect={field.onChange}
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

export { DatePicker, DatePickerForm };
