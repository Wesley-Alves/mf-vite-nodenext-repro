import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ValueContext as NamedContext } from "shared-named";
import { ValueContext as StarContext } from "shared-star";

const Widget = lazy(() => import("remote/Widget"));

createRoot(document.getElementById("root")).render(
	<NamedContext.Provider value="provided by host">
		<StarContext.Provider value="provided by host">
			<Suspense fallback="loading remote...">
				<Widget />
			</Suspense>
		</StarContext.Provider>
	</NamedContext.Provider>,
);
