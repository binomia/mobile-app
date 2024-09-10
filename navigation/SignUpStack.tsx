import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VStack, Image, Text } from 'native-base';
import colors from '@/colors';
import { logo } from '@/assets';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WelcomeScreen from '@/screens/WelcomeScreen';
import LoginComponent from '@/components/signup/login';
import RegisterComponent from '@/components/signup/register';

const SignUpStack: React.FC = () => {
    const navigation = useNavigation<any>();
    const Stack = createNativeStackNavigator<any>();

    const headerLeft = () => {
        return (
            <VStack >
                <Image w={"115px"} h={"30px"} source={logo} />
            </VStack>
        )
    }

    const headerRight = () => {

        return (
            <TouchableOpacity onPress={() => navigation.navigate("WelcomeScreen")}>
                <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
        )
    }

    const welcomeReaderRight = () => {

        return (
            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text fontSize={"16px"} fontWeight={"extrabold"} color={"mainGreen"}>Iniciar Sesión</Text>
            </TouchableOpacity>
        )
    }

    const headerStyles = {
        headerBackTitle: '',
        headerTitleStyle: { color: colors.white },
        headerStyle: {
            backgroundColor: colors.primaryBlack,
            headerShadowVisible: false
        }
    }


    return (
        <Stack.Navigator initialRouteName='WelcomeScreen' >
            <Stack.Screen name='WelcomeScreen' options={{ headerLeft, headerRight: welcomeReaderRight, title: '', ...headerStyles, headerShadowVisible: false }} component={WelcomeScreen} />
            <Stack.Screen name='LoginScreen' options={{ headerLeft, headerRight, title: '', ...headerStyles, headerShadowVisible: false }} component={LoginComponent} />
            <Stack.Screen name='RegisterScreen' options={{ headerLeft, headerRight, title: '', ...headerStyles, headerShadowVisible: false }} component={RegisterComponent} />
        </Stack.Navigator >
    )
}


export default SignUpStack

