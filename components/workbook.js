import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '../components/table';

class Workbook extends Component {

    constructor(props) {
        super(props);

        const {tableEngine} = this.props;
        tableEngine.addListener(() => {
            this.setState({
                tables: tableEngine.listTables()
            });
        });

    }

    state = {
        tables: []
    };

    static propTypes = {
        tableEngine: PropTypes.object.isRequired
    };

    render() {

        const {tableEngine} = this.props;
        const {tables} = this.state;

        return (
            <div>
                <h1>Workbook</h1>
                <a onClick={() => tableEngine.addTable(`Table ${tables.length + 1}`)}>Add table</a>
                {
                    tables.map((t, index) => {
                        return (
                            <Table key={t.name} table={t}/>
                        );
                    })
                }
            </div>
        );
    }

}

export default Workbook;
