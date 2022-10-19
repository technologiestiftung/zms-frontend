/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				brand: "#24b47e",
				brandLight: "#41c48f",
			},
		},
	},
	plugins: [],
};
