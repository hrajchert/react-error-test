import React from 'react';
import './App.css';
import { Grid, createStyles, WithStyles, withStyles, AppBar, Toolbar, Typography, Theme } from '@material-ui/core';
import { UserList } from './components/userList';

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  }
});

type Props = WithStyles<typeof styles>;

export const App = withStyles(styles)(({classes}: Props) => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          User list
        </Typography>
      </Toolbar>
    </AppBar>
    <main className={classes.content}>
      <Grid container spacing={16} >
        <UserList/>
      </Grid>
    </main>
  </div>

));



