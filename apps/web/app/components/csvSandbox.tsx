"use client"


import {CsvInput, useCsvInput} from "./csvReader";
import {TableViewer} from "./tableViewer";

export const CsvSandbox = () => {

  const {onChange, tableRows, tableValues} = useCsvInput();
  return <><CsvInput onChange={onChange}/>
    <br/>
    <br/>
    <TableViewer tableRows={tableRows} tableValues={tableValues}/></>
}