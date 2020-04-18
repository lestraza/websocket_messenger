export interface IRegisterProps {
    name?: string
    lastname?: string
    email: string
    password: string
    avatarUrl?: string
}

export interface IClient {
    id: string
    name: string
    email: string
    lastName: string
    avatarUrl: string
    isOnline: boolean
}

export interface IChangeSettingsProps {
    name?: string
    lastname?: string
    email?: string
    password?: string
    _id: string
}
