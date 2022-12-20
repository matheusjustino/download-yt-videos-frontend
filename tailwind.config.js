/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		fontFamily: {
			primary: "Poppins",
		},
		container: {
			padding: {
				DEFAULT: "1rem",
				lg: "2rem",
			},
		},
	},
	plugins: [],
};
