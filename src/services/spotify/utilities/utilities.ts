import { fuzzy } from 'fast-fuzzy';

import { TrackObjectFull } from '../../../types/spotify-api';
import { WhoSampledData } from '../../../types/whosampled';

const COMPARISON_THRESHOLD = 1.5;
const COMPOSITE_EXACT_MATCH = 2;
const EXACT_MATCH = 1;
const MAX_WORD_DIFFERENCE = 2;
const findMatchingTrack = (
  items: TrackObjectFull[],
  selectedTrack: WhoSampledData
): TrackObjectFull | undefined => {
  const matchingTrack = items.find(
    (item) =>
      item.name === selectedTrack.track_name &&
      item.artists[0].name === selectedTrack.artist
  );
  if (matchingTrack) return matchingTrack;

  return fuzzyFindMatchingTrack(items, selectedTrack);
};

const fuzzyFindMatchingTrack = (
  items: TrackObjectFull[],
  selectedTrack: WhoSampledData
) => {
  let index = -1;
  let compositeScore = -1;
  for (let i = 0; i < items.length; i++) {
    const { name, artists } = items[i];
    // fuzzy does a 0-1 score
    const trackMatch = fuzzy(name, selectedTrack.track_name);
    const artistMatch = fuzzy(artists[0].name, selectedTrack.artist);
    const tempCompositeScore = trackMatch + artistMatch;
    const trackExceedsSelectedTrackWordCount =
      trackNameExceedsWordCountOfSelected(name, selectedTrack.track_name);

    // since a string from spotify could contain the full substring of the track name
    // we do a check to make sure that the word count difference between the spotify track name
    // and the selected track name isn't too many words
    if (trackMatch === EXACT_MATCH && trackExceedsSelectedTrackWordCount) {
      continue;
    }

    if (tempCompositeScore > compositeScore) {
      index = i;
      compositeScore = tempCompositeScore;
    }
    if (compositeScore === COMPOSITE_EXACT_MATCH) break;
  }

  return compositeScore >= COMPARISON_THRESHOLD ? items[index] : undefined;
};

const trackNameExceedsWordCountOfSelected = (a: string, b: string): boolean => {
  const aLength = a?.split(' ').length || 0;
  const bLength = b?.split(' ').length || 0;
  if (aLength > bLength) {
    return aLength - bLength >= MAX_WORD_DIFFERENCE;
  } else if (aLength < bLength) {
    return true;
  }
  return false;
};

export default findMatchingTrack;
