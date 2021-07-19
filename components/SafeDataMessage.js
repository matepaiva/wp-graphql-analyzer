import { Alert } from "antd";
import { useEffect, useState } from "react";
import { SAFE_DATA_NOTIFICATION_KEY } from "../lib/constants";
import useLocalStorage from "../lib/useLocalStorage";

export default function SafeDataMessage() {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [shouldShowSafeDataMessage, setShouldShowSafeDataMessage] =
    useLocalStorage(SAFE_DATA_NOTIFICATION_KEY, true);

  useEffect(() => setIsFirstRender(false), []);

  if (isFirstRender || !shouldShowSafeDataMessage) return null;

  return (
    <Alert
      style={{
        marginTop: 25,
        maxWidth: 800,
        marginLeft: "auto",
        marginRight: "auto",
      }}
      message="Your data is safe!"
      description={
        <>
          <p>
            The tool Wp-GraphQL Analyser does not make any request and does not
            access you backend. The data you provide to the application is only
            stored in Local Storage at your browser.
          </p>
          <p>
            Your data is not sent to anywhere! We are open source, so you
            {" don't "} need to trust us: you can always{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/matepaiva/wp-graphql-analyzer/"
            >
              check the code
            </a>
            .
          </p>
        </>
      }
      type="info"
      afterClose={() => setShouldShowSafeDataMessage(false)}
      closable
    />
  );
}
