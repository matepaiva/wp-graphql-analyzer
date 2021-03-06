import "antd/dist/antd.css";
import "../styles/vars.css";
import "../styles/global.css";
import { DatabaseProvider } from "../lib/db";
import { Layout } from "antd";
import ModalImportData from "../components/ModalImportData";
import { GithubOutlined } from "@ant-design/icons";
import SafeDataMessage from "../components/SafeDataMessage";

const { Header, Content, Footer } = Layout;

export default function MyApp({ Component, pageProps }) {
  return (
    <DatabaseProvider>
      <Layout>
        <Header
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "white",
              }}
            >
              Wp-GraphQL Analyser
            </h1>
          </div>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/matepaiva/wp-graphql-analyzer"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "lightblue",
              fontSize: 16,
            }}
          >
            <GithubOutlined />
            <span style={{ margin: "0px 10px" }}>
              Check the GitHub Repo and leave a star!
            </span>
          </a>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              height: "100%",
            }}
          >
            <ModalImportData />
          </div>
        </Header>
        <Content style={{ padding: "0 50px", marginTop: 64 }}>
          <SafeDataMessage />
          <Component {...pageProps} />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Matheus Paiva ?? 2021{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/matepaiva/wp-graphql-analyzer/blob/main/LICENSE"
          >
            Check the MIT License
          </a>
        </Footer>
      </Layout>
    </DatabaseProvider>
  );
}
