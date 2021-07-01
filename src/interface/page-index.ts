export interface ItemMap {
  action: {
    type: string;
    extra: {
      value: string;
      videoId?: string;
    };
  };
  mark: {
    text: string;
  };
  subtitle?: string;
  title: string;
  img: string;
  summary: string;
}
