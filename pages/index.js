import React, {Component} from 'react';

import Workbook from '../components/workbook';

class WorkbookState extends Component {

    state = {
        tables: []
    };

    handleChange(tables) {
        this.setState({
            tables
        });
    };

    render() {
        const {tables} = this.state;
        return <Workbook tables={tables} onChange={(tables) => this.handleChange(tables)}/>
    }

}

export default () => (<WorkbookState/>)
