import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import React, { useState } from 'react'
import Switch from 'react-ios-switch'

import Advanced from './examples/Advanced'
import Simple from './examples/Simple'

// import * as serviceWorker from './serviceWorker';
export default function Home() {
  const [showAdvanced, setShowAdvanced] = useState(true)

  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* <Header title="Infinite Waifus" /> */}
        <p className="description">
        </p>
      </main>

      <div className='app'>
        {showAdvanced ? <Advanced /> : <Simple />}
        <div className='row'>
          <p style={{ color: '#fff' }}>Show advanced example</p> <Switch checked={showAdvanced} onChange={setShowAdvanced} />
        </div>
     </div>

      <Footer />
    </div>
  )
}
