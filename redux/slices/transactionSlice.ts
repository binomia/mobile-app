import { createSlice } from '@reduxjs/toolkit'
import { fetchRecentTransactions } from '../fetchHelper'

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        sender: {},
        receiver: {},
        transaction: {},
        transactions: [],
        recentTransactions: [],
        transactionDeytails: {},
        createTransactionBody: {},
        hasNewTransaction: false
    },
    reducers: {
        setSender: (state, action) => {
            state.sender = action.payload
        },
        setReceiver: (state, action) => {
            state.receiver = action.payload
        },
        setTransaction: (state, action) => {
            state.transaction = action.payload
        },
        setTransactions: (state, action) => {
            state.transactions = action.payload
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
        builder.addCase(fetchRecentTransactions.fulfilled, (state, action) => {
            state.recentTransactions = action.payload
        })
        builder.addCase(fetchRecentTransactions.rejected, (state, action) => {
            state.recentTransactions = []
        })
    },
})

export const transactionActions = transactionSlice.actions
export const transactionReducer = transactionSlice.reducer
