import { create } from 'zustand'

export default globalStore = create((set) => ({
    data: 0,
    //   resetData: () => set({ bears: 0 }),
    // updateData: (newData) => set({ data: newData }),
}))
