import { Popup } from 'semantic-ui-react'
import React from 'react'

// children is trigger element
function MyPopup({content, children}) {
    return <Popup inverted content={content} trigger={children} />;
}

export default MyPopup;