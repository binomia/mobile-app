import { Linking, StyleSheet, } from 'react-native'
import React, { useContext } from 'react'
import { Image, VStack, Text, HStack, Divider, FlatList, Pressable, Heading } from 'native-base'
import colors from '@/colors'
import { scale } from 'react-native-size-matters'
import Feather from '@expo/vector-icons/Feather';
import { CAPITALIZE_WORDS } from '@/helpers'
import { SUPPORT_EMAIL, SUPPORT_PHONE_NUMBER } from '@/constants'
import { useSelector } from 'react-redux'
import { supportScreenData } from '@/mocks'
import Button from '@/components/global/Button'
import { SessionContext } from '@/contexts/sessionContext'

const SupportScreen: React.FC = () => {
    const { user } = useSelector((state: any) => state.globalReducer)
    const { onLogout } = useContext(SessionContext)



    const openEmail = async () => {
        try {
            const subject = `Soporte - ${CAPITALIZE_WORDS(user?.fullName)} `; // Subject of the email
            const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
            await Linking.openURL(url)

        } catch (error) {
            console.error(error);
        }
    };

    const openWhatsApp = async () => {
        try {
            const url = `whatsapp://send?phone=${SUPPORT_PHONE_NUMBER}`;
            await Linking.openURL(url)

        } catch (error) {
            console.error(error);
        }
    };

    const openPhone = async () => {
        try {
            const url = `tel:${SUPPORT_PHONE_NUMBER}`;
            await Linking.openURL(url)

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <VStack px={"20px"} variant={"body"} justifyContent={"space-between"} h={"100%"}>
            <VStack borderRadius={10} p={"5px"} w={"100%"} h={"auto"} mt={"50px"}>
                {supportScreenData({ openEmail, openPhone, openWhatsApp }).map((item, index) => (
                    <Pressable _pressed={{ opacity: 0.5 }} key={item.name + index + "support"} flexDirection={"row"} w={"100%"} h={scale(45)} justifyContent={"space-between"} alignItems={"center"} onPress={item.onPress}>
                        <HStack alignItems={"center"}>
                            <Image alt='logo-image' borderRadius={100} resizeMode='contain' w={scale(35)} h={scale(35)} source={item.icon} />
                            <Heading ml={"10px"} fontSize={scale(15)} textTransform={index === 1 ? "lowercase" : "capitalize"} color={colors.white}>{item.name}</Heading>
                        </HStack>
                        <HStack w={"35px"} h={"35px"} borderRadius={10} bg={colors.lightGray} justifyContent={"center"} alignItems={"center"}>
                            <Feather name="chevron-right" size={28} color="white" />
                        </HStack>
                    </Pressable>
                ))}
            </VStack>

        </VStack>
    )
}

export default SupportScreen


const styles = StyleSheet.create({
    contentContainerStyle: {
        width: 55,
        height: 55,
        borderRadius: 100
    },
    textStyle: {
        fontSize: 30,
        color: 'white',
        marginBottom: 2,
        textTransform: 'capitalize',
        fontWeight: 'bold',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
})