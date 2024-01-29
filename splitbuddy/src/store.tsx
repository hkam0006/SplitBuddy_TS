import { create } from 'zustand'
import { GroupObject } from './components/hooks/useApp'


type AppStoreProps = {
    loader: boolean,
    setLoginState: Function
    isLogin: boolean,
    groups: GroupObject[],
    addGroup: Function
}

const useStore = create<AppStoreProps>((set) => ({
    loader: true,
    isLogin: false,
    setLoginState: (status: boolean): void => set({
        isLogin: status,
        loader: false
    }),
    groups: [
        { name: "Aussie", id: "skdpoaskopdkasd", owner: "bruh" },
        { name: "Home Kong", id: "asdwscxc", owner: "bugga" },
    ],
    addGroup: (newGroup: GroupObject): void => set(old => ({
        groups: [newGroup, ...old.groups]
    }))
}))


export default useStore;