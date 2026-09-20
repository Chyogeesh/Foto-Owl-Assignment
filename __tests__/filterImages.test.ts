import type { PicsumImage } from '../src/types/gallery';
import { filterImages } from '../src/utils/filterImages';

const make = (id: string, author: string): PicsumImage => ({
  id,
  author,
  width: 100,
  height: 100,
  url: `https://example.com/${id}`,
  download_url: `https://example.com/${id}/download`,
});

const images = [make('1', 'Alejandro Escamilla'), make('2', 'Paul Jarvis'), make('3', 'Mike Jones'), make('4', 'Nora Bell')];

describe('filterImages', () => {
  it('returns everything for an empty query and ALL filter', () => {
    expect(filterImages(images, '', 'ALL')).toHaveLength(4);
    expect(filterImages(images, '   ')).toHaveLength(4);
  });

  it('searches authors case-insensitively', () => {
    expect(filterImages(images, 'pAuL').map((i) => i.id)).toEqual(['2']);
  });

  it('applies the A-M and N-Z filters on the first letter', () => {
    expect(filterImages(images, '', 'A-M').map((i) => i.id)).toEqual(['1', '3']);
    expect(filterImages(images, '', 'N-Z').map((i) => i.id)).toEqual(['2', '4']);
  });

  it('combines search and filter', () => {
    expect(filterImages(images, 'o', 'A-M').map((i) => i.id)).toEqual(['1', '3']);
    expect(filterImages(images, 'o', 'N-Z').map((i) => i.id)).toEqual(['4']);
    expect(filterImages(images, 'zzz', 'ALL')).toEqual([]);
  });
});
