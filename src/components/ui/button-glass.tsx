import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

export interface ButtonGlassProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  themeType?: "default" | "outline";
  logoLeft?: boolean;
  logoRight?: boolean;
  icon?: React.ReactNode;
}

const ButtonGlass = React.forwardRef<HTMLButtonElement, ButtonGlassProps>(
  (
    {
      className,
      children,
      asChild = false,
      themeType = "default",
      logoLeft = false,
      logoRight = false,
      icon,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot.Root : "button";

    // Self-contained Arrow Right Circle SVG matching Figma specs
    const defaultIcon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-6 text-white drop-shadow-[0px_0px_3px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover/glass:translate-x-0.5"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-80" />
        <path
          d="M12 8L16 12L12 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    const content = (
      <>
        {/* Render Icon on Left */}
        {logoLeft && (icon || defaultIcon)}

        {/* Button Content */}
        <span>{asChild && React.isValidElement(children) ? (children.props as any).children : children}</span>

        {/* Render Icon on Right (Default behavior for arrow CTA) */}
        {logoRight && !logoLeft && (icon || defaultIcon)}
      </>
    );

    const buttonClass = cn(
      "group/glass inline-flex h-[43px] items-center justify-center gap-[10px] rounded-[30px] px-[30px] py-[10px] text-[16px] font-normal leading-[1.5] text-white not-italic whitespace-nowrap transition-all duration-300 select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer text-shadow-[0px_1px_4px_rgba(0,0,0,0.27),0px_1px_4px_rgba(0,0,0,0.39)]",
      // Theme Default (Translucent Glass background)
      themeType === "default" &&
        "bg-[rgba(238,230,242,0.23)] border border-white/10 backdrop-blur-md hover:bg-[rgba(238,230,242,0.6)] hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] active:bg-[rgba(238,230,242,0.16)]",
      // Theme Outline
      themeType === "outline" &&
        "bg-transparent border border-[rgba(238,230,242,0.4)] backdrop-blur-sm hover:bg-[rgba(238,230,242,0.1)] hover:border-white hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] active:bg-[rgba(238,230,242,0.05)]",
      // Disabled/Inactive state
      disabled &&
        "opacity-50 pointer-events-none bg-[rgba(238,230,242,0.1)] border-white/5",
      className
    );

    if (asChild && React.isValidElement(children)) {
      return (
        <Comp
          ref={ref}
          className={buttonClass}
          {...props}
        >
          {React.cloneElement(children, {
            children: content,
          } as any)}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        disabled={disabled}
        className={buttonClass}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

ButtonGlass.displayName = "ButtonGlass";

export { ButtonGlass };
