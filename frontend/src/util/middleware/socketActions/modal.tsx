/**
 * Socket callbacks for setting the modal
 */
import { store } from "../../../app/store";
import { setModal } from "../../../app/features/modalSlice";

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