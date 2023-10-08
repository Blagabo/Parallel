"use client";

import { useState } from "react";
import * as Near from "near-api-js"

export default function SessionComponent () {
	const [sessions, setSessions] = useState([]);
	const contractId = "dev-1696631306411-68713125914531";
	//const greeting = Near.view(contractId, "get_sessions", {});
	
	async function getSessions() {
		try {
			Near.view()
			const sessionss = await Near.view(contractId, "get_sessions", {});
			setSessions(sessionss);
			console.log(sessions)
		} catch (error) {
			console.error("Error al obtener las sesiones:", error);
			return [];
		}
	}
	
	return (
		<>
			<button onClick={getSessions}>Obtener todas las Sesiones</button>
			<div>
				{sessions.length > 0 && (
					<div>
						Todas las Sesiones:
						<ul>
							{sessions.map((session, index) => (
								<li key={index}>
									ID: {session.id}, Propietario: {session.owner}, Privado:{" "}
									{session.isPrivate}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</>
	);
}