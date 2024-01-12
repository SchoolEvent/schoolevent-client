import { ReactNode } from 'react'

export type { Database } from './supabase'

export type PropsWithOptionalChildren<P = object> = P & { children?: ReactNode }

export type PropsWithChildren<P = object> = P & { children: ReactNode }

export * from './localStorage'
