import { StyleSheet, Dimensions, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { HStack, VStack, ZStack, Text, Heading } from 'native-base'
import colors from '@/colors'
import PagerView from 'react-native-pager-view';
import Button from '@/components/global/Button'
import BottomSheet from '@/components/global/BottomSheet'
import QRCodeStyled from 'react-native-qrcode-styled';
import { logo } from '@/assets'
import { useDispatch, useSelector } from 'react-redux'
import { scale } from 'react-native-size-matters'
import { MAKE_FULL_NAME_SHORTEN } from '@/helpers'
import { useLazyQuery } from '@apollo/client'
import { UserApolloQueries } from '@/apollo/query'
import SendTransactionScreen from '@/components/transaction/SendTransaction'
import { transactionActions } from '@/redux/slices/transactionSlice'
import { CameraView } from 'expo-camera';


type Props = {
    open?: boolean
    onCloseFinish?: () => void
    defaultPage?: number
}


const { height, width } = Dimensions.get('window')
const QRScannerScreen: React.FC<Props> = ({ open, onCloseFinish, defaultPage = 0 }: Props) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state: any) => state.globalReducer)
    const [searchSingleUser] = useLazyQuery(UserApolloQueries.searchSingleUser())

    const pageFef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState<number>(defaultPage);
    const [showSendTransaction, setShowSendTransaction] = useState<boolean>(false);
    const [isScanning, setIsScanning] = useState(false);



    const onCloseFinished = () => {
        if (onCloseFinish)
            onCloseFinish()

        setIsScanning(false);
    }

    const onBarcodeScanned = async ({ data }: { data: string }) => {
        if (isScanning) return;
        setIsScanning(true);
        console.log(data);

        if (data === user.username) {
            Alert.alert("Advertencia", "No puedes enviarte dinero a ti mismo", [{
                onPress: () => setIsScanning(false)
            }]);

        } else {
            const singleUser = await searchSingleUser({
                variables: {
                    search: {
                        username: data
                    }
                }
            });

            if (singleUser.data.searchSingleUser) {
                await dispatch(transactionActions.setReceiver(singleUser.data.searchSingleUser));

                onCloseFinished();
                setShowSendTransaction(true);


                console.log(singleUser.data.searchSingleUser);

            } else {
                Alert.alert("Usuario no encontrado", "El usuario no se encuentra registrado en la plataforma", [{
                    onPress: () => setIsScanning(false)
                }]);
            }
        }
    }

    return (
        <VStack flex={1}>
            {!showSendTransaction ? (
                <BottomSheet showDragIcon={false} height={height * 0.90} open={open} onCloseFinish={onCloseFinished}>
                    <PagerView scrollEnabled={false} style={{ flex: 1 }} initialPage={currentPage} ref={pageFef}>
                        <VStack key={"QRScannerScreen-1"} flex={1}>
                            <VStack space={2} w={"100%"} h={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                                <VStack alignItems={"center"} pt={"30px"}>
                                    <HStack w={width * 0.9} h={width * 0.9} alignItems={"center"} borderWidth={0} borderColor={colors.gray} justifyContent={"center"} borderRadius={"20px"} bg={colors.lightGray} >
                                        <QRCodeStyled
                                            color={"#535353"}
                                            data={user?.username}
                                            pieceLiquidRadius={0}
                                            pieceStrokeWidth={0.5}
                                            pieceStroke={colors.darkGray}
                                            logo={{
                                                href: logo
                                            }}
                                            padding={20}
                                            aria-hidden
                                            style={{
                                                backgroundColor: "transparent"
                                            }}
                                            outerEyesOptions={{ borderRadius: 30 }}
                                            innerEyesOptions={{ borderRadius: 20, color: colors.mainGreen }}
                                            pieceSize={width / 27}
                                            pieceBorderRadius={5}
                                        />
                                    </HStack>
                                    <VStack alignItems={"center"} borderRadius={"10px"} mt={"10px"} py={"7px"} px={"15px"} bg={colors.darkGray} >
                                        <Heading textTransform={"capitalize"} fontSize={scale(28)} color={colors.white}>{MAKE_FULL_NAME_SHORTEN(user?.fullName || "")}</Heading>
                                        <Text textTransform={"lowercase"} fontSize={scale(15)} color={colors.lightSkyGray}>{user?.username}</Text>
                                    </VStack>
                                </VStack>
                                <HStack w={width * 0.85}>
                                    <HStack h={55} borderRadius={"25px"} bg={"rgba(0,0,0,0.5)"} p={"3px"} w={"100%"} justifyContent={"space-between"}>
                                        <Button
                                            bg={currentPage === 0 ? "mainGreen" : null}
                                            disabled={currentPage === 0}
                                            w={"49%"}
                                            h={"100%"}
                                            onPress={() => {
                                                pageFef.current?.setPageWithoutAnimation(0)
                                                setCurrentPage(0)
                                            }}
                                            title="Mi Codigo"
                                        />
                                        <Button
                                            w={"49%"}
                                            h={"100%"}
                                            bg={currentPage === 1 ? "mainGreen" : null}
                                            onPress={() => {
                                                pageFef.current?.setPageWithoutAnimation(1)
                                                setCurrentPage(1)
                                            }}
                                            title="Escanear"
                                        />
                                    </HStack>
                                </HStack>
                            </VStack>
                        </VStack>
                        <ZStack key={"QRScannerScreen-2"} flex={1}>
                            <CameraView
                                style={StyleSheet.absoluteFillObject}
                                onBarcodeScanned={onBarcodeScanned}
                                barcodeScannerSettings={{
                                    barcodeTypes: ["qr"],
                                }}
                            />
                            <VStack space={2} w={"100%"} h={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                                <VStack alignItems={"center"} pt={"30px"}>
                                    <HStack w={width * 0.85} h={width * 0.85} alignItems={"center"} justifyContent={"center"} borderRadius={"25px"} borderWidth={3} borderColor={colors.white} />
                                    <HStack borderRadius={"10px"} mt={"10px"} py={"7px"} px={"15px"} bg={colors.darkGray} >
                                        <Text color={colors.white}>{"Escanea el Codigo QR"}</Text>
                                    </HStack>
                                </VStack>
                                <HStack w={width * 0.85}>
                                    <HStack p={"3px"} h={55} borderRadius={50} bg={"rgba(0,0,0,0.5)"} w={"100%"} justifyContent={"space-between"}>
                                        <Button
                                            bg={currentPage === 0 ? "mainGreen" : "rgba(0,0,0,0.5)"}
                                            disabled={currentPage === 0}
                                            w={"49%"}
                                            h={"100%"}
                                            onPress={() => {
                                                pageFef.current?.setPageWithoutAnimation(0)
                                                setCurrentPage(0)
                                            }}
                                            title="Mi Codigo"
                                        />
                                        <Button
                                            bg={currentPage === 1 ? "mainGreen" : null}
                                            disabled={currentPage === 1}
                                            w={"49%"}
                                            h={"100%"}
                                            onPress={() => {
                                                pageFef.current?.setPageWithoutAnimation(1)
                                                setCurrentPage(1)
                                            }}
                                            title="Escanear"
                                        />
                                    </HStack>
                                </HStack>
                            </VStack>
                        </ZStack>
                    </PagerView>
                </BottomSheet>
            ) : (
                <SendTransactionScreen open={true} onCloseFinish={() => setShowSendTransaction(false)} />
            )}
        </VStack>
    )
}


export default QRScannerScreen