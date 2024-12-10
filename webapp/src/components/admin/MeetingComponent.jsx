import React, { useEffect, useState } from 'react'
import { graphQLClient } from '../../utils/graphQLClient';
import { gql } from '@apollo/client';
import DataGridComponent from './DataGridComponent';
import { Typography } from '@mui/material';

export default function MeetingComponent() {
  const [meetings, setMeeting] = useState([])
  const GMS_QUERY = gql`
  query {
    getMeetingSchedule {
    id
    selectionId
    date
    startTime
    endTime
    duration
    selection {
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
  }
`;

  useEffect(() => {
    graphQLClient.query({
      query: GMS_QUERY
    }).then(res => {
      setMeeting(res?.data?.getMeetingSchedule)

    }).catch(err => {
      console.error(err)
    })
  }, [meetings])

  const rows = meetings?.map((meeting, i) => ({
    id: i,
    investorName: meeting.selection.investor.name,
    investorCompany: meeting.selection.investor.company,
    portfolioName: meeting.selection.portfolio.name,
    portfolioCompany: meeting.selection.portfolio.company,
    date: new Date(meeting.date).toLocaleDateString(),
    startTime: new Date(meeting.startTime).toLocaleTimeString(),
    endTime: new Date(meeting.endTime).toLocaleTimeString(),
    duration: meeting.duration
  }));
  const columns = [
    { field: 'investorName', headerName: 'Investor Name', width: 200 },
    { field: 'investorCompany', headerName: 'Investor Company', width: 200 },
    { field: 'portfolioName', headerName: 'Portfolio Name', width: 200 },
    { field: 'portfolioCompany', headerName: 'Portfolio Company', width: 200 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'startTime', headerName: 'Start Time', width: 150 },
    { field: 'endTime', headerName: 'End Time', width: 150 },
    { field: 'duration', headerName: 'Duration (mins)', width: 150 }
  ];
  return (
    <React.Fragment>
      <Typography sx={{ py: 2, fontWeight: 700 }}>Scheduled Meetings:</Typography>
      <DataGridComponent rows={rows} columns={columns} pageSize={5} />
    </React.Fragment>
  )
}
