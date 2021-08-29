import { ThemeType } from "grommet";

const secondary = "#32a852";

const theme: ThemeType = {
	tab: {
		color: "red",
		hover: {
			color: "dark-3",
		},
		border: {
			hover: { color: "dark-3" },
			active: { color: secondary },
			color: "brand",
		},
	},
	global: {
		font: {
			family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
			size: "16px",
			height: "20px",
		},
		colors: {
			brand: "#ac83fb",
			secondary: secondary,
			"status-error": {
				light: "#ff4141",
			},
			"dark-3": "#bababa",
		},
		focus: {
			outline: { color: secondary },
			border: { color: secondary },
		},
	},
};

export default theme;
