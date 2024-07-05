import parseWhoSampledPage from '../../../../src/services/whosampled/utilities/utilities';
import { HEADER_TITLES } from '../../../../src/services/whosampled/enums';
import singlePage from '../../../fixtures/api/whosampled/sample-single.0';
import multiPage from '../../../fixtures/api/whosampled/sample-multiple.0';
import { Sample } from '../../../../src/types/whosampled';
import sampleResults from '../../../fixtures/api/bedfellow-db-api/sample-info.0';

jest.mock('axios');

describe('WhoSampled Utilities Test Suite', () => {
  it('parses discrete page for matching variant', async () => {
    const expectedResult: Array<Sample> = sampleResults.samples;
    const document: string = multiPage.toString();
    const result = await parseWhoSampledPage(document, HEADER_TITLES.CONTAINS_SAMPLES);

    expect(result).toEqual(expectedResult);
  });

  it('returns null if header is not matched', async () => {
    const document: string = singlePage.toString();
    const result = await parseWhoSampledPage(document, HEADER_TITLES.SAMPLED_IN);

    expect(result).toBe(null);
  });
});
