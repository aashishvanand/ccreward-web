"use client";

/**
 * "Skip to main content" link, the first focusable element on every page.
 * Each page renders its own <main> (there's no shared id), so this moves focus to the first one.
 * Styled in globals.css (.skip-link) so it works outside the MUI theme provider.
 */
export default function SkipLink() {
  const handleClick = (event) => {
    const main = document.querySelector("main");
    if (!main) return;
    event.preventDefault();
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
    main.scrollIntoView();
  };

  return (
    <a href="#main" className="skip-link" onClick={handleClick}>
      Skip to main content
    </a>
  );
}
