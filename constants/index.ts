import { Dimensions } from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export const TEXT_HEADING_FONT_SIZE = RFPercentage(4)
export const TEXT_PARAGRAPH_FONT_SIZE = RFPercentage(1.75)
export const INPUT_HEIGHT = SCREEN_HEIGHT < 670 ? RFPercentage(6) + 8 : RFPercentage(6)

console.log({INPUT_HEIGHT});
