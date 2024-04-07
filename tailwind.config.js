/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"custom-gray": "#93aec1",
				"custom-green": "#9dbdba",
				"custom-yellow": "#f8b042",
				"custom-red": "#ec6a52",
				"custom-pink": "#f3b7ad",
			},
		},
	},
	plugins: [],
};
