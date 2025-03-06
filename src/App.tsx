import { Chart } from "./components/Chart";
import { useFetchPokemonData } from "././hooks/useFetchPokemonData";
import { ErrorMessage } from "././components/ErrorMessage";
import LoaderComponent from "././components/LoaderComponent";

import "./styles.css";

export interface DataItem {
  name: string;
  value: number;
}

const dimensions = {
  width: 500,
  height: 350,
  margins: { top: 20, left: 90, right: 15, bottom: 35 },
};

export default function App() {
  const { data, loading, error } = useFetchPokemonData();

  const getFieldAccessor = (field: string) => (d: { [key: string]: any }) =>
    d[field];

  const xAccessor = getFieldAccessor("value");
  const yAccessor = getFieldAccessor("name");

  const isDataReady = !loading && !error && data && data.length > 0;

  return (
    <div>
      {loading && <LoaderComponent />}
      {error && <ErrorMessage />}
      {isDataReady && (
        <Chart
          data={data}
          dimensions={dimensions}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
        />
      )}
    </div>
  );
}
