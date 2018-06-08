import React, { Component } from 'react';
import './App.css';
import ItemTable from './components/ItemTable/ItemTable';
import TableBuilder from './components/TableBuilder/TableBuilder'
class App extends Component {
  state = {
    past: [],
    future: [],
    tables: [{items:[]}],
    newTable: []
  }

  
  stateLogger = () => {
    // When a change happens, push old tables in state to past array.
    // Then, empty future, as it would no longer be a redo.
    const tableSnapshot = JSON.parse(JSON.stringify(this.state.tables));
    this.setState({past: [...this.state.past, tableSnapshot], future: []})
  }

  addRowHandler = (tableIndex) => {
    this.stateLogger();
    let updatedTables = this.state.tables.slice();
    updatedTables[tableIndex].items.push({name: '', cost: '', saved: false});
    this.setState({tables: updatedTables});
  }

  modifyItemHandler = (property, tableIndex, itemIndex, event) => {
    this.stateLogger();
    let updatedTables = this.state.tables.slice();
    updatedTables[tableIndex].items[itemIndex][property] = event.target.value;
    this.setState({tables: updatedTables});
  }

  undoHandler = () => {
    // We need to step back..
    // Then set our current state to that instance of the table set.
    // Protect users from themselves
    if (this.state.past.length < 1) {
      return
    }
    
    // Move back one.
    let past = this.state.past.slice();
    const tables = past.pop()

    // preserve present
    let future = this.state.future.slice()
    const futureRedoTable = this.state.tables.slice()
    future.splice(0, 0, futureRedoTable)
    
    // Apply
    this.setState({past, tables, future})
  }

  redoHandler = () => {
    // We need to step forward..
    // Then set our current state to that instance of the table set.

    // Protect users from themselves
    if (this.state.future.length < 1) {
      return
    }

    // Move forward one.
    let future = this.state.future.slice()
    const tables = future.shift()

    // preserve present
    let past = this.state.past.slice()
    const undoTable = this.state.tables.slice()
    past.push(undoTable)


    // Apply
    this.setState({past, tables, future});
  }

  rebuildTableHandler = () => {
    // grab a copy of the table
    const tableCopy = this.state.tables.slice()[0]

    this.setState({newTable: tableCopy})
  }

  saveRebuiltTableHandler = () => {
    this.stateLogger()
    let tableCopy = this.state.tables.slice()
    tableCopy[0].items = this.state.newTable.items.filter(item => item.saved)

    this.setState({tables: tableCopy, newTable: []})
  }

  modifySavedHanlder = (itemIndex) => {
    //grab copy of everything
    let updatedItems = this.state.newTable.items.slice()
    updatedItems[itemIndex].saved = !updatedItems[itemIndex].saved

    this.setState({newTable: {items: updatedItems}})
  }

  render() {
    const Tables = this.state.tables.map((table, tableIdx) => {
      console.log('[render] state:', this.state)
      return (
        <div key={tableIdx}>
          <ItemTable modifyItem={this.modifyItemHandler} logEvent={this.stateLogger} tableIndex={tableIdx} items={table.items}/>
          <button className="button" onClick={(e) => this.addRowHandler(tableIdx)} >Add new row</button>
        </div>
      )
    })
    return (
      <div className="App">
        <button
          className="button"
          onClick={this.undoHandler}
          disabled={this.state.past.length < 1}
          >Undo</button>
        <button 
          className="button"
          onClick={this.redoHandler} 
          disabled={this.state.future.length < 1}
          >Redo</button>
        {Tables}
        {this.state.newTable.items ? 
        ( 
          <div>
            <TableBuilder 
              items={this.state.newTable.items} 
              modify={this.modifySavedHanlder} 
              save={this.saveRebuiltTableHandler}/> 
            <button className="button" onClick={this.saveRebuiltTableHandler}>Save Table</button>
          </div>
        )
          : null
        }
        <button 
          className="button" 
          onClick={this.rebuildTableHandler}
          disabled={this.state.tables[0].items.length < 1}>Rebuild Table</button>
      </div>
    );
  }
}

export default App;