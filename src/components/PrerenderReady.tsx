import { useEffect } from "react";
import { useIsFetching } from "@tanstack/react-query";

export default function PrerenderReady() {
  const fetching = useIsFetching();

  useEffect(() => {
    if (fetching === 0) {
      document.documentElement.dataset.prerenderReady = "true";
    } else {
      delete document.documentElement.dataset.prerenderReady;
    }
    return () => delete document.documentElement.dataset.prerenderReady;
  }, [fetching]);

  return null;
}