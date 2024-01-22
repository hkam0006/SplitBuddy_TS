import { create } from 'zustand'

type AppStore = {
    loader: boolean,
    setLoginState: Function
    isLogin: Object | undefined
}

const useStore = create<AppStore>((set) => ({
    loader: true,
    isLogin: false,
    setLoginState: (status: boolean): void => set({
        isLogin: status,
        loader: false
    })
}))


export default useStore;