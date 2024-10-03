import { LogBox, StyleSheet, StatusBar } from 'react-native';
import { useCallback } from 'react';
import { SessionContextProvider } from '@/contexts/sessionContext';
import { ApolloProvider } from '@apollo/client';
import { NativeBaseProvider, View } from "native-base";
import { theme } from '@/themes';
import { apolloClient } from '@/apollo';
import * as SplashScreen from 'expo-splash-screen';
import { Navigation } from '@/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { GlobalContextProvider } from './contexts/globalContext';
import { useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { Provider } from 'react-redux';
import { store } from '@/redux';


LogBox.ignoreAllLogs();
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
	const cameraPermission = useCameraPermission()
	const microphonePermission = useMicrophonePermission()

	const onLayoutRootView = useCallback(async () => {
		try {
			if (!cameraPermission.hasPermission) {
				await cameraPermission.requestPermission();
			};

			if (!microphonePermission.hasPermission) {
				await microphonePermission.requestPermission();
			};

		} catch (error) {
			console.log({ error });
		}

	}, []);

	return (
		<Provider store={store}>
			<ApolloProvider client={apolloClient}>
				<NativeBaseProvider theme={theme}>
					<SessionContextProvider>
						<GlobalContextProvider>
							<View onLayout={onLayoutRootView} style={styles.container}>
								<StatusBar barStyle="light-content" />
								<NavigationContainer>
									<Navigation />
								</NavigationContainer>
							</View>
						</GlobalContextProvider>
					</SessionContextProvider>
				</NativeBaseProvider>
			</ApolloProvider>
		</Provider>
	);
}


const styles = StyleSheet.create({
	container: {
		backgroundColor: "pink",
		flex: 1
	}
});

export default App