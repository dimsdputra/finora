import classNames from "classnames";
import * as React from "react";
import { useForm, type Path } from "react-hook-form";
import { type UseQueryParamsReturn } from "../../hooks/useQueryParams";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./Pagination";
import { Button } from "./Button";
import { Input } from "./Input";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { SelectForm, type Option } from "./MultiSelect";
import { DatePickerForm } from "./DatePicker";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { MonthPickerForm } from "./MonthPicker";
import { YearPickerForm } from "./YearPicker";

function TableContainer({
  className,
  onScrollEnd,
  maxHeight = "max-h-[350px]",
  ...props
}: React.ComponentProps<"table"> & {
  onScrollEnd?: (e: boolean) => void;
  maxHeight?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atEnd =
      Math.abs(el.scrollTop + el.clientHeight - el.scrollHeight) < 2;
    if (atEnd && onScrollEnd) {
      onScrollEnd(true);
    }
  };

  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      className={classNames(
        "relative w-full overflow-x-auto rounded-xl border border-base-300 overflow-y-auto table-scrollbar",
        maxHeight
      )}
      onScroll={handleScroll}
    >
      <table
        data-slot="table"
        className={classNames("w-full caption-bottom text-xs", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={classNames(
        "sticky top-0 z-10 [&_tr]:border-b bg-base-300 text-base-content",
        className
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={classNames(
        "[&_tr:last-child]:border-0 bg-base-100/50",
        className
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={classNames(
        "bg-base-100/50 border-t font-medium [&>tr]:last:border-b-0 border-base-300",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={classNames(
        "data-[state=selected]:bg-base-100/50 border-b border-base-300 transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={classNames(
        "h-10 py-2 px-4 text-xs text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={classNames(
        "text-base-content text-xs py-2 px-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={classNames("text-base-content mt-4 text-xs", className)}
      {...props}
    />
  );
}

export type TableHeaderProps<T extends { [key in keyof T]: T[key] }> = {
  name?: string;
  sortable?: boolean;
  sortKey?: Path<T>;
  content?: React.ReactNode;
  className?: React.HTMLProps<HTMLTableCellElement>["className"];
};

export type FilterOptions<T extends { [key in keyof T]: T[key] }> = {
  label: string;
  name: Path<T>;
  type:
    | "select"
    | "multiSelect"
    | "date"
    | "dateInterval"
    | "year"
    | "yearInterval"
    | "month"
    | "monthInterval"
    | "text"
    | "number"
    | "checkbox";
  placeholder?: string;
  options?: Option[];
  // For Month Select
  fixedYear?: boolean; // If true, the year will not change when selecting a month
  defaultYear?: number; // Default year to display if fixedYear is true
};

export type TableProps<T extends { [key in keyof T]: T[key] }> = {
  searchField?: Path<T>[];
  filterOptions?: FilterOptions<T>[];
  onSearch?: (search: string) => void;
  className?: string;
  headers: TableHeaderProps<T>[];
  data: T[] | undefined;
  renderers: (((row: T, index: number) => React.ReactNode) | null)[];
  params?: UseQueryParamsReturn;
  refetch?: () => void;
  maxHeight?: string;
};

const FilterTable = <T extends { [key in keyof T]: T[key] }>(props: {
  filterOptions: FilterOptions<T>[];
  params?: UseQueryParamsReturn;
}) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<any>({
    defaultValues: props.params?.filters ?? {},
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-auto justify-start text-left font-normal bg-base-100 border-[1px] hover:bg-base-100/70"
        >
          <FunnelIcon className="w-4 h-4 text-base-content" />
          <p>Filter</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full border-base-300 min-w-[250px] sm:max-w-[350px]">
        <div className="w-full flex flex-col gap-2 p-2">
          <p className="font-semibold pb-2 border-b border-base-300 text-center mb-2">
            Filter
          </p>
          {props.filterOptions?.map((filter, index) => {
            switch (filter.type) {
              case "select":
                return (
                  <div key={index} className="w-auto">
                    <SelectForm<T>
                      name={filter.name}
                      control={form.control}
                      options={filter.options ?? []}
                      placeholder={filter.placeholder}
                      mode="single"
                      label={filter.label}
                    />
                  </div>
                );
              case "multiSelect":
                return (
                  <div key={index} className="w-auto">
                    <SelectForm
                      name={filter.name}
                      control={form.control}
                      options={filter.options ?? []}
                      placeholder={filter.placeholder}
                      mode="multiple"
                      label={filter.label}
                    />
                  </div>
                );
              case "date":
                return (
                  <div key={index} className="w-auto">
                    <DatePickerForm
                      name={filter.name}
                      control={form.control}
                      mode="single"
                      label={filter.label}
                    />
                  </div>
                );
              case "dateInterval":
                return (
                  <div key={index} className="w-auto">
                    <DatePickerForm
                      name={filter.name}
                      control={form.control}
                      mode="range"
                      label={filter.label}
                    />
                  </div>
                );
              case "month":
                return (
                  <div key={index} className="w-auto">
                    <MonthPickerForm
                      mode="single"
                      name={filter.name}
                      control={form.control}
                      label={filter.label}
                      fixedYear={filter.fixedYear}
                      defaultYear={filter.defaultYear}
                    />
                  </div>
                );
              case "monthInterval":
                return (
                  <div key={index} className="w-auto">
                    <MonthPickerForm
                      mode="range"
                      name={filter.name}
                      control={form.control}
                      label={filter.label}
                      fixedYear={filter.fixedYear}
                      defaultYear={filter.defaultYear}
                    />
                  </div>
                );
              case "year":
                return (
                  <div key={index} className="w-auto">
                    <YearPickerForm
                      name={filter.name}
                      control={form.control}
                      mode="single"
                      label={filter.label}
                    />
                  </div>
                );
              case "yearInterval":
                return (
                  <div key={index} className="w-auto">
                    <YearPickerForm
                      name={filter.name}
                      control={form.control}
                      mode="range"
                      label={filter.label}
                    />
                  </div>
                );
              case "text":
                return (
                  <div key={index} className="w-auto">
                    <Input
                      name={filter.name}
                      control={form.control}
                      placeholder={filter.placeholder}
                      label={filter.label}
                    />
                  </div>
                );
              case "number":
                return (
                  <div key={index} className="w-auto">
                    <Input
                      name={filter.name}
                      control={form.control}
                      type="number"
                      placeholder={filter.placeholder}
                      label={filter.label}
                    />
                  </div>
                );
              case "checkbox":
                return (
                  <div key={index} className="w-auto">
                    <Input
                      name={filter.name}
                      control={form.control}
                      type="checkbox"
                      label={filter.label}
                      placeholder={filter.placeholder}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
          <div className="border-t border-base-300 pt-4 mt-2 flex justify-end gap-2">
            <Button
              variant="error"
              className="w-fit"
              onClick={() => {
                form.reset();
                props.params?.setFilters?.({});
                setOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              variant="success"
              className="w-fit"
              onClick={() => {
                const values = form.getValues();
                props.params?.setFilters?.(values);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Table = <T extends { [key in keyof T]: T[key] }>(
  props: TableProps<T>
) => {
  const pageButtons = React.useMemo(() => {
    const currentPage = props.params?.pagination?.currentPage;
    const totalPage = props.params?.pagination?.totalPages;
    const onPageChange = props.params?.setPage;
    const pageDisplayLimit = 5;
    const minPage = Math.max(
      1,
      (currentPage ?? 1) - Math.floor(pageDisplayLimit / 2)
    );
    const maxPage = Math.min(totalPage ?? 1, minPage + pageDisplayLimit - 1);
    const buttonsArr: React.ReactNode[] = [];
    for (let i = minPage; i <= maxPage; i++) {
      buttonsArr.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={(currentPage ?? 1) === i}
            onClick={() => {
              onPageChange?.(i);
              console.log("test");
            }}
            key={i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return buttonsArr;
  }, [props.params]);

  return (
    <>
      <div
        className={classNames(
          "w-full flex justify-end items-center gap-2",
          !props.filterOptions && !props.searchField && !props.refetch
            ? "hidden"
            : ""
        )}
      >
        {props.filterOptions && (
          <FilterTable
            filterOptions={props.filterOptions}
            params={props.params}
          />
        )}
        {props.searchField && (
          <div className="relative w-auto">
            <Input
              name="search"
              onChange={(e) =>
                props.params?.setSearch({
                  field: props.searchField ?? [],
                  value: e.currentTarget?.value,
                })
              }
              value={props.params?.search?.value ?? ""}
              placeholder="search type or category"
              className={classNames(
                "w-auto text-xs",
                props.params?.search?.value ? "pr-10" : ""
              )}
            />
            {!!props.params?.search?.value && (
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer z-10"
                onClick={() =>
                  props.params?.setSearch({
                    field: props.searchField ?? [],
                    value: undefined,
                  })
                }
              >
                <XMarkIcon className="w-4 h-4 text-error" />
              </span>
            )}
          </div>
        )}
        {props.refetch && (
          <Button onClick={() => props.refetch?.()} variant={"outline"}>
            Refresh
          </Button>
        )}
      </div>
      <TableContainer maxHeight={props.maxHeight}>
        <TableHeader>
          <TableRow className="hover:bg-base-100/5">
            {props.headers.map((header, index) => (
              <TableHead key={index} className={classNames(header.className)}>
                {header.content ?? header.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data && props.data.length > 0 ? (
            props.data.map((row, index) => (
              <TableRow key={index} className="hover:bg-base-100/90">
                {props.renderers.map((renderer, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {renderer ? renderer(row, index) : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={props.headers.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableContainer>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => props.params?.setPage?.((prev) => prev - 1)}
              isActive={(props.params?.pagination?.currentPage ?? 1) > 1}
            />
          </PaginationItem>
          {pageButtons}
          <PaginationItem>
            <PaginationNext
              onClick={() => props.params?.setPage?.((prev) => prev + 1)}
              isActive={
                (props.params?.pagination?.currentPage ?? 1) <
                (props.params?.pagination?.totalPages ?? 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export {
  TableContainer,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Table,
};
