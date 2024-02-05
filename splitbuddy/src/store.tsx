import { create } from 'zustand'
import { GroupObject, InviteProps } from './components/hooks/useApp'


type AppStoreProps = {
    loader: boolean,
    setLoginState: Function
    isLogin: boolean,
    groups: GroupObject[],
    areGroupsFetched: boolean,
    setGroups: Function,
    invites: InviteProps[],
    areInvitesFetched: boolean,
    setInvites: Function
}

const useStore = create<AppStoreProps>((set) => ({
    loader: true,
    isLogin: false,
    areGroupsFetched: false,
    setLoginState: (status: boolean): void => set({
        isLogin: status,
        loader: false
    }),
    groups: [],
    setGroups: (groups: GroupObject[]) => set({
        groups: groups,
        areGroupsFetched: true
    }),
    invites: [],
    areInvitesFetched: false,
    setInvites: (invites: InviteProps[]) => set({
        invites: invites,
        areInvitesFetched: true
    })
}))


export default useStore;