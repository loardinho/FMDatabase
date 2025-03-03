
import React, { useState } from "react";

function ImportExport() {

  const [customers, setCustomers] = useState([
    { id: 1, business_name: "Al Inc", status: "Active", address: "Oslo, Norway" },
    { id: 2, business_name: "Tech", status: "Pending", address: "Bergen, Norway" },
  ]);

  // export csv
  const handleExport = () => {
    if (!customers.length) return;

    //  CSV string making
    const headers = Object.keys(customers[0]);
    const csvRows = [headers.join(",")];

    customers.forEach((obj) => {
      const row = headers.map((header) => `"${obj[header] || ""}"`);
      csvRows.push(row.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Make en lenke også to download
    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";
    link.click();
  };

  // CSV importttt
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvString = event.target.result;
      const lines = csvString.split("\n").map((line) => line.trim()).filter(Boolean);
      const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
      const importedData = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",");
        if (row.length === headers.length) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j].replace(/"/g, "").trim();
          }
          importedData.push(obj);
        }
      }

      
      setCustomers([...customers, ...importedData]);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Import / Export</h2>

      <button onClick={handleExport}>Export CSV</button>
      <br />
      <br />

      <input type="file" accept=".csv" onChange={handleImport} />
      <p>(Select a .csv file to import)</p>

      <hr />

      <h3>Current Data</h3>
      <pre>{JSON.stringify(customers, null, 2)}</pre>
    </div>
  );
}

export default ImportExport;
