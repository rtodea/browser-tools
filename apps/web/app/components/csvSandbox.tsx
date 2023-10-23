"use client";

import { CsvInput, useCsvInput } from "./csvReader";
import { TableViewer } from "./tableViewer";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { useState } from "react"; //Example style, you can use another
import { z } from "zod";

const stepSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("rename_column_header"),
    column_to_rename: z.number(),
    new_name: z.string(),
  }),
  z.object({
    type: z.literal("remove_column"),
    column_to_remove: z.number(),
  }),
]);
const stepsSchema = z.array(stepSchema);

export const CsvSandbox = () => {
  const [tableData, setTableData] = useState({ headers: [], values: [] });
  const [finalTableData, setFinalTableData] = useState(null);
  const [schemaErrors, setSchemaErrors] = useState(null);
  const { onChange } = useCsvInput(setTableData);
  const [code, setCode] = useState(
    `[
    {
        "type": "rename_column_header",
        "column_to_rename": 0,
        "new_name": "lala"
    },
    {
        "type": "remove_column",
        "column_to_remove": 1
    }
]`
  );
  console.log({ tableData });
  console.log({ finalTableData });

  const runSteps = () => {
    const rawSteps = JSON.parse(code);
    const result = stepsSchema.safeParse(rawSteps);
    console.log({ result });
    if (result.success === false) {
      console.log(result.error.issues);
      setSchemaErrors(result.error);
    } else {
      setSchemaErrors(null);
      const steps = result.data;
      console.log("steps: ", steps);
      const processedData = steps.reduce((prevData, step) => {
        if (step.type === "rename_column_header") {
          const newHeaders = [...prevData.headers];
          newHeaders[step.column_to_rename] = step.new_name;
          return {
            headers: newHeaders,
            values: prevData.values,
          };
        } else if (step.type === "remove_column") {
          const newHeaders = prevData.headers.filter(
            (header, index) => index !== step.column_to_remove
          );
          const newValues = prevData.values.map((row) =>
            row.filter((value, index) => index !== step.column_to_remove)
          );
          return {
            headers: newHeaders,
            values: newValues,
          };
        }
      }, tableData);
      setFinalTableData(processedData);
    }
  };

  return (
    <>
      <CsvInput onChange={onChange} />
      <div style={{ display: "flex" }}>
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
        <div>
          {(schemaErrors?.issues ?? []).map((schemaError, index) => (
            <div key={index}>{JSON.stringify(schemaError)}</div>
          ))}
        </div>
      </div>

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
