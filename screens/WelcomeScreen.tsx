import { SafeAreaView, Dimensions } from 'react-native'
import React from 'react'
import { Heading, Image, Text, VStack } from 'native-base'
import { welcome } from '@/assets'
import { Button } from '@/components'
import colors from '@/colors'
import { useNavigation } from '@react-navigation/native'

const { height } = Dimensions.get('window')
const WelcomeScreen: React.FC = () => {
	const navigation = useNavigation<any>()

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.darkGray }}>
			<VStack variant={"body"} justifyContent={"space-between"} alignItems={"center"}>
				<VStack h={"65%"} w={"100%"} justifyContent={"flex-end"} alignItems={"center"}>
					<Image resizeMode='contain' w={"100%"} h={height / 3} source={welcome} />
					<Heading size={"2xl"} color={"white"}>Hola, Bienvenido</Heading>
					<Text textAlign={"center"} w={"80%"} color={"white"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
				</VStack>
				<VStack px={"20px"} mt={"20px"} alignItems={"center"}>
					<Button mb="50px" title="Crear una Cuenta" onPress={() => navigation.navigate("RegisterScreen")} />
				</VStack>
			</VStack>
		</SafeAreaView>
	)
}

export default WelcomeScreen

