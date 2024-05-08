import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<>
		{import.meta.env.PROD ? (
			<React.StrictMode>
				<App />
			</React.StrictMode>
		) : (
			<App />
		)}
	</>
);
