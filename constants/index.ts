import { Dimensions } from "react-native"
import { RFPercentage } from "react-native-responsive-fontsize";


export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export const TEXT_HEADING_FONT_SIZE = RFPercentage(4)
export const TEXT_PARAGRAPH_FONT_SIZE = RFPercentage(1.75)
export const INPUT_HEIGHT = SCREEN_HEIGHT < 670 ? RFPercentage(6) + 8 : RFPercentage(6)
export const TEXTAREA_HEIGHT = SCREEN_HEIGHT < 670 ? RFPercentage(15) + 8 : RFPercentage(15)
export const INPUT_CODE_HEIGHT = SCREEN_HEIGHT < 670 ? RFPercentage(7) : RFPercentage(6)

export const NOTIFICATION_SERVER_URL = "http://192.168.1.96:8000/"
export const AUTHENTICATION_SERVER_URL = "http://192.168.1.96:8080/"

export const AZURE_FACE_API_ENDPOINT = "https://devdinero.cognitiveservices.azure.com"
export const AZURE_FACE_API_KEY = "4449ba8bab7745b48eb18ebc0739a613"

export const NODEMAILER_EMAIL: string = "brayhandeaza@gmail.com";
export const NODEMAILER_PASSWORD: string = "eeuj ghvo cxfh irab";