import React from 'react';
import './ItemTable.css'

export default (props) => {
  const TableRows = props.items.map((item, idx) => {
    return (
      <tr key={idx}> 
        <td><input onChange={(e) => props.modifyItem('name', props.tableIndex, idx, e)} value={item.name}/></td>
        <td><input onChange={(e) => props.modifyItem('cost', props.tableIndex, idx, e)} value={item.cost}/></td>
      </tr>
    )
  });
  return (
    <table className="item-table">
      <thead>
        <tr>
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