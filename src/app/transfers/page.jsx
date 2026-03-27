"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TransfersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = window.location.search;
    router.replace(`/transfer-calculator${params}`);
  }, [router]);

  return null;
}
