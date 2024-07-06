import parseWhoSampledPage from '../../../../src/services/whosampled/utilities/utilities';
import { HEADER_TITLES } from '../../../../src/services/whosampled/enums';
import singlePage from '../../../fixtures/api/whosampled/html/sample-single-page.0';
import singlePageNoYearOrImage from '../../../fixtures/api/whosampled/html/sample-no-year-image.0';

import multiPage from '../../../fixtures/api/whosampled/html/sample-multiple-page.0';
import pageWithoutSamples from '../../../fixtures/api/whosampled/html/sample-none-page.0';
import { Sample } from '../../../../src/types/whosampled';
import parsedSampleResults from '../../../fixtures/api/whosampled/parseResults/parse-result.0';
import resultsWithoutYearAndImage from '../../../fixtures/api/whosampled/parseResults/parse-result.1';

jest.mock('axios');

describe('WhoSampled Utilities Test Suite', () => {
  it('parses discrete page for matching variant', async () => {
    const expectedResult: Array<Sample> = parsedSampleResults.samples;
    const result = await parseWhoSampledPage(multiPage, HEADER_TITLES.CONTAINS_SAMPLES);

    expect(result).toEqual(expectedResult);
  });

  it('defaults year and images to null if neither are found', async () => {
    const expectedResult: Array<Sample> = resultsWithoutYearAndImage.samples;
    const result = await parseWhoSampledPage(singlePageNoYearOrImage, HEADER_TITLES.CONTAINS_SAMPLES);

    expect(result).toEqual(expectedResult);
  });

  it('returns null if header is not matched', async () => {
    expect(await parseWhoSampledPage(singlePage, HEADER_TITLES.SAMPLED_IN)).toBeNull();
  });

  it('returns null if input is falsy', async () => {
    expect(await parseWhoSampledPage('', HEADER_TITLES.SAMPLED_IN)).toBeNull();
  });

  it('returns null if table data is not found in document', async () => {
    expect(await parseWhoSampledPage(pageWithoutSamples.toString(), HEADER_TITLES.SAMPLED_IN)).toBeNull();
  });
});
