import {
  CopyOutlined,
  DatabaseOutlined,
  FieldTimeOutlined,
  FilterOutlined,
  ProfileOutlined,
  SortAscendingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Statistic } from "antd";
import {
  FILTER_DEFAULT,
  FILTER_GROUP_BY_STACK,
  FILTER_ORDERBY_WORST_SQL_EXEC,
  FILTER_SHOW_DUPLICATE_SQL,
} from "../lib/constants";
import { useDatabaseAnalyticsData } from "../lib/db";

const getCardStyle = (isActive) => ({
  borderTop: `5px solid ${isActive ? "black" : "lightgrey"}`,
  cursor: "pointer",
});

export default function ResultAnalytics({ selectedFilter, setSelectedFilter }) {
  const {
    groupedByStackSqlExecutions,
    duplicateQueriesLength,
    queriesLength,
    slowestExecutionTime,
  } = useDatabaseAnalyticsData();

  return (
    <Row gutter={16} style={{ margin: "2rem 0" }}>
      <Col span={6}>
        <Card
          onClick={() => setSelectedFilter(FILTER_DEFAULT)}
          style={getCardStyle(selectedFilter === FILTER_DEFAULT)}
          actions={[
            <Button
              key={FILTER_DEFAULT}
              icon={<UnorderedListOutlined />}
              type="link"
            >
              Show all
            </Button>,
          ]}
        >
          <Statistic
            title="Queries"
            value={queriesLength ?? 0}
            precision={0}
            prefix={<DatabaseOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card
          onClick={() => setSelectedFilter(FILTER_GROUP_BY_STACK)}
          style={getCardStyle(selectedFilter === FILTER_GROUP_BY_STACK)}
          actions={[
            <Button
              key={FILTER_GROUP_BY_STACK}
              icon={<FilterOutlined />}
              type="link"
            >
              Group by stack
            </Button>,
          ]}
        >
          <Statistic
            title="Worst number of calls by a unique stack"
            value={groupedByStackSqlExecutions ?? 0}
            precision={0}
            prefix={<ProfileOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card
          onClick={() => setSelectedFilter(FILTER_SHOW_DUPLICATE_SQL)}
          style={getCardStyle(selectedFilter === FILTER_SHOW_DUPLICATE_SQL)}
          actions={[
            <Button
              key={FILTER_SHOW_DUPLICATE_SQL}
              icon={<FilterOutlined />}
              type="link"
            >
              Group by SQL query
            </Button>,
          ]}
        >
          <Statistic
            title="Duplicate SQL queries"
            value={duplicateQueriesLength ?? 0}
            precision={0}
            prefix={<CopyOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card
          onClick={() => setSelectedFilter(FILTER_ORDERBY_WORST_SQL_EXEC)}
          style={getCardStyle(selectedFilter === FILTER_ORDERBY_WORST_SQL_EXEC)}
          actions={[
            <Button
              key={FILTER_ORDERBY_WORST_SQL_EXEC}
              icon={<SortAscendingOutlined />}
              type="link"
            >
              Order by worst execution
            </Button>,
          ]}
        >
          <Statistic
            title="Slowest SQL execution"
            value={slowestExecutionTime ?? 0}
            precision={2}
            prefix={<FieldTimeOutlined />}
            suffix="s"
          />
        </Card>
      </Col>
    </Row>
  );
}
