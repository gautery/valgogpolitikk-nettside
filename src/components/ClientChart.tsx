"use client";

import dynamic from "next/dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Chart = dynamic(() => import("./Chart"), { ssr: false }) as React.ComponentType<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ClientChart(props: any) {
  // MDX + RSC can't serialize array props. Accept data as JSON string too.
  let data = props.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      data = undefined;
    }
  }
  return <Chart {...props} data={data} />;
}
