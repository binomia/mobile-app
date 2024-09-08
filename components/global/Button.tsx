import React from 'react'
import { Text, StyledProps, Pressable } from 'native-base';


interface Props extends StyledProps {
    title: string
    color?: string
    disabled?: boolean
    onPress?: () => void
}

const Button: React.FC<Props> = (props): JSX.Element => {
    const { width, color = "white", title, onPress = () => { }, disabled = false } = props

    return (
        <Pressable _pressed={{ opacity: 0.5 }} {...props} borderRadius={"25px"} alignItems={"center"} justifyContent={"center"} h="55px" disabled={disabled} onPress={onPress}>
            <Text width={"100%"} fontWeight={"bold"} fontSize={"16px"} textAlign={"center"} color={color}>{title}</Text>
        </Pressable>
    )
}


export default Button