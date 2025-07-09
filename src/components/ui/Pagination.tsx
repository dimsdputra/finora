import * as React from "react";
import { Button, buttonVariants } from "./Button";
import classNames from "classnames";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={classNames("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={classNames("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={classNames(
        "cursor-pointer",
        buttonVariants({
          variant: isActive ? "outline" : "transparent",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={classNames(
        "gap-1 px-2.5 sm:pl-2.5 border-none",
        props.isActive
          ? "cursor-pointer"
          : "cursor-not-allowed hover:bg-transparent !text-base-content/20",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon />
      <span
        className={classNames(
          "hidden sm:block",
          props.isActive ? "" : "!text-base-content/20"
        )}
      >
        Previous
      </span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={classNames(
        "gap-1 px-2.5 sm:pr-2.5 cursor-pointer border-none",
        props.isActive
          ? "cursor-pointer"
          : "cursor-not-allowed hover:bg-transparent !text-base-content/20",
        className
      )}
      {...props}
    >
      <span
        className={classNames(
          "hidden sm:block",
          props.isActive ? "" : "!text-base-content/20"
        )}
      >
        Next
      </span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={classNames(
        "flex size-9 items-center justify-center",
        className
      )}
      {...props}
    >
      <EllipsisHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
