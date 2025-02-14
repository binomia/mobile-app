import { MAIN_SERVER_URL } from '@/constants';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { ApolloClient, from, createHttpLink, InMemoryCache, DefaultOptions } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { Alert } from 'react-native';




const httpLink = createHttpLink({
    uri: MAIN_SERVER_URL,
    credentials: "include",
    preserveHeaderCase: true,
});


const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(async (error) => {
            const { message } = error;

            console.log("error", message);


            if (message.includes("INVALID_SESSION")) {
                // await SecureStore.deleteItemAsync("jwt").then(async () => {
                //     Alert.alert("Your session has expired. Please login again.");
                //     await Updates.reloadAsync();
                // });
            } else if (message.includes("no puede recibir pagos")) {
                Alert.alert(message);
            }
        });
});



const setAuthorizationLink = setContext(async (_, previousContext) => {
    const jwt = await useAsyncStorage().getItem("jwt");
    const applicationId = await useAsyncStorage().getItem("applicationId");
    return {
        headers: {
            "session-auth-identifier": applicationId,
            "authorization": `Bearer ${jwt}`,
            ...previousContext.headers
        },
    };
});

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}


export const apolloClient = new ApolloClient({
    link: from([setAuthorizationLink, errorLink, httpLink]),
    defaultOptions: defaultOptions,
    cache: new InMemoryCache({
        resultCaching: false,
    })
});
