import { useState, useEffect } from 'react';
import { TextField, 
  Button, 
  Box, 
  Paper, 
  Grid, 
  InputAdornment, 
  IconButton, 
  Typography 
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import MyLogo from "../assets/my-logo.png";
import ApiCall from "./ApiCall";
import MainLogo from "../assets/new-born.jpg";
import EmailIcon from '@mui/icons-material/Email';

const LoginPage = () => {
const { http, setToken } = ApiCall();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [emptyUsername, setEmptyUsername] = useState(null);
  const [emptyPassword, setEmptyPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitTrigger, setSubmitTrigger] = useState(false);

  const handleLogin = () => {
    setError(null);
    setSubmitTrigger(!submitTrigger);
    http.post('/auth/login', { email: username, password: password })
      .then((res) => {        
        setToken(res.data.user, res.data.access_token);
      })
      .catch((e) => {
        if (e?.response?.data?.errors?.email?.length > 0) {
          setEmptyUsername(e?.response?.data?.errors?.email[0]);
        }

        if (e?.response?.data?.errors?.password?.length > 0) {
          setEmptyPassword(e?.response?.data?.errors?.password[0])
        }

        if (e.response?.status === 401) {
          setError(e.response?.data?.message);
        } else {
          setError("An error occurred. Please try again later.");
        }
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (username !== null) {
      setEmptyUsername(null)
    }

    if (password !== null) {
      setEmptyPassword(null)
    }
  }, [password, username])

  return (
    <div className='flex items-center justify-center'>

      <div className='hidden xl:block text-left'>
        <Box sx={{ width:"60%" }} component="img" className="w-full" src={MainLogo} alt="Banner" />
        <Typography variant='h6' lineHeight={2}>Where Every Coo and Goo Gets its Own Digital Crib! <br/> Welcome to a World of Tiny Footprints and Big Smiles.</Typography>
      </div>
      <div>
        <Paper 
          elevation={3} 
          style={{ 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            marginTop:"4rem",
            paddingBottom:"3rem"
          }}
          >
              <Box
                  component="img"
                  className='h-24'
                  alt="my logo."
                  src={MyLogo}
                  
              />
              {!emptyUsername && !emptyPassword && submitTrigger && (
                <div className='text-start'>
                  {<p style={{ color: "#BD271E" }}>{error}</p>} 
                </div>
              )}
          <form>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Email Address"
                  fullWidth
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value === '' ? null : e.target.value);
                    setSubmitTrigger(false);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <div className='text-start'>
                  {<p style={{ color: "#BD271E" }}>{emptyUsername}</p>} 
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value === '' ? null : e.target.value);
                    setSubmitTrigger(false);
                  }}
                  InputProps={{
                   
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className='text-start'>
                  {<p style={{ color: "#BD271E" }}>{emptyPassword}</p>} 
                </div>
              </Grid>
            </Grid>            
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              style={{ marginTop: 50 }}
            >
              Login
            </Button>
            <div className='flex justify-between'>
              <Typography sx={{ marginTop: "20px"}}>
              
                  <a href='/register' style={{ color: '#3b82f6', alignSelf: "self-start" }}>
                    Sign Up
                  </a>
              </Typography>
              <Typography sx={{ marginTop: "20px" }}>
                  <a href='/forgot-password' style={{ color: '#3b82f6', alignSelf: "end" }}>
                    Forgot Password?
                  </a>
              </Typography>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default LoginPage;
