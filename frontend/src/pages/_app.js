import '../index.css';
import { AuthProvider } from '../contexts/AuthContext';

function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;