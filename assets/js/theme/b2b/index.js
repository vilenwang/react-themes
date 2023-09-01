import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Creditnotestable from '../../components/creditnotestable';

const App = () => {
  return (
    <>
      <Creditnotestable></Creditnotestable>
    </>
  )
}
const Root = () => (
    <App />
)

export default () => {
  ReactDOM.createRoot(document.getElementById('react-app')).render(<Root />)
  // ReactDOM.render(
  //     <App />,
  //     document.getElementById('react-app'),
  // );
};