import React, { useEffect, useState } from 'react'
import { graphQLClient } from '../../utils/graphQLClient';
import { gql } from '@apollo/client';
import DataGridComponent from './DataGridComponent';
import { Typography } from '@mui/material';

export default function UserComponent() {
  const [results, setResults] = useState([])

  const QUERY = gql`
  query{
    users{
      id,
      firstName,
      lastName,
      email
  }
}
`

  useEffect(() => {
    graphQLClient.query({
      query: QUERY
    }).then(res => {
      setResults(res?.data?.users)
    }).catch(err => {
      console.error(err)
    })
  }, [results])

  const rows = results?.map((slot) => ({
    id: slot.id,
    firstName: slot?.firstName,
    lastName:slot?.lastName,
    email: slot.email
  }));

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'firstName', headerName: 'First Name', width: 200 },
    { field: 'lastName', headerName: 'Last Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
  ];
  return (
    <React.Fragment>
      <Typography sx={{ py: 2, fontWeight: 700 }}>Investors:</Typography>
      <DataGridComponent rows={rows} columns={columns} pageSize={5}  />
    </React.Fragment>
  )
}
