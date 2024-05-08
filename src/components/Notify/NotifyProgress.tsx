import {Signal, useSignalEffect} from "@preact/signals-react";
import React, {useRef} from "react";
import {toast} from "react-toastify";

/**
 *NotifyProgress
 * @param param0 name:string,signal:Signal(@preact/signals-react)
 * @returns Component
 */
const NotifyProgress = ({
  name,
  signal,
}: {
  name: string;
  signal: Signal<number | null>;
}) => {
  const toastId = useRef<any | null>(null);
  useSignalEffect(() => {
    if (signal.value === null || signal.value === 1) {
      if (toastId.current) toast.done(toastId.current);
      toastId.current = null;
    } else {
      if (toastId.current === null) {
        toastId.current = toast(name, {
          progress: signal.value,
          position: "bottom-right",
        });
      } else {
        toast.update(toastId.current, {
          render: `${name} Loading...${(signal.value * 100).toFixed(2)}%`,
          progress: signal.value,
        });
      }
    }
  });
  return <></>;
};

export default NotifyProgress;
