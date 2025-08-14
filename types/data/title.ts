export type Title = {
  title: string;
};

export type TitleData = {
  title: string;
  setTitle: (title: string) => void;
  resetTitle: () => void;
};
