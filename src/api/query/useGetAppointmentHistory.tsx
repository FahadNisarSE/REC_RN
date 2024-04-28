import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import axiosInstance from '../../utils/config';
import {useSignInStore} from '../../utils/store/useSignInStore';
import {Appointment} from '../schema/Appointment';
import { number } from 'zod';

interface AppointmentsResponse {
  data: {
    appointments: Appointment[];
    page: number;
    total_rows: number;
  };
  message: string;
  status: number;
}

export async function getAppointmentHistory(
  PatientId: string | undefined,
  ClinicId: string | undefined,
  page: number
) {
  try {
    const {data} = await axiosInstance.post('/get_appointments_history', {
      PatientId,
      ClinicId,
      page: number,
      limit: 1
    });

    const appointmentResponse = data as AppointmentsResponse;

    if (appointmentResponse.status === 201) {
      console.log('Appointment History: ', appointmentResponse.data);
      return appointmentResponse.data;
    } else throw new Error('Oops! Something went wrong.');
  } catch (error) {
    throw error;
  }
}

// export default function useGetAppointmentHistory(clinicId: string | undefined) {
//   const {userData} = useSignInStore();
//   return useQuery({
//     queryKey: ['get_appointment_history', clinicId],
//     queryFn: () =>
//       getAppointmentHistory(
//         userData?.PatientId,
//         clinicId ? clinicId : userData?.ClinicIds,
//       ),
//     refetchInterval: 30 * 1000, // 30 sec
//     retry: 3, // retry 3 times
//     retryDelay: 10 * 1000, // 5 sec retry delay
//   });
// }

export default function useGetPaginatedAppointmentHistory(clinicId: string | undefined) {
  const {userData} = useSignInStore();
  return useInfiniteQuery({
    queryKey: ['get_appointment_history', clinicId],
    queryFn: prop => {
      console.log('page prop: ', prop);
      return getAppointmentHistory(userData?.PatientId, clinicId, prop.pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
       return lastPage.page < lastPage.total_rows ? lastPage.page + 1 : null;
     }
  });
}
