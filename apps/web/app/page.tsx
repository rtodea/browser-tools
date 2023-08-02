import { Header } from "ui";
import { CsvSandbox } from "./components/csvSandbox";

export default function Page() {
  return (
    <>
      <Header text="CSV Reader" />

      <CsvSandbox />
    </>
  );
}
