export interface Option<T> {
  id: string;
  label: string;
  selected: boolean;
  data?: T;
}
