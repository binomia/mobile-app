import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Stack, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import { theme } from '@/themes';
import { DATABASE_NAME } from '@/constants';
// import { SQLiteProvider } from "expo-sqlite/next";
import { Provider } from 'react-redux';
import { store } from '@/redux';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/apollo';
import { SessionContextProvider } from '@/contexts/sessionContext';
import { GlobalContextProvider } from '@/contexts/globalContext';
import { LogBox, View } from 'react-native';
import { useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { SocketContextProvider } from '@/contexts/socketContext';
import { TopUpContextProvider } from '@/contexts/topUpContext';
import { RouterContextProvider } from '@/contexts/RouterContext';
// import * as Network from "expo-network";
// import NetInfo from '@react-native-community/netinfo';


LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['In React 18']);
SplashScreen.preventAutoHideAsync();

export default () => {
	const cameraPermission = useCameraPermission()
	const microphonePermission = useMicrophonePermission()

	const [loaded] = useFonts({
		SpaceMono: require('../fonts/SpaceMono-Regular.ttf'),
	});


	const onLayoutRootView = useCallback(async () => {
		try {
			const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
			if (!cameraPermission.hasPermission) {
				await cameraPermission.requestPermission();
			};

			if (!microphonePermission.hasPermission) {
				await microphonePermission.requestPermission();
			};

			await delay(5000);
			await SplashScreen.hideAsync();

		} catch (error) {
			console.error({ error });
		}

	}, []);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);


	if (!loaded) {
		return null;
	}

	return (
		<NativeBaseProvider theme={theme}>
			<Provider store={store}>
				<ApolloProvider client={apolloClient}>
					<SessionContextProvider>
						<GlobalContextProvider>
							<SocketContextProvider>
								<TopUpContextProvider>
									<View onLayout={onLayoutRootView} style={{ flex: 1 }}>										
										<RouterContextProvider/>
									</View>
								</TopUpContextProvider>
							</SocketContextProvider>
						</GlobalContextProvider>
					</SessionContextProvider>
				</ApolloProvider>
			</Provider >
		</NativeBaseProvider>
	);
}
