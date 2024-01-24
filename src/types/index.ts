import { ReactNode } from 'react'

import { useSupabase } from '@utils'

export type { Database } from './supabase'
export type TSupabase = ReturnType<typeof useSupabase>

export type PropsWithOptionalChildren<P = object> = P & { children?: ReactNode }

export type PropsWithChildren<P = object> = P & { children: ReactNode }

export * from './localStorage'
export * from './useCopyToClipboard'
export * from './appointments'
