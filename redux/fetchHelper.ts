import { apolloClient } from "@/apollo";
import { TopUpApolloQueries } from "@/apollo/query";
import { TransactionApolloQueries } from "@/apollo/query/transactionQuery"
import { createAsyncThunk } from "@reduxjs/toolkit"


export const fetchRecentTransactions = createAsyncThunk('fetchRecentTransactions', async () => {
    try {
        const { data } = await apolloClient.query({ query: TransactionApolloQueries.accountTransactions(), variables: { page: 1, pageSize: 5 } });
        return data.accountTransactions

    } catch (error) {
        console.error({ fetchRecentTransactions: error });
    }
})

export const fetchRecentTopUps = createAsyncThunk('fetchRecentTopUps', async () => {
    try {
        const { data } = await apolloClient.query({ query: TopUpApolloQueries.recentTopUps(), variables: { page: 1, pageSize: 5 } });
        return data.recentTopUps

    } catch (error) {
        console.error({ fetchRecentTopUps: error });
    }
})


export const fetchAllTransactions = createAsyncThunk('fetchAllTransactions', async ({ page, pageSize }: { page: number, pageSize: number }): Promise<any> => {
    try {
        const { data: { accountTransactions } } = await apolloClient.query({ query: TransactionApolloQueries.accountTransactions(), variables: { page, pageSize } });
        const { data: { recentTopUps } } = await apolloClient.query({ query: TopUpApolloQueries.recentTopUps(), variables: { page, pageSize } });


        const topupsMapped = recentTopUps?.map((topup: any) => {
            return {
                type: "topup",
                timestamp: topup.createdAt,
                data: topup
            }
        })

        const transactionsMapped = accountTransactions?.map((transaction: any) => {
            return {
                type: "transaction",
                timestamp: transaction.createdAt,
                data: transaction
            }
        })

        if (transactionsMapped?.length > 0 && topupsMapped?.length > 0) {
            const combinedTransactions = [...transactionsMapped, ...topupsMapped].sort((a: any, b: any) => {
                return new Date(Number(b.timestamp)).getTime() - new Date(Number(a.timestamp)).getTime()
            });

            console.log(JSON.stringify(combinedTransactions, null, 4));
            

            return combinedTransactions
        }

        return []

    } catch (error) {
        console.error({ fetchAllTransactions: error });
    }
})