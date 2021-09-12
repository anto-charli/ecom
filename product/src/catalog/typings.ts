import { SortingKeys } from 'src/common/schema'

export interface QueryParams {
  offset?: number
  limit?: number
  locale?: string
  sort?: SortingKeys
}

export interface ProductReqParam {
  id: string
}

export interface SelectedSortParams {
  selectedSort: SortingKeys
}

export interface SortValues {
  id: SortingKeys
  value: string
  schema?: {
    key: 'createdDate' | 'salePrice'
    value?: 'asc' | 'dsc'
  }
}

export interface GetSortQuery {
  sortId: SortingKeys
}
