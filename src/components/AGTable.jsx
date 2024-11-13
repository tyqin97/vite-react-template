import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional theme CSS
import { useState } from 'react';

export default function AGTable({ rowData, colDef, height="30vh", pageSize=5, filter=false, handleDataFrmChild=undefined }) {

    async function onSelectRows(event) {
        const selectedNodes = event.api.getSelectedNodes();
        const selectedIds = selectedNodes.map(node => node.data.ID);
        handleDataFrmChild(selectedIds)
    }

    return (
        <div className="ag-theme-quartz" style={{ height: height, width: '100%' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDef}
                defaultColDef={{ sortable: true, filter: filter, resizable: false }}
                enableCellTextSelection={true}
                pagination
                paginationPageSize={pageSize}
                paginationPageSizeSelector={[5,10,20]}
                rowSelection='multiple'
                onSelectionChanged={onSelectRows}
                // key={forceRefresh}
            />
        </div>
    );
};