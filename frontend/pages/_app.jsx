import HomeLayout from "../src/layouts/HomeLayout";
import "../src/index.css";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <HomeLayout>{page}</HomeLayout>);
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
