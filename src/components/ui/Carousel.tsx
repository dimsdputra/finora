import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import classNames from "classnames";
import { Button } from "./Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

const useCarousel = () => {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
};

const Carousel = ({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={classNames("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

const CarouselContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={classNames(
          "flex",
          orientation === "horizontal" ? "-ml-2" : "-mt-2 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
};

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={classNames(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-2" : "pt-2",
        className
      )}
      {...props}
    />
  );
});

const CarouselPrevious = ({
  className,
  variant = "transparent",
  size = "icon",
  clickprev,
  ...props
}: React.ComponentProps<typeof Button> & {
  clickprev?: (e: boolean) => void;
}) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={classNames(
        "absolute size-8 !rounded-full group !bg-base-300/50 hover:!bg-base-100",
        orientation === "horizontal"
          ? "top-1/2 left-2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        !canScrollPrev && !clickprev && "hidden",
        className
      )}
      disabled={!canScrollPrev}
      {...props}
      onClick={() => {
        scrollPrev();
        clickprev?.(canScrollPrev);
      }}
    >
      <ChevronLeftIcon
        className={classNames(
          "!transition-opacity duration-200",
          canScrollPrev && "opacity-30 group-hover:opacity-100"
        )}
      />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
};

const CarouselNext = ({
  className,
  variant = "transparent",
  size = "icon",
  clicknext,
  ...props
}: React.ComponentProps<typeof Button> & {
  clicknext?: (e: boolean) => void;
}) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={classNames(
        "absolute size-8 !rounded-full group !bg-base-300/50 hover:!bg-base-100",
        orientation === "horizontal"
          ? "top-1/2 right-2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        !canScrollNext && !clicknext && "hidden",
        className
      )}
      disabled={!canScrollNext}
      {...props}
      onClick={() => {
        scrollNext();
        clicknext?.(canScrollNext);
      }}
    >
      <ChevronRightIcon
        className={classNames(
          "!transition-opacity duration-200",
          canScrollNext && "opacity-30 group-hover:opacity-100"
        )}
      />
      <span className="sr-only">Next slide</span>
    </Button>
  );
};

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
