import { useState, useEffect } from "react";
const useFetch = (url: any) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      fetch(url)
        .then((res) => res.json())
        .then((res) => setData(res))
        .catch((error) => {
          console.log("fetch error");
          console.log(error);
        });
    } catch (e) {
      console.log("error while calling ", url);
      console.log(e);
    }
  }, [url]);
  return [data];
};
export default useFetch;
