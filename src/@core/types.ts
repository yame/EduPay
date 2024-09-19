import type { I18nLanguage, LayoutConfig } from '@layouts/types'
import { UUID } from 'crypto'
import type { LiteralUnion, ValueOf } from 'type-fest'
import type { Skins } from './enums'

interface ExplicitThemeConfig {
  app: {
    i18n: {
      defaultLocale: string
      langConfig: I18nLanguage[]
    }
    theme: LiteralUnion<'light' | 'dark' | 'system', string>
    skin: ValueOf<typeof Skins>
  }
  verticalNav: {
    isVerticalNavSemiDark: boolean
  }
}

export type UserThemeConfig = LayoutConfig & ExplicitThemeConfig

// SECTION Custom Input
export interface CustomInputContent {
  title: string
  desc?: string
  value: string
  subtitle?: string
  icon?: string | object
  images?: string
}

export interface GridColumn {
  cols?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
  xxl?: string
}

// Data table
export interface SortItem { key: string; order?: boolean | 'asc' | 'desc' }

export interface Options {
  page: number
  itemsPerPage: number
  sortBy: readonly SortItem[]
  groupBy: readonly SortItem[]
  search: string | undefined
}


export enum DEPARTMENT {
  SMP = "SMP",
  SMC = "SMC",
  SVT = "SVT"
}

export enum PAYMENT_STATUS {
  CREATED = "CREATED",
  VALIDATED = "VALIDATED",
  REJECTED = "REJECTED"
}

export enum PAYMENT_TYPE {
  CASH = "CASH",
  CHECK = "CHECK",
  TRANSFER = "TRANSFER",
  DEPOSIT = "DEPOSIT"
}

export enum PROGRAM {
  SMP = "SMP",
  SMC = "SMC",
  SMA = "SMA",
  SMI = "SMI",
  SVT = "SVT"
}


export interface DtoNewPayment {
  studentCode: string;
  amount: number;
  paymentType: PAYMENT_TYPE;
  date: Date;
}

export interface DtoNewStudent {
  code: string,
  programId: PROGRAM,
  firstName: string,
  lastName: string,
  email: string
}

export interface Student {
  code: string,
  programID: PROGRAM,
  firstName: string,
  lastName: string,
  email: string,
  registerDate?: string | Date
}

export interface Payment {
  id: UUID,
  amount: number,
  date: Date,
  type: PAYMENT_TYPE,
  status: PAYMENT_STATUS,
  receipt: string,
  studentCode: string,
  addedBy: string
}


export interface ChangePWDTO {
  oldPassword: string,
  newPassword: string
}

export const PROGRAM_ITEMS = [PROGRAM.SMA, PROGRAM.SMC, PROGRAM.SMI, PROGRAM.SMP, PROGRAM.SVT];
