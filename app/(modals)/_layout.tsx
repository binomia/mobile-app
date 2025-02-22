import 'react-native-reanimated';
import { Stack } from 'expo-router';
import colors from '@/colors';
import { BackHeaderIcon, CardsRight, HomeHeaderRight } from '@/components/navigation/HeaderBar';
import { Image } from 'native-base';
import { logo } from '@/assets';
import { AntDesign, Ionicons } from '@expo/vector-icons';



export default () => {
	const defaultHeaderStyles = {
		backgroundColor: colors.darkGray,
		shadowOpacity: 0,
		paddingLeft: 0
	}
	const defaultTabStyles = {
		backgroundColor: colors.darkGray,
		borderTopWidth: 0,
		elevation: 0,
	}

	const defaultscreenOptions = {
		headerBackTitleVisible: false,
		headerTintColor: colors.white,
		headerStyle: { ...defaultHeaderStyles },
		tabBarStyle: { ...defaultTabStyles }

	}
	return (
		<Stack screenOptions={{ ...defaultscreenOptions }}>
			<Stack.Screen name="deposit" options={{ headerShown: false }} />
			<Stack.Screen name='flagged' options={{ headerShown: false}} />
			<Stack.Screen name='recurrences' options={{ headerShown: false }} />
			<Stack.Screen name='cards' options={{ headerShown: false, presentation: "formSheet" }} />
			<Stack.Screen name='transaction' options={{ headerShown: false, presentation: "formSheet" }} />
		</Stack>
	);
}
