import { format } from "date-fns";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { CalendarIcon } from "@heroicons/react/24/outline";
import type { DateRange, DayPickerProps } from "react-day-picker";
import { Controller, type Control, type Path } from "react-hook-form";
import { Label } from "./Label";

function DatePicker(props: {
  mode: "single" | "range";
  selected: Date | DateRange | undefined;
  onSelect: (date: Date | DateRange | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!props.selected}
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
            onSelect={props.onSelect as (date: Date | undefined) => void}
          />
        ) : (
          <Calendar
            mode="range"
            selected={props.selected as DateRange | undefined}
            onSelect={props.onSelect as (date: DateRange | undefined) => void}
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
      {label && (
        <Label className="mb-3">
          {label}
        </Label>
      )}
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
