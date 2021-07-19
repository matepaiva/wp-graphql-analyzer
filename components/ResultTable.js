import { CodeOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { get } from "lodash";
import {
  FILTER_DEFAULT,
  FILTER_GROUP_BY_STACK,
  FILTER_ORDERBY_WORST_SQL_EXEC,
  FILTER_SHOW_DUPLICATE_SQL,
} from "../lib/constants";
import { useDatabaseQuery } from "../lib/db";

function renderCode(sql) {
  return (
    <pre style={{ fontSize: ".85rem" }}>
      <code>{sql.trim().replace(/\s\s+/g, " ").replace(/\n/g, " ")}</code>
    </pre>
  );
}

function NumberRenderer({ number }) {
  return <span style={{ color: "#256d98" }}>{number}</span>;
}

const createSorter = (field) => (a, b) => get(a, field) - get(b, field);

function getColumns(groupBy) {
  if (!groupBy) {
    return [
      {
        title: "Stack",
        dataIndex: "stack",
        width: 5,
        ellipsis: true,
        render: renderCode,
      },
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
        render: renderCode,
      },
      {
        title: "Actions",
        key: "operation",
        fixed: "right",
        width: 1,
        render: function LogToDevTools(item) {
          return (
            <Button onClick={() => console.log(item)}>
              <CodeOutlined />
            </Button>
          );
        },
      },
    ];
  }

  return [
    {
      title: "ID",
      dataIndex: "id",
      width: 3,
      ellipsis: true,
      render: renderCode,
    },
    {
      title: "Calls",
      dataIndex: "list",
      width: 1,
      sorter: createSorter("list.length"),
      render(list) {
        return <NumberRenderer number={list.length} />;
      },
    },
    {
      title: "Total time",
      dataIndex: "totalTime",
      width: 1,
      sorter: createSorter("totalTime"),
      render(n) {
        return <NumberRenderer number={n.toFixed(8)} />;
      },
    },
    {
      title: "Worst time",
      dataIndex: "maxTime",
      width: 1,
      sorter: createSorter("maxTime"),
      render(n) {
        return <NumberRenderer number={n.toFixed(8)} />;
      },
    },
    {
      ellipsis: true,
      title: "Worst Execution",
      dataIndex: "maxExecutionCode",
      width: 3,
      render(sql) {
        return (
          <pre style={{ fontSize: ".85rem" }}>
            <code>{sql.trim().replace(/\s\s+/g, " ").replace(/\n/g, " ")}</code>
          </pre>
        );
      },
    },
    {
      title: "Actions",
      key: "operation",
      fixed: "right",
      width: 1,
      render: function LogToDevTools(item) {
        return (
          <Button
            shape="circle"
            title="Console.log(item)"
            onClick={() => console.log(item)}
          >
            <CodeOutlined />
          </Button>
        );
      },
    },
  ];
}

const DEFAULT_ORDER_BY = [
  ["time", "list.length"],
  ["desc", "desc"],
];

function getDatabaseArgsByFilter(filter = FILTER_DEFAULT) {
  const orderBy = DEFAULT_ORDER_BY;
  return {
    [FILTER_DEFAULT]: { orderBy },
    [FILTER_ORDERBY_WORST_SQL_EXEC]: { orderBy },
    [FILTER_GROUP_BY_STACK]: { orderBy, groupBy: "stack" },
    [FILTER_SHOW_DUPLICATE_SQL]: { orderBy, groupBy: "sql" },
  }[filter];
}

export default function ResultTable({ selectedFilter }) {
  const dbArgs = getDatabaseArgsByFilter(selectedFilter);
  const { data } = useDatabaseQuery(dbArgs);

  console.log(data);

  return (
    <Table
      rowKey="id"
      columns={getColumns(
        [FILTER_GROUP_BY_STACK, FILTER_SHOW_DUPLICATE_SQL].includes(
          selectedFilter
        )
      )}
      pagination={{ position: ["topCenter", "bottomCenter"] }}
      dataSource={data}
    />
  );
}
