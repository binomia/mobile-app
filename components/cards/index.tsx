import React, { useRef, useState } from 'react'
import colors from '@/colors'
import BottomSheet from '../global/BottomSheet'
import CardModification from './CardModification'
import AntDesign from '@expo/vector-icons/AntDesign';
import Button from '../global/Button'
import { VStack, Text, HStack, FlatList, Heading, Image, Pressable } from 'native-base'
import { scale } from 'react-native-size-matters'
import { Dimensions, SafeAreaView } from 'react-native'
import { globalActions } from '@/redux/slices/globalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { FlagsList } from 'aws-sdk/clients/guardduty'
import { CardType } from '@/types'
import { mastercardLogo, noCard, visaLogo } from '@/assets'
import PagerView from 'react-native-pager-view';
import { useMutation } from '@apollo/client';
import { CardApolloQueries } from '@/apollo/query/cardQuery';
import { CardAuthSchema } from '@/auth/cardAuth';
import CreateCard from './CreateCard';
import { accountActions } from '@/redux/slices/accountSlice';

type Props = {
    open?: boolean
    justSelecting?: boolean
    onCloseFinish?: () => void
}

const { height } = Dimensions.get('window')

const Cards: React.FC<Props> = ({ open = false, onCloseFinish = () => { }, justSelecting = false }) => {
    const ref = useRef<FlagsList>(null);
    const pagerRef = useRef<PagerView>(null);
    const dispatch = useDispatch()
    const [showCardModification, setShowCardModification] = useState<boolean>(false)
    const [showAddCard, setShowAddCard] = useState<boolean>(false)
    const { cards }: { cards: CardType[] } = useSelector((state: any) => state.accountReducer)
    const [createCard] = useMutation(CardApolloQueries.createCard())


    const onPressCard = async (card: any) => {
        await dispatch(accountActions.setCard(card))

        if (justSelecting) {
            onCloseFinish()
        } else {
            setShowCardModification(true)
        }
    }

    const handleOnClose = async () => {
        onCloseFinish()
        setShowCardModification(false)
        pagerRef.current?.setPage(0)
    }

    const renderCardLogo = (brand: string) => {
        switch (brand) {
            case "visa":
                return <Image alt='logo-image' resizeMode='contain' w={"50px"} h={"50px"} source={visaLogo} />

            case "mastercard":
                return <Image alt='logo-image' resizeMode='contain' w={"50px"} h={"50px"} source={mastercardLogo} />

            default:
                return null
        }
    }

    const onCreateCard = async (cardData: any) => {
        try {
            const validatedCardData = await CardAuthSchema.createCard.parseAsync(cardData)
            const { data } = await createCard({ variables: { data: validatedCardData } })

            await dispatch(accountActions.setCards([...cards, data.createCard]))
            setShowAddCard(false)

            setShowCardModification(false)
            pagerRef.current?.setPage(0)

        } catch (error) {
            console.log({
                onCreateCard: error
            });
            throw error
        }
    }

    return (
        <BottomSheet openTime={300} height={height * 0.9} onCloseFinish={handleOnClose} open={open}>
            <PagerView style={{ flex: 1 }} ref={pagerRef} initialPage={0}>
                <SafeAreaView style={{ flex: 1 }}>
                    <VStack variant={"body"} flex={1}>
                        <HStack justifyContent={"flex-end"}>
                            <Pressable _pressed={{ opacity: 0.5 }} bg={colors.lightGray} borderRadius={100} onPress={() => pagerRef.current?.setPage(1)}>
                                <AntDesign name="pluscircle" size={scale(25)} color="white" />
                            </Pressable>
                        </HStack>
                        <VStack flex={0.95}>
                            <HStack justifyContent={"space-between"} alignItems={"center"}>
                                <Heading fontSize={scale(24)} color={colors.white}>Tarjetas</Heading>
                            </HStack>
                            {cards.length > 0 ? (
                                <FlatList
                                    ref={ref}
                                    mt={"10px"}
                                    data={cards}
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={true}
                                    renderItem={({ item, index }) => (
                                        <Pressable onPress={() => onPressCard(item)} w={"100%"} key={`card-${index}-${item.last4Number}`} _pressed={{ opacity: 0.5 }} flexDirection={"row"} p={"15px"} borderRadius={10} bg={colors.lightGray} mt={"15px"} mr={"10px"} alignItems={"center"}>
                                            {renderCardLogo(item.brand)}
                                            <VStack ml={"10px"}>
                                                <Heading textTransform={"capitalize"} fontSize={scale(15)} color={colors.white}>{item.brand} {item.last4Number}</Heading>
                                                <Text textTransform={"capitalize"} fontSize={scale(15)} color={colors.pureGray}>{item.alias}</Text>
                                            </VStack>
                                        </Pressable>
                                    )}
                                />
                            ) : (
                                <VStack py={"40px"} w={"100%"} h={"100%"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Image alt='logo-image' resizeMode='contain' w={"100%"} source={noCard} />
                                    <Button w={"90%"} onPress={() => pagerRef.current?.setPage(1)} title="Añadir Tarjeta" bg={colors.mainGreen} />
                                </VStack>
                            )}

                        </VStack>
                        <CardModification onCloseFinish={() => setShowCardModification(false)} open={showCardModification} />
                    </VStack>
                </SafeAreaView>
                <CreateCard onPress={onCreateCard} onClose={() => pagerRef.current?.setPage(0)} />
            </PagerView>
        </BottomSheet>
    )
}

export default Cards