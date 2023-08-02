"use client"

import { useState } from "react";
import Papa from "papaparse";

export const useCsvInput = () => {
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [tableValues, setTableValues] = useState([]);

  const onChange = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setTableValues(valuesArray);
      },
    });
  };


  return {
    onChange,
    tableRows,
    tableValues,
  }
}

export const CsvInput = ({onChange}) => {
  return <input
    type="file"
    name="file"
    onChange={onChange}
    accept=".csv"
    style={{display: "block", margin: "10px auto"}}
  />
}