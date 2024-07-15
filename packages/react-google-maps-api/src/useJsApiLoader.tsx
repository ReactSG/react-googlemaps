import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

import { isBrowser } from './utils/isbrowser'
import { preventGoogleFonts } from './utils/prevent-google-fonts'
import type {
  LoadScriptUrlOptions,
  Libraries,
} from './utils/make-load-script-url'

import { DEFAULT_LOAD_SCRIPT_PROPS } from './LoadScript'

export interface UseLoadScriptOptions extends LoadScriptUrlOptions {
  id?: string
  nonce?: string
  preventGoogleFontsLoading?: boolean
}

const defaultLibraries: Libraries = ['maps']

export function useJsApiLoader({
  id = DEFAULT_LOAD_SCRIPT_PROPS.id,
  version = DEFAULT_LOAD_SCRIPT_PROPS.version,
  nonce,
  googleMapsApiKey,
  // googleMapsClientId,
  language,
  region,
  libraries = defaultLibraries,
  preventGoogleFontsLoading,
  // channel,
  mapIds,
  authReferrerPolicy,
}: UseLoadScriptOptions): {
  isLoaded: boolean
  loadError: Error | undefined
} {
  const isMounted = useRef(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<Error | undefined>(undefined)

  useEffect(function trackMountedState() {
    isMounted.current = true
    return (): void => {
      isMounted.current = false
    }
  }, [])

  const loader = useMemo(() => {
    return new Loader({
      id,
      apiKey: googleMapsApiKey,
      version,
      libraries,
      language: language ?? 'en',
      region: region ?? 'US',
      mapIds: mapIds ?? [],
      nonce: nonce ?? '',
      authReferrerPolicy: authReferrerPolicy ?? 'origin',
    })
  }, [
    id,
    googleMapsApiKey,
    version,
    libraries,
    language,
    region,
    mapIds,
    nonce,
    authReferrerPolicy,
  ])

  useEffect(() => {
    if (isLoaded) {
      return
    }

    loader
      .load()
      .then(() => {
        if (isMounted.current) {
          setIsLoaded(true)
        }
        return
      })
      .catch((error) => {
        if (isMounted.current) {
          setLoadError(error)
        }
      })
  }, [isLoaded, loader])

  useEffect(() => {
    if (isBrowser && preventGoogleFontsLoading) {
      preventGoogleFonts()
    }
  }, [preventGoogleFontsLoading])

  const prevLibraries = useRef<undefined | Libraries>()

  useEffect(() => {
    if (prevLibraries.current && libraries !== prevLibraries.current) {
      console.warn(
        'Performance warning! LoadScript has been reloaded unintentionally! You should not pass `libraries` prop as new array. Please keep an array of libraries as static class property for Components and PureComponents, or just a const variable outside of component, or somewhere in config files or ENV variables'
      )
    }
    prevLibraries.current = libraries
  }, [libraries])

  return { isLoaded, loadError }
}
