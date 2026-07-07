"use client";

import { trackMetaEvent } from "../../lib/meta";

export default function MetaTrackedLink({
  children,
  className,
  href,
  target,
  rel,
  eventName,
  eventPayload,
  ...props
}) {
  return (
    <a
      className={className}
      href={href}
      target={target}
      rel={rel}
      onClick={() => {
        if (eventName) {
          trackMetaEvent(eventName, eventPayload);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}
