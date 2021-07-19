import "antd/dist/antd.css";
import "../styles/vars.css";
import "../styles/global.css";
import { DatabaseProvider } from "../lib/db";
import { Layout } from "antd";

const { Header, Content, Footer } = Layout;

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <h1
          style={{
            display: "inline-block",
            marginTop: 0,
            marginBottom: 0,
            marginRight: 10,
            color: "white",
          }}
        >
          Wp-GraphQL Analyser
        </h1>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/matepaiva/wp-graphql-analyzer"
          style={{ color: "lightblue", float: "right", fontWeight: "bold" }}
        >
          Check the GitHub Repo {">"}
        </a>
      </Header>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div>
          <DatabaseProvider>
            <Component {...pageProps} />
          </DatabaseProvider>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Matheus Paiva © 2021{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/matepaiva/wp-graphql-analyzer/blob/main/LICENSE"
        >
          Check the MIT License
        </a>
      </Footer>
    </Layout>
  );
}
