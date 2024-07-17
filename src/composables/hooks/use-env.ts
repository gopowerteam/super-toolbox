import { detectEnv } from '@/shared/common/detect'

export function useEnv() {
  return detectEnv()
}
