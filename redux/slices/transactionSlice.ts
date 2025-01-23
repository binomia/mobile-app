import { createSlice } from '@reduxjs/toolkit'
import { fetchAccountBankingTransactions, fetchAllTransactions, fetchRecentTransactions } from '../fetchHelper'


const initialState = {
    loading: false,
    sender: {},
    receiver: {},
    transaction: {},
    transactions: [],
    bankingTransactions: [],
    recentTransactions: [],
    transactionDeytails: {},
    createTransactionBody: {},
    hasNewTransaction: false
}


const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        reSetAllState: (state) => {
            state = initialState
        },
        setSender: (state, action) => {
            state.sender = action.payload
        },
        setReceiver: (state, action) => {
            state.receiver = action.payload
        },
        setTransaction: (state, action) => {
            state.transaction = action.payload
        },
        setRecentTransactions: (state, action) => {
            state.recentTransactions = action.payload
        },
        setCreateTransactionBody: (state, action) => {
            state.createTransactionBody = action.payload
        },
        setTransactionDetails: (state, action) => {
            state.transactionDeytails = action.payload
        },
        setHasNewTransaction: (state, action) => {
            state.hasNewTransaction = action.payload
        }
    },
    extraReducers(builder) {
        // fetchRecentTransactions
        builder.addCase(fetchRecentTransactions.fulfilled, (state, action: any) => {
            state.recentTransactions = action.payload
        })
        builder.addCase(fetchRecentTransactions.rejected, (state) => {
            state.recentTransactions = []
        })

        // fetchAllTransactions
        builder.addCase(fetchAllTransactions.fulfilled, (state, action) => {
            state.transactions = action.payload
        })
        builder.addCase(fetchAllTransactions.rejected, (state) => {
            state.transactions = []
        })

        // fetchAccountBankingTransactions
        builder.addCase(fetchAccountBankingTransactions.fulfilled, (state, action) => {
            state.bankingTransactions = action.payload
        })
        builder.addCase(fetchAccountBankingTransactions.rejected, (state) => {
            state.bankingTransactions = []
        })

    }
})

export const transactionActions = transactionSlice.actions
export const transactionReducer = transactionSlice.reducer
