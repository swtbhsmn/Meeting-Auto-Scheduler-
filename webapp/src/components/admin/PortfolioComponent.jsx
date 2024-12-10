import React, { useEffect, useState } from 'react'
import { graphQLClient } from '../../utils/graphQLClient';
import { gql } from '@apollo/client';
import DataGridComponent from './DataGridComponent';
import { Typography } from '@mui/material';

export default function PortfolioCompanyComponent() {
  
  const [results, setResults] = useState([])

  const QUERY = gql`
  query{
    getPortfolioCompanys{
      id,
      name,
      company,
      timezone
  }
}
`

  useEffect(() => {
    graphQLClient.query({
      query: QUERY
    }).then(res => {
      setResults(res?.data?.getPortfolioCompanys)
    }).catch(err => {
      console.error(err)
    })
  }, [results])

  const rows = results?.map((slot) => ({
    id: slot.id,
    name: slot?.name,
    company:slot?.company,
    timezone: slot.timezone
  }));

  const columns = [
 
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'company', headerName: 'Portfolio Company', width: 200 },
    { field: 'timezone', headerName: 'Timezone', width: 150 },
  ];
  return (
    <React.Fragment>
      <Typography sx={{ py: 2, fontWeight: 700 }}>Portfolio:</Typography>
      <DataGridComponent rows={rows} columns={columns} pageSize={5} />
    </React.Fragment>
  )
}
