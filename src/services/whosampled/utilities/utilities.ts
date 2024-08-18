import { load } from 'cheerio';
import axios from 'axios';
import { Sample } from '../../../types/whosampled';
import { HEADER_TITLES } from '../enums';

const WHOSAMPLED_BASE_URL = 'https://www.whosampled.com';

const parseWhoSampledPage = async (document: string, headerText: HEADER_TITLES): Promise<Sample[] | null> => {
  if (!document) {
    return null;
  }
  const $ = load(document);
  const array: Array<Sample> = [];
  const sectionHeaderElement = $('.sectionHeader');

  if (!sectionHeaderElement.text().includes(headerText)) {
    return null;
  }

  const tableElement = sectionHeaderElement.nextUntil('.table .tdata');

  tableElement
    .find('tbody')
    .find('tr')
    .each((_i, e) => {
      const sampleInfo = $(e)
        .text()
        .split('\n')
        .map((m) => m.trim())
        .filter((str) => str);
      const track = sampleInfo[0];
      const artist = sampleInfo[1];
      const year = sampleInfo[2];

      const sampleEntryHtml = $(e).html() || '';
      const image =
        $(sampleEntryHtml)
          .find('img')
          .attr('srcset')
          ?.split(',')
          .map((urlFragment) => (WHOSAMPLED_BASE_URL + urlFragment.trim()).split(' ')[0]) || [];

      array.push({
        artist,
        track,
        year: Number.parseInt(year, 10) || null,
        image: image.at(-1) || null,
      });
    });
  const samplesWithImages = await Promise.all(
    await array.map(async (sample) => {
      const imageBlob = await getWhoSampledImage(sample.image);
      return {
        ...sample,
        image: imageBlob || sample.image,
      };
    })
  );
  return samplesWithImages;
};

export const getWhoSampledImage = async (url: string | null): Promise<string | null> => {
  if (!url) {
    return null;
  }

  try {
    const result = await axios.get(url, {
      responseType: 'blob',
    });
    return await blobToBase64(result.data);
  } catch (err) {
    return null;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

export default parseWhoSampledPage;
