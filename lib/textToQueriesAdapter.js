import { has } from "lodash";
import { v4 as uuidv4 } from "uuid";

export default function textToQueriesAdapter(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(
      "textToQueriesAdapter: the clipboard content is not a valid JSON."
    );
  }

  if (!has(data, "extensions.queryLog.queries")) {
    throw new Error(
      "textToQueriesAdapter: `data.extensions.queryLog.queries` not found in the clipboard content"
    );
  }

  return data.extensions.queryLog.queries.map((item) => ({
    ...item,
    id: uuidv4(),
  }));
}
