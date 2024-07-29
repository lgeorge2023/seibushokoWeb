import React, { useEffect, useState } from 'react';
import { NavbarNav } from '../navbar/Navbar';
import { HeaderMenu } from '../header/Header';
import { MantineProvider,Paper, AppShell } from '@mantine/core';
import classes from './Layout.module.css'

const Layout = ({ children, breadcrumbs }) => {
  const [padding, setPadding] = useState(0);
  const [isMobile,setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setPadding(-100);
        setIsMobile(true);
      } else {
        setPadding(15);
        setIsMobile(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    // <MantineProvider withNormalizeCSS>
      <AppShell
      className={classes.wrap}
      padding={padding}
      navbar={<NavbarNav isMobile={isMobile}/>}
      header={<HeaderMenu breadcrumbs={breadcrumbs}/>}

      >
        <Paper withBorder shadow="xl" p="md" style={{width:'100%'}} >
          {children}
        </Paper>
      </AppShell>    
      // </MantineProvider> 
  );
};

export default Layout;
