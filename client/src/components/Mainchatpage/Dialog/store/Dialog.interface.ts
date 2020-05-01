export interface IUserContacts {
    contactId: string
    dialogId: string
}

export interface IMessage {
    dialogId?: string
    contactId: string
    id: string
    name: string
    lastname: string
    text: string
    timeStamp: string
}
