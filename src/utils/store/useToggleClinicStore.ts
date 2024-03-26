import {create} from 'zustand';
import {useSignInStore} from './useSignInStore';

interface ToggleClinic {
  clinicId: string | undefined;
  setClinicId: (clinicId: string) => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export const useToggleStore = create<ToggleClinic>()(set => ({
  clinicId: useSignInStore.getState().userData?.Clinics[0].ClinicId,
  setClinicId: clinicId => set({clinicId: clinicId}),
  showModal: false,
  setShowModal: showModal => set({showModal: showModal}),
}));
