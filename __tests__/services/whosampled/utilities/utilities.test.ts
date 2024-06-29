// eslint-disable-next-line import/no-extraneous-dependencies
import RNFS from 'react-native-fs';
import { parseWhoSampledPage } from '../../../../src/services/whosampled/utilities/utilities';
import { HEADER_TITLES } from '../../../../src/services/whosampled/enums';

// TODO write a service test that tests the service AND the utility
describe('WhoSampled Utilities Test Suite', () => {
  it('parses discrete page for matching variant', async () => {
    const document: string = await RNFS.readFile(
      './src/services/whosampled/multiple.0.html'
    );
    const result = parseWhoSampledPage(
      document,
      HEADER_TITLES.CONTAINS_SAMPLES
    );

    expect(result?.length).toBe(4);
  });

  it('returns null if header is not matched', async () => {
    const document: string = await RNFS.readFile(
      '../../../fixtures/whosampled/sample-single.0.html'
    );
    const result = parseWhoSampledPage(document, HEADER_TITLES.SAMPLED_IN);

    expect(result?.length).toBe(4);
  });
});
