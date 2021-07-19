import { useState } from "react";
import ResultTable from "../components/ResultTable";
import ResultAnalytics from "../components/ResultAnalytics";
import { FILTER_DEFAULT } from "../lib/constants";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState(FILTER_DEFAULT);

  return (
    <div style={{ margin: "auto", textAlign: "center", marginTop: "1rem" }}>
      <ResultAnalytics
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <ResultTable selectedFilter={selectedFilter} />
    </div>
  );
}
