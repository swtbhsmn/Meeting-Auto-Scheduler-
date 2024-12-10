import React, { useEffect, useState } from 'react'
import { graphQLClient } from '../../utils/graphQLClient';
import { gql } from '@apollo/client';
import DataGridComponent from './DataGridComponent';
import { Typography } from '@mui/material';

export default function SelectionComponent() {
  
  const [results, setResults] = useState([])

  const QUERY = gql`
  query{
    getSelections{
    investor{
      name,
      company,
      timezone,
      availability{
      timezone
    }
    },
    portfolio{
      name,
      name,
      company,
      timezone,
      availability{
      timezone
    }
    }
  }
}
`

  useEffect(() => {
    graphQLClient.query({
      query: QUERY
    }).then(res => {
      setResults(res?.data?.getSelections)
    }).catch(err => {
      console.error(err)
    })
  }, [results])

  const rows = results?.map((slot,i) => ({
    id: i,
    investorName: slot?.investor?.name,
    investorCompany: slot?.investor?.company,
    investorTimezone: slot?.investor?.timezone,
    portfolioName: slot?.portfolio?.name,
    portfolioCompany:slot?.portfolio?.company,
    portfolioTimezone: slot?.portfolio?.timezone
  }));

  const columns = [
    { field: 'investorName', headerName: 'Investor Name', width: 200 },
    { field: 'investorCompany', headerName: 'Investor Company', width: 200 },
    { field: 'investorTimezone', headerName: 'Investor Timezone', width: 150 },
    { field: 'portfolioName', headerName: 'Portfolio Name', width: 200 },
    { field: 'portfolioCompany', headerName: 'Portfolio Company', width: 200 },
    { field: 'portfolioTimezone', headerName: 'Portfolio Timezone', width: 150 }
  ];
  return (
    <React.Fragment>
      <Typography sx={{ py: 2, fontWeight: 700 }}>Portfolio:</Typography>
      <DataGridComponent rows={rows} columns={columns} pageSize={5} />
    </React.Fragment>
  )
}
