import { useContext, useRef, useState } from 'react';
import { VStack } from 'native-base';
import { SafeAreaView } from 'react-native';
import PagerView from 'react-native-pager-view';
import colors from '@/colors';
import CreateAccount from './CreateAccount';
import Address from './Address';
import VerifyCode from './VerifyCode';
import ScanFrontID from './ScanFrontID';
import ScanBackID from './ScanBackID';
import AccountCreated from './AccountCreated';
import FaceID from './FaceID';
import { GlobalContextType } from '@/types';
import { GlobalContext } from '@/contexts/globalContext';
import IDData from './IdData';


const RegisterComponent: React.FC = (): JSX.Element => {
    const ref = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState<number>(2);
    const { setShowCloseButton } = useContext<GlobalContextType>(GlobalContext);


    const nextPage = () => {
        ref.current?.setPage(currentPage + 1)

        if (currentPage === 5) {
            setShowCloseButton(false)
        }

        setCurrentPage(currentPage + 1)
    }

    function reRenderPage<T>(state?: T) {
        ref.current?.render()
        return state
    }

    const prevPage = () => {
        if (currentPage === 0) {
            ref.current?.setPage(1)
            setCurrentPage(1)
        } else
            ref.current?.setPage(currentPage - 1)
        setCurrentPage(currentPage - 1)
    }


    return (
        <SafeAreaView style={{ backgroundColor: colors.darkGray, flex: 1 }}>
            <VStack flex={1}>
                <PagerView scrollEnabled={false} ref={ref} style={{ flex: 1 }} initialPage={currentPage}>
                    <CreateAccount key={"0"} nextPage={nextPage} />
                    <Address key={"1"} nextPage={nextPage} prevPage={prevPage} />
                    <IDData key={"2"} nextPage={nextPage} prevPage={prevPage} />
                    <ScanFrontID key={"3"} nextPage={nextPage} prevPage={prevPage} />
                    <ScanBackID key={"4"} nextPage={nextPage} prevPage={prevPage} />
                    <FaceID key={"5"} nextPage={nextPage} prevPage={prevPage} reRenderPage={reRenderPage} />
                    <VerifyCode key={"6"} nextPage={nextPage} prevPage={prevPage} />
                    <AccountCreated key={"7"} />
                </PagerView>
            </VStack>
        </SafeAreaView>
    );
}


export default RegisterComponent
