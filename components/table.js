import React, {Component} from 'react';

class Table extends Component {

    handleAddRow() {
        const {name, cols = [{name: 'Column 1'}], data = [[null]], onChange} = this.props;
        data.push(cols.map(c => null));
        onChange({name, cols, data});
    }

    handleAddCol() {
        const {name, cols = [{name: 'Column 1'}], data = [[null]], onChange} = this.props;
        cols.push({name: `Column ${cols.length + 1}`});
        data.forEach(row => {
            row.push(null);
        });
        onChange({name, cols, data});
    }

    render() {

        const {name, cols = [{name: 'Column 1'}], data = [[null]]} = this.props;

        const columnCount = cols.length + 2; // num columns + rowIndex + add-column

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
                <table>
                    <thead>
                    <tr>
                        {
                            [
                                <td></td>,
                                ...cols.map(c => <th key={c.name}><input defaultValue={c.name} type="text"/></th>),
                                <td></td>
                            ]
                        }
                    </tr>
                    <tr>
                        {
                            [
                                <td></td>,
                                ...cols.map(c => <th key={c.name}><input defaultValue={c.code} type="text"/></th>),
                                <td></td>
                            ]
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((row, rowIndex) => {

                            let dataCells = row.map((col, colIndex) => {
                                return (
                                    <td key={`C${colIndex}R${rowIndex}`}><input defaultValue={col} type="text"/></td>);
                            });
                            const cells = [<td>{rowIndex + 1}</td>, ...dataCells];

                            if (rowIndex === 0) {
                                cells.push(<td key="add-columns" className="add add-columns" rowSpan={data.length}><a
                                    onClick={() => this.handleAddCol()}>+</a></td>)
                            }

                            return (
                                <tr key={`R${rowIndex}`}>
                                    {
                                        cells
                                    }
                                </tr>
                            );
                        })
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td className="add add-rows" colSpan={columnCount}>
                            <a onClick={() => this.handleAddRow()}>+</a>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        );

    }

}

export default Table;
