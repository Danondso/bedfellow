import axios from 'axios';
import { WhoSampledParseData } from '../../types/whosampled';

export interface BedfellowDBAPIPOSTBody {
  artist_name: string;
  track_name: string;
  samples: Array<WhoSampledParseData>;
}

const { BEDFELLOW_DB_API_BASE_URL } = process.env;

export const postToBedfellowDBAPI = async (
  requestBody: BedfellowDBAPIPOSTBody
) => {
  try {
    const response = await axios.post(
      `${BEDFELLOW_DB_API_BASE_URL}/samples`,
      requestBody
    );
    return response.status === 204;
  } catch (error) {
    if (error.response.status === 409) {
      throw new Error('Sample already exists!');
    }
    console.log(error);
    return false;
  }
};
