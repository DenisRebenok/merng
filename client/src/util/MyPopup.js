/* eslint-disable react/prop-types */
import React from 'react'
import { Popup } from 'semantic-ui-react'

export default function MyPopup({ content, children }) {
  return <Popup inverted content={content} trigger={children} />
}
