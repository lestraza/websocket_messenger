import { IUserContacts } from './../../Mainchatpage/Dialog/store/Dialog.interface'
export interface IUser {
    id?: string
    name?: string
    lastname?: string
    email?: string
    password?: string
    avatarUrl?: string
    isOnline?: boolean
    contacts?: IUserContacts[]
}
