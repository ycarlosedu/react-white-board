export const labelColors = {
  yellow: "#ffcc00",
  red: "#ff0000",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  transparent: "rgba(0, 0, 0, 0)",
}

export type LabelColors = keyof typeof labelColors;

export const getLabelColor = (color?: LabelColors) => labelColors[color || 'blue']
export const fontColors = {
  yellow: "#ffcc00",
  red: "#ff0000",
  blue: "#008cff",
  black: "#000",
}

export type FontColors = keyof typeof fontColors;

export const getFontColor = (color?: FontColors) => fontColors[color || 'black']
