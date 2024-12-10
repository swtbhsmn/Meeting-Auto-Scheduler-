import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { SitemarkIcon } from './CustomIcons';
import { AppContext } from '../../contexts/AppContext';

import { USER } from '../../utils/actionType';
import { isTokenValid } from '../../utils/jwt';

const client = new ApolloClient({
    uri: `${import.meta.env.VITE_SERVER_URL}/api`, // Replace with your endpoint
    cache: new InMemoryCache(),
});

const LOGIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
            message
        }
    }
`;

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function SignInCard() {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const { state, dispatch } = useContext(AppContext);
    const navigate = useNavigate();

    const validateInputs = () => {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        let isValid = true;

        if (!emailInput.value || !/\S+@\S+\.\S+/.test(emailInput.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!passwordInput.value || passwordInput.value.length < 4) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 4 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        client.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
                username: formData.get('email'),
                password: formData.get('password')
            },
        }).then(response => {
            localStorage.setItem("web-app-storage", JSON.stringify(response.data?.login))
            dispatch({
                type: USER,
                payload: {
                    data: {...response.data?.login,claims:isTokenValid(response.data?.login?.token)?.payload},
                    isAuthenticated: true,
                },
            });
            !(isTokenValid(response.data?.login?.token)?.payload?.role === "ADMIN") ? navigate('/home') : navigate('/admin')
        }).catch(err => {
            console.error(err)
        })
    };

    useEffect(() => {
        if (state?.user?.isAuthenticated) {
            (state?.user?.data?.claims?.role) === "ADMIN" ? navigate('/admin') : navigate("")
        }
    }, []);

    return (
        <Card variant="outlined">
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <SitemarkIcon />
            </Box>
            <Box sx={{ py: 5 }} />
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Sign in
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <TextField
                        label="Email"
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={emailError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Password"
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="****"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>
                <Button type="submit" fullWidth variant="contained" sx={{ py: 2 }}>
                    Sign in
                </Button>
                <Box sx={{ py: 5 }} />
            </Box>
        </Card>
    );
}
