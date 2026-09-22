"use client";

import Link from "next/link";
import { forwardRef } from "react";
import styles from "./Button.module.css";

const variants = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
};

const sizes = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export const Button = forwardRef(function Button(
  {
    as: As,
    href,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    children,
    type = "button",
    ...rest
  },
  ref
) {
  const classes = [
    styles.btn,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    loading ? styles.loading : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? <span className={styles.spinner} aria-hidden /> : null}
      <span className={styles.label}>{children}</span>
    </>
  );

  const external = typeof href === "string" && /^https?:\/\//i.test(href);

  if (href && !disabled && !loading) {
    if (external || As === "a") {
      return (
        <a ref={ref} href={href} className={classes} {...rest}>
          {content}
        </a>
      );
    }
    return (
      <Link ref={ref} href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const Comp = As || "button";
  return (
    <Comp
      ref={ref}
      type={Comp === "button" ? type : undefined}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </Comp>
  );
});
