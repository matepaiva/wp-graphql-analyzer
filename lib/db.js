import { chain, get } from "lodash";
import { createContext, useContext, useEffect, useState } from "react";
import { LOCAL_STORAGE_DATABASE_KEY } from "./constants";
import useLocalStorage from "./useLocalStorage";

const Context = createContext();

const getListItemPropByGroupBy = (groupBy) =>
  ({ stack: "sql", sql: "stack" }[groupBy]);

const createMapGroupedQueriesToAnalyticsData = (groupBy) => (queryList) =>
  queryList.reduce(
    (acc, item) => {
      const listItem = item[getListItemPropByGroupBy(groupBy)];
      acc.id = item[groupBy];
      acc.stack = item[groupBy];
      acc.totalTime += item.time;
      acc.maxTime = Math.max(acc.maxTime, item.time);
      acc.list.push(listItem);
      if (acc.maxTime === item.time) acc.maxExecutionCode = listItem;
      return acc;
    },
    {
      [groupBy]: "",
      totalTime: 0,
      maxTime: 0,
      maxExecutionCode: "",
      list: [],
    }
  );

export function useDatabaseAnalyticsData() {
  const { data } = useDatabaseQuery();
  const { data: groupedByStackData } = useDatabaseQuery({
    groupBy: "stack",
    orderBy: [
      ["time", "list.length"],
      ["desc", "desc"],
    ],
  });

  const { data: groupedBySQLData } = useDatabaseQuery({
    groupBy: "sql",
    orderBy: [
      ["time", "list.length"],
      ["desc", "desc"],
    ],
  });

  return {
    queriesLength: data.length,
    slowestExecutionTime: get(data, "[0].time"),
    groupedByStackSqlExecutions: get(groupedByStackData, "[0].list.length"),
    duplicateQueriesLength: get(groupedBySQLData, "[0].list.length"),
  };
}

export function useDatabaseQuery({ groupBy, orderBy, pageSize } = {}) {
  const { queries } = useContext(Context);

  let query = chain(queries);

  if (orderBy) query = query.orderBy(...orderBy);
  if (groupBy) {
    query = query
      .groupBy(groupBy)
      .values()
      .map(createMapGroupedQueriesToAnalyticsData(groupBy));
  }
  if (orderBy) query = query.orderBy(...orderBy);
  if (pageSize) query = query.slice(0, pageSize);

  const data = query.value();

  return { data };
}

export function useDatabaseSave() {
  const { setQueries } = useContext(Context);

  return setQueries;
}

export function DatabaseProvider({
  children,
  key = LOCAL_STORAGE_DATABASE_KEY,
}) {
  const [state, setState] = useState([]);
  const [queries, setQueries] = useLocalStorage(key);

  useEffect(() => {
    setState(queries);
  }, [queries]);

  useEffect;

  return (
    <Context.Provider value={{ queries: state ?? [], setQueries }}>
      {children}
    </Context.Provider>
  );
}
