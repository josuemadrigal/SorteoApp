import * as React from 'react';
import {  createTheme, ThemeProvider } from '@mui/material/styles';

import Container from '@mui/material/Container';






const mdTheme = createTheme();

export const AppLayout =({children})=> {
  // const [open, setOpen] = React.useState(true);
  // const toggleDrawer = () => {
  //   setOpen(!open);
  // };

  return (
    <ThemeProvider theme={mdTheme}>
      <Container maxWidth={false} sx={{mt:0}}>
           {children}
        </Container>
     
    </ThemeProvider>
  );
}

