import { useState } from "react";
import "./App.css";
import { useIndexedDB } from "./useIndexedDB";

function App() {
  const { getTimestampData, storeTimestampData } = useIndexedDB();
  const [message, setMessage] = useState<string | null>(null);
  const [data, setData] = useState<Object | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const handleStoreData = () => {
    const data = {
      id: 1, // Ensure the ID matches the keyPath in your IndexedDB
      value: inputValue,
    };
    storeTimestampData(data);
    setInputValue("");
  };

  const handleGetData = async () => {
    const result = await getTimestampData();
    if (typeof result === "string") {
      setMessage(result);
    }
    if (typeof result === "object") {
      setMessage(null);
      setData(result);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a value"
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
        }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button onClick={handleStoreData}>Store Data</button>
        <button onClick={handleGetData}>Get Data</button>
      </div>
      {message && <span>{message}</span>}
      {data && (
        <pre
          style={{
            overflow: "auto",
            maxHeight: "200px",
            width: "100%",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
