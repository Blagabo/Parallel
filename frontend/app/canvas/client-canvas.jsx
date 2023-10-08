
"use client";

import { useSnapshot } from "valtio";
import state from "../../state"
import CanvasMain from "./canvas-main";

const ClientCanvas = () => {
	const snap = useSnapshot(state);

	return <CanvasMain fileName={`/${snap.file}`} />;
}
 
export default ClientCanvas;