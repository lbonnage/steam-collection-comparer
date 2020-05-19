import React from 'react';
import { useTable, useSortBy } from 'react-table'


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
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
                    Header: props.results["file_information"][id]["title"],
                    accessor: id
                }
            });

            var newArr = [{Header: "File name", accessor: "name"}, ...arr]
            return newArr;
        }
    );

    const data = React.useMemo(
        () => {
            return Object.entries(props.results["comparison"]).map(file => {
                const key = file[0];
                const value = file[1];

                var obj = {name: props.results["file_information"][key]["title"]};

                for (var i = 0; i < props.collectionIds.length; i++) {
                    var id = props.collectionIds[i];

                    obj[id.toString()] = value[id] ? '\u2713' : "\u00d7";
                }

                return obj;
            })
        }
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

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })

    console.log("rows" + rows);

    return (
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th
                            {...column.getHeaderProps()}
                            style={{
                                borderBottom: 'solid 3px red',
                                background: 'aliceblue',
                                color: 'black',
                                fontWeight: 'bold',
                            }}
                        >
                            {column.render('Header')}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        padding: '10px',
                                        border: 'solid 1px gray',
                                        background: 'papayawhip',
                                    }}
                                >
                                    {cell.render('Cell')}
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )

}