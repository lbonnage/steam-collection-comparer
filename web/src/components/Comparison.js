import React from 'react';
import { useTable, useSortBy } from 'react-table';
import './Comparison.css';


function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    )

    // We don't want to render all 2000 rows for this example, so cap
    // it at 20 for this use case
    // const firstPageRows = rows.slice(0, 20)
    const firstPageRows = rows;

    return (
        <>
            <table {...getTableProps()} className="Comparison" >
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th {...column.getHeaderProps(column.getSortByToggleProps())} className="Comparison-header">
                                {column.render('Header')}
                                {/* Add a sort direction indicator */}
                                <span>
                    {column.isSorted
                        ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                        : ''}
                  </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {firstPageRows.map(
                    (row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className="Comparison-row">
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()} className="Comparison-row-cell">{cell.render('Cell')}</td>
                                    )
                                })}
                            </tr>
                        )}
                )}
                </tbody>
            </table>
            <br />
            {/*<div>Showing the first 20 results of {rows.length} rows</div>*/}
        </>
    )
}

export default function Comparison(props) {

    const columns = React.useMemo(
        () => {
            var arr = props.collectionIds.map((id) => {
                return {
                    Header: <a href={"https://steamcommunity.com/sharedfiles/filedetails/?id=" + id}>{props.results["file_information"][id]["title"]}</a>,
                    accessor: id
                }
            });

            var newArr = [{Header: "File name", accessor: "name"}, ...arr]
            return newArr;
        },
        []
    );

    const data = React.useMemo(
        () => {
            return Object.entries(props.results["comparison"]).map(file => {
                const key = file[0];
                const value = file[1];

                var obj = {name: <a href={"https://steamcommunity.com/sharedfiles/filedetails/?id=" + key}>{props.results["file_information"][key]["title"]}</a>};

                for (var i = 0; i < props.collectionIds.length; i++) {
                    var id = props.collectionIds[i];

                    obj[id.toString()] = value[id] ? '\u2713' : "\u00d7";
                }

                return obj;
            })
        },
        []
    );

    // console.log(props.results);
    // console.log(props.collectionIds);
    console.log(columns);
    console.log(data);

    return (
        <>
            <div>Hold "shift" while clicking column names to sort by multiple columns.</div>
            <Table columns={columns} data={data} />
        </>
    )

}