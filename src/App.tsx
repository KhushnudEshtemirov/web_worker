import { useEffect, useRef, useState } from "react";

import { getCachePrime, cachePrime, deleteCache } from "./shared/utils/cache";

function App() {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<number | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const startWorker = async (target: number) => {
    setProgress(0);
    setResult(null);

    const cached = await getCachePrime(target);
    if (cached !== undefined) {
      console.log("✅ Loaded from IndexedDB");
      setResult(cached);
      setProgress(100);
      return;
    }

    if (workerRef.current) {
      setLoading(true);
      workerRef.current.postMessage(target);
    }
  };

  const clearCache = async (target: number) => {
    if (workerRef.current) {
      await deleteCache(target);
    }
  };

  useEffect(() => {
    // Initialize the worker
    workerRef.current = new Worker(
      new URL("./workers/primeWorker.js", import.meta.url)
    );

    // Listen for messages from the worker
    workerRef.current.onmessage = async (e) => {
      const { type, percent, value, input } = e.data;

      if (type === "progress") {
        setProgress(percent);
      }

      if (type === "result") {
        setLoading(false);
        setProgress(100);
        setResult(value);

        if (input && typeof input === "number") {
          console.log("💾 Caching to IndexedDB:", input);
          await cachePrime(input, value);
        }
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Prime Number Calculator</h1>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => startWorker(10000000)} disabled={loading}>
          {loading ? "Working..." : "Start Calculation"}
        </button>
        <button onClick={() => clearCache(10000000)}>Clear Cache</button>
      </div>

      {loading && (
        <div style={{ marginTop: 20 }}>
          <progress value={progress} max={100} />
          <p>Progress: {progress}%</p>
        </div>
      )}

      {result && <p>✅ The result is: {result}</p>}
    </div>
  );
}

export default App;
