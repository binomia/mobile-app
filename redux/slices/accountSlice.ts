import { createSlice } from '@reduxjs/toolkit'
import { fetchAccountLimit } from '../fetchHelper'

const accountSlice = createSlice({
    name: 'global',
    initialState: {
        limits: {},
        haveAccountChanged: false,
        account: {},
        card: {},
        cards: [],
        kyc: {},
        user: {},
    },
    reducers: {
        setCard: (state, action) => {
            state.card = action.payload
        },
        setLimits: (state, action) => {
            state.limits = action.payload
        },
        setCards: (state, action) => {
            state.cards = action.payload
        },
        setAccount: (state, action) => {
            state.account = action.payload
        },
        setKyc: (state, action) => {
            state.kyc = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setHaveAccountChanged: (state, action) => {
            state.haveAccountChanged = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchAccountLimit.fulfilled, (state, action) => {
            state.limits = action.payload
        })
        builder.addCase(fetchAccountLimit.rejected, (state, action) => {
            state.limits = {}
        })
    }
})

export const accountActions = accountSlice.actions
export const accountReducer = accountSlice.reducer
