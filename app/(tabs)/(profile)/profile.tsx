import { StyleSheet, } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Heading, Image, VStack, Text, HStack, Divider, FlatList, Pressable, ZStack, Spinner, ScrollView } from 'native-base'
import DefaultIcon from 'react-native-default-icon'
import { useDispatch, useSelector } from 'react-redux'
import { GENERATE_RAMDOM_COLOR_BASE_ON_TEXT, MAKE_FULL_NAME_SHORTEN } from '@/helpers'
import colors from '@/colors'
import { scale } from 'react-native-size-matters'
import Feather from '@expo/vector-icons/Feather';
import Button from '@/components/global/Button'
import { SessionContext } from '@/contexts/sessionContext'
import { useNavigation } from '@react-navigation/native'
import Fontisto from '@expo/vector-icons/Fontisto';
import * as ImagePicker from 'expo-image-picker';
import { useCloudinary } from '@/hooks/useCloudinary'
import { useMutation } from '@apollo/client'
import { UserApolloQueries } from '@/apollo/query'
import { globalActions } from '@/redux/slices/globalSlice'
import { profileScreenData } from '@/mocks'
import ImageView from "react-native-image-viewing";
import { router } from 'expo-router'


const ProfileScreen: React.FC = () => {
	const dispatch = useDispatch()
	const { user } = useSelector((state: any) => state.globalReducer)
	const navigation = useNavigation<any>()
	const { uploadImage } = useCloudinary()
	const [profileImage, setProfileImage] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [updateUser] = useMutation(UserApolloQueries.updateUser())
	const [visible, setIsVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);


	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			setIsLoading(true)
			const url = await uploadImage(result.assets[0].uri)
			const updatedUser = await updateUser({
				variables: {
					data: {
						profileImageUrl: url
					}
				}
			})

			await dispatch(globalActions.setUser(updatedUser.data.updateUser))

			setProfileImage(url);
			setIsLoading(false)
		}
	};

	const onOpenPreviewImage = () => {
		setIsVisible(true);
		setPreviewImage(profileImage)
	};
	const onClosePreviewImage = () => {
		setIsVisible(false);
		setPreviewImage(null)
	};

	useEffect(() => {
		setProfileImage(user?.profileImageUrl || null)
	}, [])


	return (
		<ScrollView contentContainerStyle={{ height: "100%" }} bg={colors.darkGray}>
			<VStack px={"20px"} py={"20px"} justifyContent={"space-between"} h={"100%"}>
				<VStack>
					<VStack alignItems={"center"} >
						<ZStack w={scale(80)} h={scale(80)} borderRadius={100} justifyContent={"flex-end"} alignItems={"flex-end"}>
							{profileImage ?
								<Pressable w={scale(80)} h={scale(80)} borderRadius={100} onPress={() => onOpenPreviewImage()} _pressed={{ opacity: 0.5 }}>
									<Image borderRadius={100} resizeMode='contain' alt='logo-image' w={"100%"} h={"100%"} source={{ uri: profileImage }} />
								</Pressable>
								:
								<Pressable onPress={() => pickImage()} _pressed={{ opacity: 0.5 }}>
									<DefaultIcon
										value={user?.fullName}
										contentContainerStyle={[styles.contentContainerStyle, { width: scale(80), height: scale(80), backgroundColor: GENERATE_RAMDOM_COLOR_BASE_ON_TEXT(user?.fullName || "") }]}
										textStyle={styles.textStyle}
									/>
								</Pressable>

							}
							{isLoading ?
								<HStack pl={"10px"} pt={"10px"} justifyContent={"center"} alignItems={"center"} w={scale(90)} h={scale(90)}>
									<Spinner size={"lg"} color={colors.mainGreen} />
								</HStack>
								: null
							}
							<Pressable onPress={() => pickImage()} _pressed={{ opacity: 0.5 }} w={"30px"} h={"30px"} borderRadius={100} bg={"lightGray"} justifyContent={"center"} alignItems={"center"}>
								<Fontisto name="camera" size={14} color="white" />
							</Pressable>
						</ZStack>
						<VStack mt={"10px"} ml={"10px"} alignItems={"center"} justifyContent={"center"}>
							<Heading textTransform={"capitalize"} fontSize={scale(24)} color={"white"}>{MAKE_FULL_NAME_SHORTEN(user?.fullName || "")}</Heading>
							<Text fontSize={scale(18)} color={colors.lightSkyGray}>{user?.username}</Text>
						</VStack>
					</VStack>
					<VStack px={"10px"} borderRadius={10} w={"100%"} h={"auto"} mt={"20px"} bg={"lightGray"}>
						<FlatList
							data={profileScreenData}
							scrollEnabled={false}
							py={"5px"}
							keyExtractor={(_, index) => index.toString()}
							renderItem={({ item, index }) => (
								<Pressable _pressed={{ opacity: 0.5 }} w={"100%"} h={scale(45)} justifyContent={"center"} onPress={() => router.navigate(item.path)}>
									<HStack key={`personal${item.name}`} space={2} pl={"10px"} justifyContent={"space-between"} alignItems={"center"}>
										<HStack bg={"gray"} w={scale(35)} h={scale(35)} borderRadius={100} justifyContent={"center"} alignItems={"center"}>
											<Image alt='logo-image' resizeMode='contain' w={"18px"} h={"18px"} source={item.icon} />
										</HStack>
										<HStack width={"90%"} h={"100%"} borderRadius={10} px={"10px"} justifyContent={"space-between"} >
											<HStack width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
												<Text textTransform={"capitalize"} fontSize={scale(15)} color={colors.white}>{item.name}</Text>
												<Feather name="chevron-right" size={20} color="white" />
											</HStack>
										</HStack>
									</HStack>
									<HStack w={"100%"} justifyContent={"flex-end"}>
										{index !== 4 ? <Divider mt={"7px"} width={"80%"} h={"0.5px"} bg={colors.gray} /> : null}
									</HStack>
								</Pressable>
							)} />
					</VStack>
				</VStack>
			</VStack>
			{previewImage ?
				<ImageView
					images={[{ uri: previewImage }]}
					imageIndex={0}
					visible={visible}
					onRequestClose={onClosePreviewImage}
				/>
				: null
			}
		</ScrollView>
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
		fontSize: 50,
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