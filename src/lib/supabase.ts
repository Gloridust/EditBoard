import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env'

export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

export interface MessageBoard {
  id: number
  title: string
  message: string
  created_at: string
  updated_at: string
} 