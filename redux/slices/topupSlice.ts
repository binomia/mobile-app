import { createSlice } from '@reduxjs/toolkit'
import phone from 'phone'
import { fetchRecentTopUps } from '../fetchHelper'

const topupSlice = createSlice({
    name: 'topups',
    initialState: {
        topup: {},
        newTopUp: {},
        recentTopUps: [],
        phoneNumber: "",
        fullName: "",
        company: {},
        hasNewTransaction: false
    },
    reducers: {
        setPhoneNumber: (state, action) => {
            state.phoneNumber = action.payload
        },
        setFullName: (state, action) => {
            state.fullName = action.payload
        },
        setCompany: (state, action) => {
            state.company = action.payload
        },
        setNewTopUp: (state, action) => {
            state.newTopUp = action.payload
        },
        setTopUp: (state, action) => {
            state.topup = action.payload
        },
        setHasNewTransaction: (state, action) => {
            state.hasNewTransaction = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchRecentTopUps.fulfilled, (state, action) => {
            state.recentTopUps = action.payload
        })
        builder.addCase(fetchRecentTopUps.rejected, (state) => {
            state.recentTopUps = []
        })
    },
})

export const topupActions = topupSlice.actions
export const topupReducer = topupSlice.reducer
