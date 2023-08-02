"use client"

export const TableViewer = ({tableRows, tableValues}) => {
  return <table>
    <thead>
    <tr>
      {tableRows.map((rows, index) => {
        return <th key={index}>{rows}</th>;
      })}
    </tr>
    </thead>
    <tbody>
    {tableValues.map((value, index) => {
      return (
        <tr key={index}>
          {value.map((val, i) => {
            return <td key={i}>{val}</td>;
          })}
        </tr>
      );
    })}
    </tbody>
  </table>
}