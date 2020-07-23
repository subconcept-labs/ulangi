export interface CategorySuggestion {
  readonly kind: 'new' | 'existing';
  readonly categoryName: string;
}
