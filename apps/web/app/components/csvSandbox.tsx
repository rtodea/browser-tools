"use client";

import { CsvInput, useCsvInput } from "./csvReader";
import { TableViewer } from "./tableViewer";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { useState } from "react"; //Example style, you can use another

export const CsvSandbox = () => {
  const [tableData, setTableData] = useState({ headers: [], values: [] });
  const [finalTableData, setFinalTableData] = useState(null);

  const { onChange } = useCsvInput(setTableData);
  const [code, setCode] = useState(
    `[
    {
        "type": "rename_column",
        "column_to_rename": 0,
        "new_name": "lala"
    }
]`
  );

  const runSteps = () => {
    const steps = JSON.parse(code);
    console.log("steps: ", steps);
    steps.forEach((step) => {
      if (step.type === "rename_column") {
        const prevData = finalTableData ?? tableData;
        const newHeaders = [...prevData.headers];
        newHeaders[step.column_to_rename] = step.new_name;
        setFinalTableData({
          headers: newHeaders,
          values: prevData.values,
        });
      }
    });
  };

  return (
    <>
      <CsvInput onChange={onChange} />
      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => highlight(code, languages.json)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
      <br />
      <button onClick={runSteps}>Run steps</button>
      <br />
      <TableViewer headers={tableData.headers} values={tableData.values} />
      {finalTableData && (
        <TableViewer
          headers={finalTableData.headers}
          values={finalTableData.values}
        />
      )}
    </>
  );
};
