import React, {Component} from 'react';
import Table from '../components/table';

class Workbook extends Component {

    render() {

        const {tables, onChange} = this.props;

        return (
            <div>
                <h1>Workbook</h1>
                <a onClick={() => onChange([...tables, {name: `Table ${tables.length + 1}`}])}>Add table</a>
                {
                    tables.map((t, index) => <Table key={t.name} {...t} onChange={(t) => onChange([...tables.slice(0,index), t, ...tables.slice(index+1)])}/>)
                }
            </div>
        );
    }

}

export default Workbook;
