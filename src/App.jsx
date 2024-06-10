import { useEffect, useState } from 'react';
import { createClient } from 'urql';
import './App.css';

function App() {
  const [data, setData] = useState({ memories: [], cards: [] });

  const QueryURL = "https://gateway-arbitrum.network.thegraph.com/api/7c32eeca7362e6dcc1082fdd50d110ab/subgraphs/id/87An96jqtMnjECXDRiDurerKpJRDtxCD69Ccb3xZmox4";

  const client = createClient({
    url: QueryURL
  });

  const query = `{
    memories(first: 5) {
      id
      txHash
      blockTimestamp
      name
      endTime
      fuelUsed
      merkleRoot
    }
    cards(first: 5) {
      id
      txHash
      blockTimestamp
      memory {
        id
      }
      claimed
    }
  }`;

  useEffect(() => {
    const fetchData = async () => {
      const result = await client.query(query).toPromise();
      setData(result.data);
    };
    fetchData();
  }, [client]);

  return (
    <div>
      <h1>Memories and Cards Information</h1>
      
      <h2>Memories</h2>
      {data.memories.length > 0 && data.memories.map(memory => (
        <div key={memory.id} className="memory">
          <div>ID: {memory.id}</div>
          <div>Transaction Hash: {memory.txHash}</div>
          <div>Block Timestamp: {new Date(memory.blockTimestamp * 1000).toLocaleString()}</div>
          <div>Name: {memory.name}</div>
          <div>End Time: {new Date(memory.endTime * 1000).toLocaleString()}</div>
          <div>Fuel Used: {memory.fuelUsed}</div>
          <div>Merkle Root: {memory.merkleRoot}</div>
        </div>
      ))}

      <h2>Cards</h2>
      {data.cards.length > 0 && data.cards.map(card => (
        <div key={card.id} className="card">
          <div>ID: {card.id}</div>
          <div>Transaction Hash: {card.txHash}</div>
          <div>Block Timestamp: {new Date(card.blockTimestamp * 1000).toLocaleString()}</div>
          <div>Memory ID: {card.memory.id}</div>
          <div>Claimed: {card.claimed.toString()}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
