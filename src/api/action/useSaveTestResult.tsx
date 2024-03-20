import {useMutation} from '@tanstack/react-query';
import axiosInstance from '../../utils/config';

export async function saveTestResult(data: {
  AppointmentTestId: string;
  VariableName: string[];
  VariableValue: string[];
}) {
  const {AppointmentTestId, VariableName, VariableValue} = data;

  try {
    const {data} = await axiosInstance.post('/save_test_result', {
      AppointmentTestId,
      VariableName,
      VariableValue,
    });

    if (data.status === 201) {
      return 'Tests result saved successfully.';
    } else throw new Error('Oops! Something went wrong.');
  } catch (error) {
    throw error;
  }
}

export default function useSaveTestResults() {
  return useMutation({
    mutationKey: ['save_test_result'],
    mutationFn: saveTestResult,
  });
}
