import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional theme CSS
import { useState } from 'react';

export default function AGTable({ rowData, colDef }) {

    return (
        <div className="ag-theme-quartz" style={{ height: '65vh', width: '100%' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDef}
                defaultColDef={{ sortable: true, filter: false, resizable: false }}
                enableCellTextSelection={true}
                pagination
                paginationPageSize={10}
                paginationPageSizeSelector={[5,10,20]}
            />
        </div>
    );
};