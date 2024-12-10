import React, { useEffect, useState } from 'react'
import { graphQLClient } from '../../utils/graphQLClient';
import { gql } from '@apollo/client';
import DataGridComponent from './DataGridComponent';
import { Typography } from '@mui/material';

export default function InvestorComponent() {
  const [results, setResults] = useState([])

  const QUERY = gql`
  query{
    getInvestors{
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
      setResults(res?.data?.getInvestors)
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
    { field: 'id', headerName: 'Investor ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'company', headerName: 'Investor Company', width: 200 },
    { field: 'timezone', headerName: 'Timezone', width: 150 },
  ];
  return (
    <React.Fragment>
      <Typography sx={{ py: 2, fontWeight: 700 }}>Investors:</Typography>
      <DataGridComponent rows={rows} columns={columns} pageSize={5} />
    </React.Fragment>
  )
}
