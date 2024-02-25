import { create } from 'zustand'
import { GroupObject, InviteProps } from './components/hooks/useApp'
import { AlertColor, AlertPropsColorOverrides } from '@mui/material'

type SeverityProps = "success" | "error" | "info" | ""

type AppStoreProps = {
    loader: boolean,
    setLoginState: Function
    isLogin: boolean,
    groups: GroupObject[],
    areGroupsFetched: boolean,
    setGroups: Function,
    invites: InviteProps[],
    areInvitesFetched: boolean,
    setInvites: Function,
    setToaster: Function,
    toasterMsg: string,
    toasterSeverity: SeverityProps
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
    }),
    toasterMsg: "",
    toasterSeverity: "",
    setToaster: (message: string, severity: SeverityProps) => set({
        toasterMsg: message,
        toasterSeverity: severity
    })
}))


export default useStore;