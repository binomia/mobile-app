import { StyleSheet, } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Heading, Image, VStack, Text, HStack, Divider, FlatList, Pressable } from 'native-base'
import { limitIcon, logo, notificacionIcon, privacyIcon, soportIcon, userIcon } from '@/assets'
import DefaultIcon from 'react-native-default-icon'
import { useSelector } from 'react-redux'
import { GENERATE_RAMDOM_COLOR_BASE_ON_TEXT, MAKE_FULL_NAME_SHORTEN } from '@/helpers'
import colors from '@/colors'
import { scale } from 'react-native-size-matters'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import Button from '@/components/global/Button'
import { SessionContext } from '@/contexts/sessionContext'


const ProfileScreen: React.FC = () => {
    const { user } = useSelector((state: any) => state.globalReducer)
    const { onLogout } = useContext(SessionContext)

    const data = [
        {
            name: "Personal",
            icon: userIcon,
        },
        {
            name: "Privacidad & Seguridad",
            icon: privacyIcon,
        },
        {
            name: "Limites",
            icon: limitIcon,
        },
        {
            name: "Notificaciones",
            icon: notificacionIcon,
        },
        {
            name: "Soporte",
            icon: soportIcon,
        },
    ]

    useEffect(() => {
        console.log(user);
    }, [])

    return (
        <VStack px={"20px"} variant={"body"} justifyContent={"space-between"} h={"100%"}>
            <VStack>
                <VStack mt={"30px"} alignItems={"center"} >
                    {user.profileImageUrl ?
                        <Image borderRadius={100} resizeMode='contain' alt='logo-image' w={scale(15)} h={scale(15)} source={{ uri: user.profileImageUrl }} />
                        :
                        <DefaultIcon
                            value={user?.fullName}
                            contentContainerStyle={[styles.contentContainerStyle, { width: scale(85), height: scale(85), backgroundColor: GENERATE_RAMDOM_COLOR_BASE_ON_TEXT(user?.fullName || "") }]}
                            textStyle={styles.textStyle}
                        />
                    }
                    <VStack mt={"10px"} ml={"10px"} alignItems={"center"} justifyContent={"center"}>
                        <Heading textTransform={"capitalize"} fontSize={scale(28)} color={"white"}>{MAKE_FULL_NAME_SHORTEN(user?.fullName || "")}</Heading>
                        <Text fontSize={scale(18)} color={colors.lightSkyGray}>{user?.username}</Text>
                    </VStack>
                </VStack>
                <VStack px={"10px"} borderRadius={10} w={"100%"} h={"auto"} mt={"50px"} bg={"lightGray"}>
                    <FlatList
                        data={data}
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <Pressable _pressed={{ opacity: 0.5 }} onPress={() => { }}>
                                <HStack key={`personal${item.name}`} space={2} pl={"10px"} py={"8px"} alignItems={"center"}>
                                    <HStack bg={"gray"} w={"35px"} h={"35px"} borderRadius={100} justifyContent={"center"} alignItems={"center"}>
                                        <Image alt='logo-image' resizeMode='contain' w={"18px"} h={"18px"} source={item.icon} />
                                    </HStack>
                                    <VStack width={"90%"} h={"30px"} borderRadius={10}>
                                        <HStack pr={"10px"} justifyContent={"space-between"} alignItems={"center"}>
                                            <Text fontWeight={"semibold"} fontSize={scale(15)} color={colors.white}>{item.name}</Text>
                                            <Feather name="chevron-right" size={24} color="white" />
                                        </HStack>
                                        <Divider mt={index !== 4 ? "10px" : "0px"} width={"100%"} h={"0.5px"} bg={index !== 4 ? colors.gray : colors.lightGray} />
                                    </VStack>
                                </HStack>
                            </Pressable>
                        )} />
                </VStack>
            </VStack>
            <HStack mb={"30px"} justifyContent={"center"}>
                <Button bg={"lightGray"} color='red' title='Cerrar Sesion' onPress={onLogout} w={'80%'} />
            </HStack>
        </VStack>
    )
}

export default ProfileScreen


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