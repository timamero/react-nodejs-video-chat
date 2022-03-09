/**
 * Actions for setting the modal
 */
import { store } from "../../../app/store";
import { setModal } from "../../../app/features/modalSlice";
import { User } from "../../types";

export const setModalInviteToChat = (peerId: string, peerUsername: string) => {
  const modalData = {
    modalName: 'send chat invite',
    modalContent: `Would you like to invite ${peerUsername} to private chat?`,
    confirmBtnText: 'Yes, send invite.',
    declineBtnText: 'No, cancel invite.',
    isActive: true,
    peerId,
    socketEvent: 'invite private chat'
  }
  store.dispatch(setModal(modalData))
}

export const setModalInviteRequest = (inviterId: string, inviter: User) => {
  const modalData = {
    modalName: 'private chat request',
    modalContent: `${inviter.username} has invited you to a private chat?`,
    confirmBtnText: 'Yes, accept invite.',
    declineBtnText: 'No, decline invite.',
    isActive: true,
    peerId: inviterId,
    socketEvent: 'invite requested'
  }
  store.dispatch(setModal(modalData))
}