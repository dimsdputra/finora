import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={undefined}
      className="toaster group shadow-none"
      style={
        {
            "--normal-bg": "rgba(var(--color-base-100))",
            "--normal-text": "rgba(var(--color-base-content))",
            "--normal-border": "rgba(var(--color-base-300))",
          fontFamily: "'Poppins', sans-serif",
          boxShadow: "none",
        } as React.CSSProperties
      }
      {...props}
      closeButton={true}
      toastOptions={{
        classNames: {
            closeButton: "!border-base-300 !text-base-content hover:!bg-base-200 hover:!text-base-content",
            description: "!text-base-content/70",
            actionButton: "!bg-base-100 !text-base-content hover:!bg-base-200 hover:!text-base-content",
        },
      }}
      position={props.position ?? "top-right"}
    />
  );
};

export { Toaster };
