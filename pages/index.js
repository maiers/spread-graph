import React, {Component} from 'react';

import Workbook from '../components/workbook';
import TableEngine from "../components/table-engine";

class WorkbookState extends Component {

    constructor(props) {
        super(props);
        this.tables = new TableEngine();
    }

    render() {
        return <Workbook tableEngine={this.tables} />
    }

}

export default () => (<WorkbookState/>)
