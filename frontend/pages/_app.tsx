import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Check whether a car or motorcycle repair quote is fair: typical price range, risk level, and next steps."
        />
      </Head>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
