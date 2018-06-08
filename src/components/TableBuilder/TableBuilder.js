import React from 'react';
import './TableBuilder.css';

export default (props) => {
  const TableRows = props.items.map((item, idx) => {
    return (
      <tr key={idx}>
        <td className="check">
          <input 
            className="checkbox" 
            type="checkbox"
            onChange={(e) => props.modify(idx)} 
            checked={item.saved}/>
        </td> 
        <td>{item.name}</td>
        <td>{item.cost}</td>
      </tr>
    )
  });
  return (
    <table className="item-table">
      <thead>
        <tr>
          <th>Saved?</th>
          <th>Item</th>
          <th>Cost per lb/kg</th>
        </tr>
      </thead>
      <tbody>
        {TableRows}
      </tbody>
    </table>
  );
}