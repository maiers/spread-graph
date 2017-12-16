import fetch from 'isomorphic-fetch';

/**
 * @typedef {object} column
 * @property {string} name
 * @property {string} code
 * @property {*[]} data
 */

/**
 * @typedef {object} table
 * @property {string} name
 * @property {column[]} columns
 * @property {number} rowCount
 */

class IdGenerator {

    current = 0;

    next() {
        return this.current++;
    }

}

const idGenerator = new IdGenerator();

class Listenable {

    listener = [];

    addListener(listener) {
        this.listener.push(listener);
        return this;
    }

    removeListener(listener) {
        this.listener = this.listener.filter(l => l !== listener);
        return this;
    }

    fire(...args) {
        console.log('fire', this, args);
        this.listener.forEach(l => l(this, ...args));
        return this;
    }

}

class Column extends Listenable {

    constructor(name, calculator) {
        super();
        this.id = idGenerator.next();
        this.name = name;
        this.calculator = calculator;
        this.rows = null;
        this.code = null;
    }

    getId() {
        return this.id;
    }

    setName(name) {
        this.name = name;
        this.fire('setName', name);
    }

    getName() {
        return this.name;
    }

    setCode(code) {
        this.code = code;
        this.rows = null;
        this.fire('setCode', code);
    }

    getCode() {
        return this.code;
    }

    setRowValue(rowIndex, value) {
        if (this.rows === null) {
            this.code = null;
            this.rows = new Array(rowIndex + 1);
        }
        this.rows[rowIndex] = value;
        this.fire('setRowValue', rowIndex, value);
    }

    getRowValue(rowIndex) {
        if (this.code !== null) {
            return this.calculator(this.code, rowIndex);
        }
        if (this.rows !== null) {
            return this.rows[rowIndex] || null;
        }
        return null;
    }

}

const checkIsJson = (text) => {
    try {
        JSON.parse(text);
        return true;
    } catch (e) {
        return false;
    }
};

class Source extends Listenable {

    constructor(text) {
        super();
        this.text = text;
    }

    trySource() {

        const isUrl = /^https?:\/\/[^.]+\.[^.]+/.test(this.text);

        if (isUrl) {
            fetch(this.text, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            }).then(response => {
                console.log(response);
            });

            return;

        }

        const isJson = checkIsJson(this.text);

        if (isJson) {
            const parsed = JSON.parse(this.text);
            if (Array.isArray(parsed)) {
                parsed.forEach(row => {

                })
            }
        }

    }

    get() {
        return this.text;
    }

}

const calculator = (code, rowIndex) => {

    try {
        return eval(code);
    } catch(e) {
        return null;
    }

    return 'code@' + rowIndex;
};

class Table extends Listenable {

    constructor(name) {
        super();
        this.id = idGenerator.next();
        this.name = name;
        this.source = new Source();
        this.calculator = calculator;
        this.columns = [
            new Column('Column 0', this.calculator).addListener((column) => this.fire('columnUpdate', column.id)),
            new Column('Column 1', this.calculator).addListener((column) => this.fire('columnUpdate', column.id)),
            new Column('Column 2', this.calculator).addListener((column) => this.fire('columnUpdate', column.id))
        ];
        this.rowCount = 4;
        this.columnCount = 3;
    }

    getId() {
        return this.id;
    }

    setName(name) {
        this.name = name;
        this.fire('setName', this.name);
    }

    getName() {
        return this.name;
    }

    setSource(source) {
        this.source = new Source(source);
        this.fire('setSource', this.source);
    }

    getSource() {
        return this.source;
    }

    addColumn(name, index = this.columnCount) {
        const newColumn = new Column(name, this.calculator);
        newColumn.addListener(() => this.fire('columnUpdate', newColumn.id));
        this.columns.splice(index, 0, newColumn);
        this.columnCount = this.columns.length;
        this.fire('addColumn', newColumn);
    }

    removeColumn(columnId) {
        this.columns = this.columns.filter(c => c.id !== columnId);
        this.fire('removeColumn', columnId);
    }

    listColumns() {
        return [...this.columns];
    }

    addRow(index, count = 1) {
        if (typeof index === 'number' && index < this.rowCount) {
            // add the row to all columns by shifting they row data by $count at the specified $index
        }
        this.rowCount += count;
    }

    getRowCount() {
        return this.rowCount;
    }

}

class TableEngine extends Listenable {

    tables = new Map();

    getTable = (tableId) => {
        return this.tables.get(tableId);
    };

    addTable(name) {
        const newTable = new Table(name);
        newTable.addListener((...args) => {
            console.log('table listener', newTable, args);
        });
        this.tables.set(newTable.getId(), newTable);
        this.fire('table added', newTable);
        return newTable;
    }

    removeTable(tableId) {
        this.tables.delete(tableId);
        this.fire('table removed', tableId);
    }

    listTables() {
        return Array.from(this.tables.values());
    }

}

export default TableEngine;
