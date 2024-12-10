import { Grid2 ,Box,Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import CardView from './CardView'
export default function GridView() {

    const [stats,setStats] = useState([])
    const client = new ApolloClient({
        uri: `${import.meta.env.VITE_SERVER_URL}/api`, // Replace with your endpoint
        cache: new InMemoryCache(),
    });
    
    const STATS_QUERY = gql`
    query {
      getTotalCounts {
        title
        value
        interval
        trend
      }
    }
  `;

    useEffect(()=>{
        client.query({
            query: STATS_QUERY
        }).then(res=>{
            setStats(res?.data?.getTotalCounts)
        })
    },[])

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Grid2
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >
                {stats?.map((card, index) => (
                    <Grid2 key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                        <CardView {...card} />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    )
}
