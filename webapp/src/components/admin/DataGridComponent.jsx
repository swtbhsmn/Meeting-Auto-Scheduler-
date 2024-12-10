import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function DataGridComponent(props) {

  return (
    <div style={{ height: 400, width: 'auto' ,display:"flex", justifyContent:"center",alignItems:"center"}}>
      <DataGrid {...props} columnBufferPx={100} />
    </div>
  );
}
