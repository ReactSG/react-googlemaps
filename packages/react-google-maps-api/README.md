# @reactsg/googlemaps

![logo](https://raw.githubusercontent.com/JustFly1984/react-google-maps-api/master/logo.png)

[![npm package](https://img.shields.io/npm/v/@reactsg/googlemaps)](https://www.npmjs.com/package/@reactsg/googlemaps)
[![npm downloads](https://img.shields.io/npm/dt/@reactsg/googlemaps)](https://www.npmjs.com/package/@reactsg/googlemaps)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@reactsg/googlemaps)](https://www.npmjs.com/package/@reactsg/googlemaps)
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/react-google-maps)
[![DeepScan grade](https://deepscan.io/api/teams/6449/projects/8455/branches/101268/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6449&pid=8455&bid=101268)

@reactsg/googlemaps

> This library requires React v16.6 or later. To use the latest features (including hooks) requires React v16.8+. If you need support for earlier versions of React, you should check out [react-google-maps](https://github.com/tomchentw/react-google-maps)

This is complete re-write of the (sadly unmaintained) `react-google-maps` library. We thank [tomchentw](https://github.com/tomchentw/) for his great work that made possible.

@reactsg/googlemaps provides very simple bindings to the google maps api and lets you use it in your app as React components.

Here are the main additions to react-google-maps that were the motivation behind this re-write

## Install @reactsg/googlemaps

with NPM

```#!/bin/bash
$ npm i @reactsg/googlemaps
<!-- or -->
$ yarn add @reactsg/googlemaps
```

```jsx
import React from 'react';
import { GoogleMap, useJsApiLoader } from '@reactsg/googlemaps';

const containerStyle = {
  width: '400px',
  height: '400px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
```

## Migration from react-google-maps@9.4.5

if you need an access to map object, instead of `ref` prop, you need to use `onLoad` callback on `<GoogleMap />` component.

Before:

```jsx
// before - don't do this!
<GoogleMap
  ref={map => {
    const bounds = new window.google.maps.LatLngBounds();

    map.fitBounds(bounds);
  }}
/>
```

After:

```jsx
<GoogleMap
  onLoad={map => {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
  }}
  onUnmount={map => {
    // do your stuff before map is unmounted
  }}
/>
```

If you want to use `window.google` object, you need to extract GoogleMap in separate module, so it is lazy executed then `google-maps-api` script is loaded and executed by `<LoadScript />`. If you try to use `window.google` before it is loaded it will be undefined and you'll get a TypeError.

## Main features

- Simplified API
- Uses the new Context API
- Supports async React (StrictMode compliant)
- Removes lodash dependency =>
  smaller bundle size `12.4kb` gzip, tree-shakeable [https://bundlephobia.com/result?p=@reactsg/googlemaps](https://bundlephobia.com/result?p=@reactsg/googlemaps)
- forbids loading of Roboto fonts, if you set property preventGoogleFonts on `<LoadScript preventGoogleFonts />` component

## Examples

Updating soon:

## Advice

> Using the examples requires you to generate a google maps api key. For instructions on how to do that please see the following [guide](https://developers.google.com/maps/documentation/embed/get-api-key)
