import { extendTheme, Input } from "native-base";
import colors from "../colors";


export const theme = extendTheme({
    colors: {
        lightGray: "#2C2C2C",
        mainGreen: "#1D9B48",
    },
    components: {
        VStack: {
            variants: {
                body: {
                    w: "100%",
                    h: "100%",
                    px: "15px",
                    bg: "#1E1E1E",
                    flex: 1
                }
            }
        },
        Input: {
            variants: {
                input: {
                    bg: "#2C2C2C",
                    keyboardAppearance: 'dark',
                    px: "20px",
                    h: "55px",
                    w: "100%",
                    m: "5px",
                    borderRadius: 10
                }
            }
        },
        Button: {
            variants: {
                button: {
                    bg: "mainGreen",
                    h: "55px",
                    borderRadius: 10
                }
            }
        }
    }
})