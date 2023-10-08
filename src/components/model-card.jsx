
const ModelCard = ({ modelName }) => {
	return (
		<div className="border rounded-xl max-w-fit max-h-fit border-slate-300">
			<model-viewer
				src={modelName}
				alt={"Model"}
				ar ar-modes="webxr scene-viewer quick-look"
				camera-controls
				shadow-intensity="1.04"
				poster="shared-assets/models/NeilArmstrong.webp"
				>
			</model-viewer>
		</div>
	);
}
 
export default ModelCard;