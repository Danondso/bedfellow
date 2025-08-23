import * as cheerio from 'cheerio';
import axios from 'axios';
import { Sample } from '../../../types/whosampled';
import { HEADER_TITLES } from '../enums';

const WHOSAMPLED_BASE_URL = 'https://www.whosampled.com';

const parseWhoSampledPage = async (document: string, headerText: HEADER_TITLES): Promise<Sample[] | null> => {
  if (!document) {
    return null;
  }

  const $ = cheerio.load(document);
  const array: Array<Sample> = [];

  // Find the section header with the specified text and the associated table
  const sectionHeaders = $('.sectionHeader');
  let targetSectionElement: cheerio.Element | null = null;

  sectionHeaders.each((_, element) => {
    const text = $(element).text();
    if (text.includes(headerText)) {
      targetSectionElement = element;
      return false; // Break out of each loop
    }
  });

  if (!targetSectionElement) {
    return null;
  }

  const targetSection = $(targetSectionElement);
  // Find the next table element after the section header
  const tableElement = targetSection.nextAll('table').first();
  if (tableElement.length === 0) {
    // Try to find table within a sibling container
    const nextElement = targetSection.next();
    const tableInNext = nextElement.find('table').first();
    if (tableInNext.length === 0) {
      return null;
    }
    // Use the found table
    const tbody = tableInNext.find('tbody').length ? tableInNext.find('tbody') : tableInNext;
    tbody.find('tr').each((_: number, row: cheerio.Element) => {
      processRow($, row, array);
    });
  } else {
    // Process the found table
    const tbody = tableElement.find('tbody').length ? tableElement.find('tbody') : tableElement;
    tbody.find('tr').each((_: number, row: cheerio.Element) => {
      processRow($, row, array);
    });
  }

  const samplesWithImages = await Promise.all(
    array.map(async (sample) => {
      const imageBlob = await getWhoSampledImage(sample.image);
      return {
        ...sample,
        image: imageBlob || sample.image,
      };
    })
  );

  return samplesWithImages;
};

function processRow($: cheerio.CheerioAPI, row: cheerio.Element, array: Sample[]): void {
  const text = $(row).text();

  if (text) {
    const sampleInfo = text
      .split('\n')
      .map((m) => m.trim())
      .filter((str) => str);

    const track = sampleInfo[0];
    const artist = sampleInfo[1];
    const year = sampleInfo[2];

    // Find image in the row
    let imageUrl = null;
    const img = $(row).find('img').first();
    if (img.length > 0) {
      const srcset = img.attr('srcset');
      if (srcset) {
        const urls = srcset
          .split(',')
          .map((urlFragment: string) => (WHOSAMPLED_BASE_URL + urlFragment.trim()).split(' ')[0]);
        imageUrl = urls[urls.length - 1] || null;
      }
    }

    array.push({
      artist,
      track,
      year: Number.parseInt(year, 10) || null,
      image: imageUrl,
    });
  }
}

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
