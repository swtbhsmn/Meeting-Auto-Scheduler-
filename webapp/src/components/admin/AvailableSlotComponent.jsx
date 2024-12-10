import React, { useEffect, useState } from 'react'
import { graphQLClient } from '../../utils/graphQLClient';
import { gql } from '@apollo/client';
import DataGridComponent from './DataGridComponent';
import { Typography } from '@mui/material';

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


export default function AvailableSlotComponent() {
  const [availableSlots, setAvailableSlots] = useState([])

  const A_SLOTS = gql`
query{
  getAvailability{
    id
    investorId
    portfolioId
    timezone
    date
    startTime
    endTime
    investor {
      name
      company
    }
    portfolio {
      name
      company
    }
  }
}
`

  useEffect(() => {
    graphQLClient.query({
      query: A_SLOTS
    }).then(res => {
      setAvailableSlots(res?.data?.getAvailability)

    }).catch(err => {
      console.error(err)
    })
  }, [availableSlots])

  const available_rows = availableSlots?.map((slot) => ({
    id: slot.id,
    date: new Date(slot.date).toLocaleDateString(),
    startTime: formatTime(slot.startTime),
    endTime: formatTime(slot.endTime),
    timezone: slot.timezone,
  }));

  const available_columns = [
    { field: 'id', headerName: 'Slot ID', width: 150 },
    { field: 'date', headerName: 'Date', width: 180 },
    { field: 'startTime', headerName: 'Start Time', width: 180 },
    { field: 'endTime', headerName: 'End Time', width: 180 },
    { field: 'timezone', headerName: 'Timezone', width: 150 },
  ];

  return (
    <React.Fragment>
      <Typography sx={{ py: 2, fontWeight: 700 }}>Available Slots:</Typography>
      <DataGridComponent rows={available_rows} columns={available_columns} pageSize={5} />
    </React.Fragment>
  )
}
