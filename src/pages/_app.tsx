import { HomeContext, HomeContextProvier } from '../context/HomeContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
      <HomeContextProvier>
        <Component {...pageProps} />
      </HomeContextProvier>
    )
}

export default MyApp
