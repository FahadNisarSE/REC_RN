import {create} from 'zustand';
import {AppointmentDetail} from '../../api/schema/Appointment';

interface AppointmentDetailStore {
  appointmentDetail: AppointmentDetail | null | undefined;
  setAppointmentDetail: (appointment_detail: AppointmentDetail) => void;
  appointmentTestId: string | null,
  setAppointmentTestId: (id: string) => void;
}

export const useAppointmentDetailStore = create<AppointmentDetailStore>()(
  set => ({
    appointmentDetail: undefined,
    setAppointmentDetail: appointment_detail => set({appointmentDetail: appointment_detail}),
    appointmentTestId: null,
    setAppointmentTestId: (id) => set({appointmentTestId: id})
  }),
);
