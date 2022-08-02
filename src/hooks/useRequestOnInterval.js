import { useEffect, useState } from "react";

export default function useRequestOnInterval(url, interval = 10000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data = await res.json();

        setData(data);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          console.warn("the fetch was aborted");
        } else {
          setError("Could not fetch the data");
        }
      }
    };

    const intervalID = setInterval(fetchData, interval);

    return () => {
      clearInterval(intervalID);
      controller.abort();
    };
  }, [interval, url]);

  return { data, error };
}
