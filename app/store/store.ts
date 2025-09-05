import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // Add your slices here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch