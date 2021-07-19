import { chain } from "lodash";
import { createContext, useContext, useEffect, useState } from "react";
import { LOCAL_STORAGE_DATABASE_KEY } from "./constants";
import useLocalStorage from "./useLocalStorage";

const Context = createContext();

function mapGroupedQueriesToAnalyticsData(queryList) {
  return queryList.reduce(
    (acc, item) => {
      acc.id = item.stack;
      acc.stack = item.stack;
      acc.totalTime += item.time;
      acc.maxTime = Math.max(acc.maxTime, item.time);
      acc.sqlList.push(item.sql);

      if (acc.maxTime === item.time) acc.maxSql = item.sql;

      return acc;
    },
    {
      stack: "",
      totalTime: 0,
      maxTime: 0,
      maxSql: "",
      sqlList: [],
    }
  );
}

export function useDatabaseQuery({ groupBy, orderBy, pageSize } = {}) {
  const { queries } = useContext(Context);

  let query = chain(queries);

  if (orderBy) query = query.orderBy(...orderBy);
  if (groupBy) {
    query = query
      .groupBy(groupBy)
      .values()
      .map(mapGroupedQueriesToAnalyticsData);
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
