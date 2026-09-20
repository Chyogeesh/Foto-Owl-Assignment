/** Shape of one item returned by https://picsum.photos/v2/list */
export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type FilterMode = 'ALL' | 'A-M' | 'N-Z';
