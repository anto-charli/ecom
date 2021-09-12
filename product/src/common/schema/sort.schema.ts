export class SortSchema {
  id: SortingKeys
  value: string
  selected?: boolean
}

export enum SortingKeys {
  NEW_ARRIVAL = 'NEW_ARRIVAL',
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DSC = 'PRICE_DSC',
}
