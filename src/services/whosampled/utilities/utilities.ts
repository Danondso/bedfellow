import { load } from 'cheerio';
import { WhoSampledData } from '../../../types/whosampled';
import { HEADER_TITLES } from '../enums';

const { WHOSAMPLED_BASE_URL } = process.env;

const parseWhoSampledPage = (document: string, headerText: HEADER_TITLES): Array<WhoSampledData> | null => {
  if (!document) {
    return null;
  }
  const $ = load(document);
  const array: Array<WhoSampledData> = [];
  const sectionHeaderElement = $('.sectionHeader');

  if (!sectionHeaderElement.text().includes(headerText)) {
    return null;
  }

  const tableElement = sectionHeaderElement.nextUntil('.table .tdata');

  if (!tableElement) {
    return null;
  }
  tableElement
    .find('tbody')
    .find('tr')
    .each((i, e) => {
      const sampleInfo = $(e)
        .text()
        .split('\n')
        .map((m) => m.trim())
        .filter((str) => str);
      const track = sampleInfo[0];
      const artist = sampleInfo[1];
      const year = sampleInfo[2];

      const sampleEntryHtml = $(e).html() || '';
      const images =
        $(sampleEntryHtml)
          .find('img')
          .attr('srcset')
          ?.split(',')
          .map((urlFragment) => (WHOSAMPLED_BASE_URL + urlFragment.trim()).split(' ')[0]) || [];

      array.push({
        artist,
        track,
        year: Number.parseInt(year, 10) || null,
        images,
      });
    });

  return array;
};

export default parseWhoSampledPage;
