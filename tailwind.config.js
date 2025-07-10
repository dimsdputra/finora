/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textColor: {
        "base-100": ({ opacityValue }) =>
          `rgba(var(--color-base-100), ${opacityValue ?? 1})`,
        "base-200": ({ opacityValue }) =>
          `rgba(var(--color-base-200)), ${opacityValue ?? 1})`,
        "base-300": ({ opacityValue }) =>
          `rgba(var(--color-base-300), ${opacityValue ?? 1})`,
        "base-content": ({ opacityValue }) =>
          `rgba(var(--color-base-content), ${opacityValue ?? 1})`,
        primary: ({ opacityValue }) =>
          `rgba(var(--color-primary), ${opacityValue ?? 1})`,
        "primary-content": ({ opacityValue }) =>
          `rgba(var(--color-primary-content), ${opacityValue ?? 1})`,
        secondary: ({ opacityValue }) =>
          `rgba(var(--color-secondary), ${opacityValue ?? 1})`,
        "secondary-content": ({ opacityValue }) =>
          `rgba(var(--color-secondary-content), ${opacityValue ?? 1})`,
        accent: ({ opacityValue }) =>
          `rgba(var(--color-accent), ${opacityValue ?? 1})`,
        "accent-content": ({ opacityValue }) =>
          `rgba(var(--color-accent-content), ${opacityValue ?? 1})`,
        neutral: ({ opacityValue }) =>
          `rgba(var(--color-neutral), ${opacityValue ?? 1})`,
        "neutral-content": ({ opacityValue }) =>
          `rgba(var(--color-neutral-content), ${opacityValue ?? 1})`,
        info: ({ opacityValue }) =>
          `rgba(var(--color-info), ${opacityValue ?? 1})`,
        "info-content": ({ opacityValue }) =>
          `rgba(var(--color-info-content), ${opacityValue ?? 1})`,
        success: ({ opacityValue }) =>
          `rgba(var(--color-success), ${opacityValue ?? 1})`,
        "success-content": ({ opacityValue }) =>
          `rgba(var(--color-success-content), ${opacityValue ?? 1})`,
        warning: ({ opacityValue }) =>
          `rgba(var(--color-warning), ${opacityValue ?? 1})`,
        "warning-content": ({ opacityValue }) =>
          `rgba(var(--color-warning-content), ${opacityValue ?? 1})`,
        error: ({ opacityValue }) =>
          `rgba(var(--color-error), ${opacityValue ?? 1})`,
        "error-content": ({ opacityValue }) =>
          `rgba(var(--color-error-content), ${opacityValue ?? 1})`,
      },
      backgroundColor: {
        "base-100": ({ opacityValue }) =>
          `rgba(var(--color-base-100), ${opacityValue ?? 1})`,
        "base-200": ({ opacityValue }) =>
          `rgba(var(--color-base-200), ${opacityValue ?? 1})`,
        "base-300": ({ opacityValue }) =>
          `rgba(var(--color-base-300), ${opacityValue ?? 1})`,
        "base-content": ({ opacityValue }) =>
          `rgba(var(--color-base-content), ${opacityValue ?? 1})`,
        primary: ({ opacityValue }) =>
          `rgba(var(--color-primary), ${opacityValue ?? 1})`,
        "primary-content": ({ opacityValue }) =>
          `rgba(var(--color-primary-content), ${opacityValue ?? 1})`,
        secondary: ({ opacityValue }) =>
          `rgba(var(--color-secondary), ${opacityValue ?? 1})`,
        "secondary-content": ({ opacityValue }) =>
          `rgba(var(--color-secondary-content), ${opacityValue ?? 1})`,
        accent: ({ opacityValue }) =>
          `rgba(var(--color-accent), ${opacityValue ?? 1})`,
        "accent-content": ({ opacityValue }) =>
          `rgba(var(--color-accent-content), ${opacityValue ?? 1})`,
        neutral: ({ opacityValue }) =>
          `rgba(var(--color-neutral), ${opacityValue ?? 1})`,
        "neutral-content": ({ opacityValue }) =>
          `rgba(var(--color-neutral-content), ${opacityValue ?? 1})`,
        info: ({ opacityValue }) =>
          `rgba(var(--color-info), ${opacityValue ?? 1})`,
        "info-content": ({ opacityValue }) =>
          `rgba(var(--color-info-content), ${opacityValue ?? 1})`,
        success: ({ opacityValue }) =>
          `rgba(var(--color-success), ${opacityValue ?? 1})`,
        "success-content": ({ opacityValue }) =>
          `rgba(var(--color-success-content), ${opacityValue ?? 1})`,
        warning: ({ opacityValue }) =>
          `rgba(var(--color-warning), ${opacityValue ?? 1})`,
        "warning-content": ({ opacityValue }) =>
          `rgba(var(--color-warning-content), ${opacityValue ?? 1})`,
        error: ({ opacityValue }) =>
          `rgba(var(--color-error), ${opacityValue ?? 1})`,
        "error-content": ({ opacityValue }) =>
          `rgba(var(--color-error-content), ${opacityValue ?? 1})`,
      },
      borderColor: {
        "base-100": ({ opacityValue }) =>
          `rgba(var(--color-base-100), ${opacityValue ?? 1})`,
        "base-300": ({ opacityValue }) =>
          `rgba(var(--color-base-300), ${opacityValue ?? 1})`,
        neutral: ({ opacityValue }) =>
          `rgba(var(--color-neutral), ${opacityValue ?? 1})`,
        "neutral-content": ({ opacityValue }) =>
          `rgba(var(--color-neutral-content), ${opacityValue ?? 1})`,
        "base-content": ({ opacityValue }) =>
          `rgba(var(--color-base-content), ${opacityValue ?? 1})`,
        secondary: ({ opacityValue }) =>
          `rgba(var(--color-secondary), ${opacityValue ?? 1})`,
        info: ({ opacityValue }) =>
          `rgba(var(--color-info), ${opacityValue ?? 1})`,
        success: ({ opacityValue }) =>
          `rgba(var(--color-success), ${opacityValue ?? 1})`,
        warning: ({ opacityValue }) =>
          `rgba(var(--color-warning), ${opacityValue ?? 1})`,
        error: ({ opacityValue }) =>
          `rgba(var(--color-error), ${opacityValue ?? 1})`,
      },
      ringColor: {
        "base-300": ({ opacityValue }) =>
          `rgba(var(--color-base-300), ${opacityValue ?? 1})`,
      },
      fill: {
        "accent-content": ({ opacityValue }) =>
          `rgba(var(--color-accent-content), ${opacityValue ?? 1})`,
        primary: ({ opacityValue }) =>
          `rgba(var(--color-primary), ${opacityValue ?? 1})`,
        accent: ({ opacityValue }) =>
          `rgba(var(--color-accent), ${opacityValue ?? 1})`,
        "base-content": ({ opacityValue }) =>
          `rgba(var(--color-base-content), ${opacityValue ?? 1})`,
        secondary: ({ opacityValue }) =>
          `rgba(var(--color-secondary), ${opacityValue ?? 1})`,
      },
      stroke: {
        "base-content": ({ opacityValue }) =>
          `rgba(var(--color-base-content), ${opacityValue ?? 1})`,
        primary: ({ opacityValue }) =>
          `rgba(var(--color-primary), ${opacityValue ?? 1})`,
        secondary: ({ opacityValue }) =>
          `rgba(var(--color-secondary), ${opacityValue ?? 1})`,
        accent: ({ opacityValue }) =>
          `rgba(var(--color-accent), ${opacityValue ?? 1})`,
        "accent-content": ({ opacityValue }) =>
          `rgba(var(--color-accent-content), ${opacityValue ?? 1})`,
        info: ({ opacityValue }) =>
          `rgba(var(--color-info), ${opacityValue ?? 1})`,
        success: ({ opacityValue }) =>
          `rgba(var(--color-success), ${opacityValue ?? 1})`,
        warning: ({ opacityValue }) =>
          `rgba(var(--color-warning), ${opacityValue ?? 1})`,
        error: ({ opacityValue }) =>
          `rgba(var(--color-error), ${opacityValue ?? 1})`,
      },
      screens: {
        xs: "480px", // Extra small screens
        sm: "640px", // Small screens
        md: "768px", // Medium screens
        lg: "1024px", // Large screens
        xl: "1280px", // Extra large screens
        "2xl": "1536px", // 2X large screens
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        "p, span, li, a, h1, h2, h3, h4, h5, h6": {
          fontSize: "0.75rem", // 12px
          lineHeight: "1.1rem", // 16px
          color: "rgba(var(--color-base-content), 1)",
        },
        // "@screen xl": {
        //   "p, span, li, a": {
        //     fontSize: "0.875rem", // 14px
        //     lineHeight: "1.25rem", // 20px
        //   },
        // },
      });
    },
  ],
};
