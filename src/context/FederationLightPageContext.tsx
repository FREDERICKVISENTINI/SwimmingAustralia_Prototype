import { createContext, useContext } from 'react'

/** True when viewing Federation dashboard or federation section pages (light theme). */
export const FederationLightPageContext = createContext(false)

export function useFederationLightPage() {
  return useContext(FederationLightPageContext)
}
