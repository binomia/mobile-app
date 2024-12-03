import React, { useRef, useState } from 'react'
import colors from '@/colors'
import DefaultIcon from 'react-native-default-icon';
import Button from '@/components/global/Button';
import Entypo from '@expo/vector-icons/Entypo';
import moment from 'moment';
import PagerView from 'react-native-pager-view';
import * as Sharing from 'expo-sharing';
import { StyleSheet, Dimensions } from 'react-native'
import { Heading, Image, Text, VStack, HStack, Pressable, ZStack, FlatList } from 'native-base'
import { FORMAT_CURRENCY, GENERATE_RAMDOM_COLOR_BASE_ON_TEXT, getMapLocationImage, MAKE_FULL_NAME_SHORTEN } from '@/helpers'
import { scale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { TransactionApolloQueries } from '@/apollo/query/transactionQuery';
import { globalActions } from '@/redux/slices/globalSlice';
import { transactionActions } from '@/redux/slices/transactionSlice';
import { transactionStatus } from '@/mocks';
import { Ionicons } from '@expo/vector-icons';
import { cancelIcon, checked, pendingClock } from '@/assets';
import { z } from 'zod';
import { TransactionAuthSchema } from '@/auth/transactionAuth';


type Props = {
	title?: string
	goNext?: (_?: number) => void,
	showPayButton?: boolean
	iconImage?: any

}

const { height, width } = Dimensions.get('window')
const SingleSentTransaction: React.FC<Props> = ({ title = "Ver Detalles", iconImage, showPayButton = false, goNext = (_?: number) => { } }) => {
	const ref = useRef<PagerView>(null);
	const dispatch = useDispatch()
	const { transaction } = useSelector((state: any) => state.transactionReducer)
	const { account, user, location }: { account: any, user: any, location: z.infer<typeof TransactionAuthSchema.transactionLocation> } = useSelector((state: any) => state.globalReducer)
	const [openDetail, setOpenDetail] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false)
	const [isCancelled, setIsCancelled] = useState<boolean>(false)
	const [payRequestTransaction] = useMutation(TransactionApolloQueries.payRequestTransaction());
	const [refreshing, setRefreshing] = useState(false);


	const details = [
		{
			title: "Fecha",
			value: moment(Number(transaction?.createdAt)).format("lll")
		},
		{
			title: "Enviado a",
			value: transaction?.fullName
		},
		{
			title: "Monto",
			value: transaction?.amount
		}
	]

	const handleValue = (title: string, value: string) => {
		if (title === "Monto")
			return {
				title,
				value: FORMAT_CURRENCY(Number(value)),
				color: amountColor(transaction)
			}

		if (title === "Enviado a")
			return {
				title: transaction?.isFromMe ? title : "Enviado por",
				value,
				color: colors.white
			}

		return {
			title,
			value,
			color: colors.white
		}
	}

	const handleShare = async () => {
		const isAvailableAsync = await Sharing.isAvailableAsync()
		if (!isAvailableAsync) return

		await Sharing.shareAsync("http://test.com")
	}

	const formatTransaction = (transaction: any) => {
		const isFromMe = transaction?.from.user?.id === user.id

		const profileImageUrl = isFromMe ? transaction?.to.user?.profileImageUrl : transaction?.from.user?.profileImageUrl
		const fullName = isFromMe ? transaction?.to.user?.fullName : transaction?.from.user?.fullName
		const username = isFromMe ? transaction?.from.user?.username : transaction?.to.user?.username
		const showPayButton = transaction?.transactionType === "request" && !isFromMe && transaction?.status === "pending"
		const amountColor = (transaction?.transactionType === "request" && isFromMe) ? colors.mainGreen : colors.red

		return {
			isFromMe,
			amountColor,
			profileImageUrl: profileImageUrl || "",
			amount: transaction?.amount,
			showPayButton,
			fullName: fullName || "",
			username: username || ""
		}
	}

	const onPress = async (paymentApproved: boolean) => {
		if (transaction?.showPayButton) {
			try {
				setIsCancelLoading(!paymentApproved)
				setIsLoading(paymentApproved)

				const { data } = await payRequestTransaction({
					variables: {
						transactionId: transaction?.transactionId,
						paymentApproved
					}
				})

				await dispatch(transactionActions.setTransaction(Object.assign({}, transaction, { ...data.payRequestTransaction, ...formatTransaction(data.payRequestTransaction) })))
				await dispatch(globalActions.setAccount(Object.assign({}, account, { balance: Number(account.balance) - Number(transaction?.amount) })))

				setIsLoading(false)
				setIsCancelLoading(false)
				setIsCancelled(paymentApproved)
				goNext(paymentApproved ? 1 : 2)

			} catch (error) {
				setIsLoading(false)
				console.log({ payRequestTransaction: error });
			}

		} else
			ref.current?.setPage(1)
	}


	const amountColor = (transaction: any) => {
		if (transaction?.status === "cancelled")
			return colors.red

		if (transaction?.status === "pending")
			return colors.pureGray

		return colors.mainGreen
	}

	const StatuIcon = (status: string) => {
		switch (status) {
			case "pending":
				return <Image borderRadius={100} alt='logo-image' w={"100%"} h={"100%"} source={pendingClock} />
			case "cancelled":
				return <Image borderRadius={100} alt='logo-image' w={"100%"} h={"100%"} source={cancelIcon} />
			default:
				return <Image borderRadius={100} alt='logo-image' w={"100%"} h={"100%"} source={checked} />
		}
	}

	const transactionLocation = (location: z.infer<typeof TransactionAuthSchema.transactionLocation>) => {
		const neighbourhood = location?.neighbourhood ? location.neighbourhood : ""
		const town = location?.town ? location.town : ""
		const county = location.county ? location.county : ""

		return `${neighbourhood}${town ? ", " : ""}${town}${county ? ", " : ""}${county}`
	}

	return (
		<VStack h={"90%"} px={"20px"} justifyContent={"space-between"}>
			<VStack pt={"20px"}>
				<HStack w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
					<HStack>
						{transaction?.profileImageUrl ?
							<Image borderRadius={100} resizeMode='contain' alt='logo-image' w={scale(50)} h={scale(50)} source={{ uri: transaction?.profileImageUrl }} />
							:
							<DefaultIcon
								value={transaction?.fullName || ""}
								contentContainerStyle={[styles.contentContainerStyle, { width: scale(width / 4), height: scale(width / 4), backgroundColor: GENERATE_RAMDOM_COLOR_BASE_ON_TEXT(transaction?.fullName || "") }]}
								textStyle={styles.textStyle}
							/>
						}
						<VStack ml={"10px"} >
							<Heading textTransform={"capitalize"} fontSize={scale(20)} color={"white"}>{MAKE_FULL_NAME_SHORTEN(transaction?.fullName || "")}</Heading>
							<Text fontSize={scale(15)} color={colors.lightSkyGray}>{transaction?.username}</Text>
						</VStack>
					</HStack>
					<Pressable mb={"20px"} _pressed={{ opacity: 0.5 }} bg={colors.lightGray} onPress={handleShare} w={"40px"} h={"40px"} borderRadius={100} alignItems={"center"} justifyContent={"center"}>
						<Entypo name="share" size={20} color={colors.mainGreen} />
					</Pressable>
				</HStack>
				<VStack>
					<VStack mt={"20px"} alignItems={"center"}>
						<Heading textTransform={"capitalize"} fontSize={scale(38)} color={amountColor(transaction)}>{FORMAT_CURRENCY(transaction?.amount)}</Heading>
						<Text mb={"10px"} color={colors.lightSkyGray}>{moment(Number(transaction?.createdAt)).format("lll")}</Text>
						<VStack my={"20px"} textAlign={"center"} space={1} alignItems={"center"}>
							<ZStack w={"30px"} h={"30px"} borderRadius={100} justifyContent={"center"} alignItems={"center"} >
								<HStack w={"80%"} h={"80%"} bg={colors.mainGreen} borderRadius={100} />
								{StatuIcon(transaction?.status)}
							</ZStack>
							<VStack w={"80%"}>
								<Text textAlign={"center"} fontSize={scale(16)} color={colors.white}>{transactionStatus(transaction.status)}s</Text>
							</VStack>
						</VStack>

					</VStack>
				</VStack>
			</VStack>
			{showPayButton ?
				<VStack w={"100%"} borderRadius={15} alignItems={"center"}>
					<HStack w={"40px"} h={"40px"} bg={colors.lightGray} borderRadius={100} justifyContent={"center"} alignItems={"center"}>
						<Ionicons name="warning" size={22} color={colors.warning} />
					</HStack>
					<Text textAlign={"center"} w={"85%"} fontSize={scale(15)} color={colors.pureGray}>
						Responde solo a solicitudes de pago que conozcas con certeza para garantizar tu seguridad.
					</Text>
					<HStack w={"100%"} mt={"20px"} justifyContent={showPayButton ? "space-between" : "center"}>
						<Button onPress={() => onPress(false)} spin={isCancelLoading} w={"49%"} bg={colors.lightGray} color={colors.red} title={"Cancelar"} />
						<Button onPress={() => onPress(true)} spin={isLoading} w={showPayButton ? "49%" : "80%"} bg={colors.mainGreen} color={colors.white} title={title} />
					</HStack>
				</VStack>
				: transaction.showMap ?
					<VStack w={"100%"} justifyContent={"center"}>
						<HStack w={"85%"} mb={"5px"}>
							<Heading fontSize={scale(16)} textTransform={"capitalize"} color={"white"}>{transactionLocation(transaction.location ?? {}) || "Ubicación"}</Heading>
						</HStack>
						<Image
							alt='fine-location-image-alt'
							resizeMode="cover"
							w={"100%"}
							h={height / 3}
							source={{
								uri: getMapLocationImage({ latitude: transaction?.location?.latitude, longitude: transaction?.location?.longitude })
							}}
							style={{
								borderRadius: 10
							}}
						/>
					</VStack> :
					<VStack my={"20px"} textAlign={"center"} space={1} alignItems={"center"}>
						<HStack w={"40px"} h={"40px"} bg={colors.lightGray} borderRadius={100} justifyContent={"center"} alignItems={"center"}>
							<Ionicons name="help" size={22} color={colors.mainGreen} />
						</HStack>
						<Text textAlign={"center"} w={"85%"} fontSize={scale(15)} color={colors.pureGray}>
							Asegúrate de transferir dinero únicamente a personas de confianza, para poder garantizar tu seguridad.
						</Text>
					</VStack>
			}
		</VStack>
	)
}

export default SingleSentTransaction


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