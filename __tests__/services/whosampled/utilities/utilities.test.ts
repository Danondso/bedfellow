import parseWhoSampledPage from '../../../../src/services/whosampled/utilities/utilities';
import { HEADER_TITLES } from '../../../../src/services/whosampled/enums';
import singlePage from '../../../fixtures/api/whosampled/sample-single.0';
import multiPage from '../../../fixtures/api/whosampled/sample-multiple.0';
import { Sample, WhoSampledData } from '../../../../src/types/whosampled';

describe('WhoSampled Utilities Test Suite', () => {
  it('parses discrete page for matching variant', async () => {
    const expectedResult: Array<Sample> = [
      {
        artist: 'Ponderosa Twins Plus One',
        image: 'https://www.whosampled.com/static/images/media/track_images_100/mr60124_201393_14349154951.jpg',
        track: 'Bound',
        year: 1971,
      },
      {
        artist: 'Brenda Lee',
        image: 'https://www.whosampled.com/static/images/media/track_images_200/lr9591_2011312_14739796772.jpg',
        track: "Sweet Nothin's",
        year: 1959,
      },
      {
        artist: 'Wee',
        image: 'https://www.whosampled.com/static/images/media/track_images_200/lr28714_2012827_101413805613.jpg',
        track: 'Aeroplane (Reprise)',
        year: 1977,
      },
      {
        artist: 'Martin (TV show)',
        image: 'https://www.whosampled.com/static/images/media/visualmedia_images_200/lr60124_2017215_112028118784.jpg',
        track: "Jerome's in the House, Watch Your Mouth",
        year: 1994,
      },
    ];
    const document: string = multiPage.toString();
    const result = parseWhoSampledPage(document, HEADER_TITLES.CONTAINS_SAMPLES);

    expect(result).toEqual(expectedResult);
  });

  it('returns null if header is not matched', async () => {
    const document: string = singlePage.toString();
    const result = parseWhoSampledPage(document, HEADER_TITLES.SAMPLED_IN);

    expect(result).toBe(null);
  });
});
