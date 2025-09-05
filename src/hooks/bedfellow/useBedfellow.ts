import useGetSamples from './useGetSamples';
import useSubmitSamples from './useSubmitSamples';

const useBedfellow = () => {
  const samples = useGetSamples();
  const submitBedfellowData = useSubmitSamples();

  return {
    samples,
    mutations: {
      submitBedfellowData,
    },
  };
};

export default useBedfellow;
