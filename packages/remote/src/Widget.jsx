import { useValue as useNamedValue } from "shared-named";
import { useValue as useStarValue } from "shared-star";

// Both hooks read a context provided by the host. If the remote got the host's shared
// singleton, they return "provided by host"; with a local copy they return null.
export default function Widget() {
	const named = useNamedValue();
	const star = useStarValue();
	return (
		<ul>
			<li id="named">shared-named (export {"{ ... }"} from "./context.js"): {named ?? "null - remote used its own copy"}</li>
			<li id="star">shared-star (export * from "./context.js"): {star ?? "null - remote used its own copy"}</li>
		</ul>
	);
}
