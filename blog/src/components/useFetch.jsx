import { useEffect, useState } from "react";

export default function useFetch(url, dep) {
  let [data, setData] = useState(null);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((info) => {
        setData(info);
        setLoading(false);
      });
  }, [...dep, url]);
  return [data, loading];
}
