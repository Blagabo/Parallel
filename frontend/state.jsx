import { proxy } from "valtio";

const state = proxy({
	isLoggedIn: true,
	file: 'motherboard.glb',
});

export default state;