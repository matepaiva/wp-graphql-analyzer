import "antd/dist/antd.css";
import "../styles/vars.css";
import "../styles/global.css";
import { DatabaseProvider } from "../lib/db";

export default function MyApp({ Component, pageProps }) {
  return (
    <DatabaseProvider>
      <Component {...pageProps} />
    </DatabaseProvider>
  );
}
