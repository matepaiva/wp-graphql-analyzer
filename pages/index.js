import { useState } from "react";
import { get } from "lodash";
import {
  Button,
  Divider,
  Switch,
  Table,
  Modal,
  Typography,
  Alert,
  notification,
} from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useDatabaseQuery, useDatabaseSave } from "../lib/db";
import textToQueriesAdapter from "../lib/textToQueriesAdapter";

const { Title } = Typography;

const styles = {
  buttonWrapper: {
    display: "inline-block",
    margin: "10px 30px",
  },
};

function NumberRenderer({ number }) {
  return <span style={{ color: "#256d98" }}>{number}</span>;
}

const createSorter = (field) => (a, b) => get(a, field) - get(b, field);

function getColumns(groupBy) {
  if (!groupBy) {
    return [
      { title: "Stack", dataIndex: "stack", width: 6, ellipsis: true },
      {
        title: "Time",
        dataIndex: "time",
        width: 1,
        sorter: createSorter("time"),
        render(time) {
          return <NumberRenderer number={time.toFixed(8)} />;
        },
      },
      {
        ellipsis: true,
        title: "SQL",
        dataIndex: "sql",
        width: 3,
        render(sql) {
          return (
            <pre style={{ fontSize: ".85rem" }}>
              <code>
                {sql.trim().replace(/\s\s+/g, " ").replace(/\n/g, " ")}
              </code>
            </pre>
          );
        },
      },
    ];
  }

  return [
    { title: "Stack", dataIndex: "stack", width: 6, ellipsis: true },
    {
      title: "SQL calls",
      dataIndex: "sqlList",
      width: 6,
      sorter: createSorter("sqlList.length"),
      render(sqlList) {
        return <NumberRenderer number={sqlList.length} />;
      },
    },
    {
      title: "Total time",
      dataIndex: "totalTime",
      width: 6,
      sorter: createSorter("totalTime"),
      render(n) {
        return <NumberRenderer number={n.toFixed(8)} />;
      },
    },
    {
      title: "Worst time",
      dataIndex: "maxTime",
      width: 6,
      sorter: createSorter("maxTime"),
      render(n) {
        return <NumberRenderer number={n.toFixed(8)} />;
      },
    },
    {
      ellipsis: true,
      title: "Worst SQL",
      dataIndex: "maxSql",
      width: 6,
      render(sql) {
        return (
          <pre style={{ fontSize: ".85rem" }}>
            <code>{sql.trim().replace(/\s\s+/g, " ").replace(/\n/g, " ")}</code>
          </pre>
        );
      },
    },
  ];
}

export default function Home() {
  const [groupBy, setGroupBy] = useState("");
  const [modalExportErrorMessage, setModalExportErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const save = useDatabaseSave();
  const { data } = useDatabaseQuery({
    groupBy: groupBy,
    orderBy: [
      ["time", "sqlList.length"],
      ["desc", "desc"],
    ],
  });

  async function copyHandler() {
    try {
      await navigator.clipboard
        .readText()
        .then(textToQueriesAdapter)
        .then(save);

      setIsModalVisible(false);
      notification.success({
        message: "Wp-GraphQL response successfully imported!",
      });
    } catch (error) {
      setModalExportErrorMessage(error.message);
      console.error(error);
    }
  }

  console.log({ data });

  return (
    <>
      <Modal
        title="Import new GraphQL result"
        visible={isModalVisible}
        onOk={copyHandler}
        okText="Import"
        onCancel={() => setIsModalVisible(false)}
      >
        <Title level={3}>Instructions</Title>
        <ol>
          <li>{"Go to the wordpress dashboard > GraphQL > Settings;"}</li>
          <li>{'Check the checkbox "Enable GraphQL Query Logs"'}</li>
          <li>{'Choose the "Query Log Role"'}</li>
          <li>Make the GraphQL request you want to analyse</li>
          <li>
            Select the full (ctrl + a) response and copy it to your clipboard
            (ctrl + c)
          </li>
          <li>{'Click the button bellow "Import"'}</li>
        </ol>
        {modalExportErrorMessage && (
          <Alert
            message={
              <span>
                <strong>Error: </strong>
                {modalExportErrorMessage}
              </span>
            }
            type="error"
          />
        )}
      </Modal>
      <div style={{ margin: "auto", textAlign: "center", marginTop: "2rem" }}>
        <div style={styles.buttonWrapper}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Import new GraphQL result
          </Button>
        </div>

        <div style={styles.buttonWrapper}>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={groupBy === "stack"}
            onClick={() =>
              setGroupBy((state) => (state === "stack" ? "" : "stack"))
            }
          />
          <span style={{ margin: 8, fontSize: 13 }}>
            Show results grouped by stack
          </span>
        </div>
        <Divider />
        <Table
          rowKey="id"
          columns={getColumns(groupBy)}
          pagination={{ position: ["topCenter", "bottomCenter"] }}
          dataSource={data}
        />
      </div>
    </>
  );
}
