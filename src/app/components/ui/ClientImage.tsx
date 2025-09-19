// app/components/ui/ClientImage.tsx
"use client";

import React, { useEffect, useState } from "react";

type Props = {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback?: string;
  [key: string]: any;
};

export default function ClientImage({ src, alt = "", className = "", fallback = "/placeholder.svg", ...props }: Props) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallback);

  useEffect(() => {
    setCurrentSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        // when image fails, replace with fallback
        setCurrentSrc(fallback);
      }}
      {...props}
    />
  );
}
