import React, {Component} from 'react';
import PropTypes from 'prop-types';

const defaultTable = () => {
    return {
        cols: [
            {name: 'Column 1', data: null},
            {name: 'Column 2', data: null},
            {name: 'Column 3', data: null},
            {name: 'Column 4', data: null}
        ]
    };
};

class Table extends Component {

    constructor(props) {
        super(props);

        const {table} = this.props;
        table.addListener((...args) => {
            console.log('Table Component Listener', args);
            this.setState({
                id: table.getId(),
                name: table.getName(),
                columns: table.listColumns(),
                rowCount: table.getRowCount()
            });
        });

        this.state = {
            id: table.getId(),
            name: table.getName(),
            columns: table.listColumns(),
            rowCount: table.getRowCount()
        };

    }

    static propTypes = {
        table: PropTypes.object.isRequired
    };

    handleAddRow() {
        const {name, cols = defaultTable().cols, data = defaultTable().data, onChange} = this.props;
        data.push(cols.map(c => null));
        onChange({name, cols, data});
    }

    handleAddCol() {
        const {name, cols = defaultTable().cols, data = defaultTable().data, onChange} = this.props;
        cols.push({name: `Column ${cols.length + 1}`});
        data.forEach(row => {
            row.push(null);
        });
        onChange({name, cols, data});
    }

    render() {

        const {table} = this.props;
        const {id, name, columns, rowCount} = this.state;

        const columnCount = columns.length + 2; // num columns + rowIndex + add-column

        const dataRows = [];

        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            const rowCells = [];
            rowCells.push(<td key="index">{rowIndex + 1}</td>);
            columns.forEach((column, columnIndex) => {

                const handleCellKeyUp = (e) => {
                    const code = e.keyCode;
                    switch (code) {
                        case 37: // left
                            if (e.getModifierState('Control')) {
                                document.querySelector(`#C${(columns.length + columnIndex - 1) % columns.length}R${rowIndex}`).focus();
                            }
                            break;
                        case 38: // up
                            if (e.getModifierState('Control')) {
                                document.querySelector(`#C${columnIndex}R${(table.getRowCount() + rowIndex - 1) % table.getRowCount()}`).focus();
                            }
                            break;
                        case 39: // right
                            if (e.getModifierState('Control')) {
                                document.querySelector(`#C${(columnIndex + 1) % columns.length}R${rowIndex}`).focus();
                            }
                            break;
                        case 40: // down
                            if (e.getModifierState('Control')) {
                                document.querySelector(`#C${columnIndex}R${(rowIndex + 1) % table.getRowCount()}`).focus();
                            }
                            break;
                        case 13: // enter
                            if(e.getModifierState('Shift')) {
                                // move up
                                document.querySelector(`#C${columnIndex}R${(table.getRowCount() + rowIndex - 1) % table.getRowCount()}`).focus();
                            } else if (!e.getModifierState('Alt')) {
                                // move down
                                document.querySelector(`#C${columnIndex}R${(rowIndex + 1) % table.getRowCount()}`).focus();
                            }
                    }
                };

                rowCells.push(
                    <td key={column.getId()} onKeyUp={handleCellKeyUp}>
                        <input
                            id={`C${columnIndex}R${rowIndex}`}
                            type="text"
                            value={column.getRowValue(rowIndex) || ''}
                            onChange={(e) => column.setRowValue(rowIndex, e.target.value)}
                        />
                    </td>
                )
            });
            if (rowIndex === 0) {
                rowCells.push(
                    <td key="add-columns" className="add add-columns" rowSpan={rowCount}>
                        <a onClick={() => table.addColumn(`Column ${columns.length + 1}`)}>+</a>
                    </td>
                );
            }
            dataRows.push(<tr key={rowIndex}>{rowCells}</tr>);
        }

        return (
            <div>
                <style jsx>
                    {`
                      table {
                        border-collapse: collapse;
                      }
                      table, table td, table th {
                        border: 1px solid black;
                      }
                      table input {
                        border: none;
                        padding: 5px;
                        background: none;
                      }
                      .add a {
                        display: inline-block;
                        cursor: pointer;
                        margin: .1em;
                        background: steelblue;
                        color: white;
                        font-weight: bold;
                      }
                      .add-rows {
                        text-align: center;
                      }
                      .add-rows a {
                        padding: .25em 4em;
                      }
                      .add-columns a {
                        padding: 2em .25em;
                      }
                      thead, tfoot, tbody tr td:first-child, tbody tr:first-child td:last-child {
                        background: #ccc;
                      }
                      tbody tr td:first-child {
                        min-width: 2em;
                      }
                    `}
                </style>
                <h2>{name}</h2>
                <details>
                    <summary>Source</summary>
                    <div>
                        <textarea style={{width: '100%', minHeight: '10em'}} value={table.getSource().get()} onChange={(e) => table.setSource(e.target.value)} />
                        <button onClick={() => table.getSource().trySource()}>Try source</button>
                    </div>
                </details>
                <table>
                    <thead>
                    <tr>
                        {
                            [
                                <td key="emptyIndex"></td>,
                                ...columns.map(c => <th key={c.getName()}><input defaultValue={c.getName()}
                                                                                 type="text"/></th>),
                                <td key="emptyAddColume"></td>
                            ]
                        }
                    </tr>
                    <tr>
                        {
                            [
                                <td key="emptyIndex"></td>,
                                ...columns.map(c => <th key={c.getName()}><input value={c.getCode() || ''} onChange={(e) => c.setCode(e.target.value)}
                                                                                 type="text"/></th>),
                                <td key="emptyAddColume"></td>
                            ]
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        dataRows
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td className="add add-rows" colSpan={columnCount}>
                            <a onClick={() => table.addRow()}>+</a>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        );

    }

}

export default Table;
