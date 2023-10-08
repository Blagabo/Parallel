import Script from 'next/script'

const CanvasMain = ({ fileName }) => {
	console.log("file name: ", fileName)
	return (
		<div>
			<Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js"></Script>
			<div className="w-screen h-screen">
			<model-viewer
				style={{
					width: "100%",
				  height: "100%"
				}}
				src={fileName}
				alt={"Model"}
				ar ar-modes="webxr scene-viewer quick-look"
				camera-controls
				shadow-intensity="1.04"
				poster="shared-assets/models/NeilArmstrong.webp"
				>
			</model-viewer>
		</div>
		</div>
	);
}
 
export default CanvasMain;