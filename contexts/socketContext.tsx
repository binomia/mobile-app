import { NOTIFICATION_SERVER_URL, SOCKET_EVENTS } from "@/constants";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { createContext, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { AccountAuthSchema } from "@/auth/accountAuth";
import { globalActions } from "@/redux/slices/globalSlice";
import { transactionActions } from "@/redux/slices/transactionSlice";
import { useLazyQuery } from "@apollo/client";
import { AccountApolloQueries } from "@/apollo/query";
import { fetchAccountLimit, fetchAllTransactions, fetchRecentTopUps, fetchRecentTransactions } from "@/redux/fetchHelper";
import { accountActions } from "@/redux/slices/accountSlice";


export const SocketContext = createContext({});

export const SocketContextProvider = ({ children }: { children: JSX.Element }) => {
    const [getAccount] = useLazyQuery(AccountApolloQueries.account());

    const { getItem } = useAsyncStorage()
    const dispatch = useDispatch()

    const refreshAccount = useCallback(async () => {
        try {
            const { data } = await getAccount()
            await dispatch(accountActions.setAccount(data.account))
        } catch (error) {
            console.log(error);
        }

    }, []);


    const runCallbackAfterEvents = async (data: any, runAll: boolean = false) => {
        if (runAll)
            await Promise.all([
                refreshAccount(),
                dispatch(accountActions.setHaveAccountChanged(false)),
                dispatch(transactionActions.setHasNewTransaction(true)),
                dispatch(fetchRecentTransactions()),
                dispatch(fetchRecentTopUps()),
                dispatch(fetchAccountLimit())

            ])
        else
            await Promise.all([
                dispatch(accountActions.setAccount(data.from)),
                dispatch(fetchRecentTransactions()),
                dispatch(fetchAllTransactions({ page: 1, pageSize: 10 })),
                dispatch(fetchRecentTopUps()),
                dispatch(fetchAccountLimit())
            ])
    }

    useEffect(() => {
        getItem("jwt").then(async (jwt) => {
            if (!jwt) return

            const decoded = jwtDecode(jwt);
            const { username } = await AccountAuthSchema.jwtDecoded.parseAsync(decoded)

            const socket = io(NOTIFICATION_SERVER_URL, {
                query: { username }
            });

            socket.on("connect", () => {
                socket.on(SOCKET_EVENTS.NOTIFICATION_TRANSACTION_CREATED, async () => {
                    await runCallbackAfterEvents({}, true)
                })

                socket.on(SOCKET_EVENTS.NOTIFICATION_TRANSACTION_REQUEST_PAIED, async () => {
                    await runCallbackAfterEvents({}, true)
                })


                socket.on(SOCKET_EVENTS.NOTIFICATION_TRANSACTION_CREATED_FROM_QUEUE, async (data: any) => {
                    await runCallbackAfterEvents(data)
                })

                socket.on(SOCKET_EVENTS.NOTIFICATION_TRANSACTION_REQUEST_CANCELED, async (data: any) => {                    
                    await runCallbackAfterEvents(data)
                })
                
                socket.on(SOCKET_EVENTS.NOTIFICATION_QUEUE_TRANSACTION_CREATED, async (data: any) => {
                    await runCallbackAfterEvents(data)
                })
            })

            return () => {
                socket.off("connect");
            }

        }).catch((error) => {
            console.error({ error });
        })

    }, [])


    return (
        <SocketContext.Provider value={{}}>
            {children}
        </SocketContext.Provider>
    )
}