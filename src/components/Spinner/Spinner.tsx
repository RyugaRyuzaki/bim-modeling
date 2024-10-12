import React from "react";
import {signal} from "@preact/signals-react";
import {ReactComponent as OpenBim} from "@assets/openbim.svg";
import "./spinner.css";
import {useSignals} from "@preact/signals-react/runtime";

export const spinnerSignal = signal<boolean>(false);

const Spinner = () => {
  useSignals();
  return (
    <div
      className={`absolute h-full w-full top-0 left-0 z-5000 flex items-center bg-slate-400 ${
        spinnerSignal.value ? "visible" : "hidden"
      }`}
    >
      <div className="openbim-fading-circle">
        <div className="openbim-circle1 openbim-circle"></div>
        <div className="openbim-circle2 openbim-circle"></div>
        <div className="openbim-circle3 openbim-circle"></div>
        <div className="openbim-circle4 openbim-circle"></div>
        <div className="openbim-circle5 openbim-circle"></div>
        <div className="openbim-circle6 openbim-circle"></div>
        <div className="openbim-circle7 openbim-circle"></div>
        <div className="openbim-circle8 openbim-circle"></div>
        <div className="openbim-circle9 openbim-circle"></div>
        <div className="openbim-circle10 openbim-circle"></div>
        <div className="openbim-circle11 openbim-circle"></div>
        <div className="openbim-circle12 openbim-circle"></div>
        <div className="openbim-logo">
          <OpenBim />
        </div>
      </div>
    </div>
  );
};

export default Spinner;
