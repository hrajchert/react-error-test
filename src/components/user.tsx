import * as React from 'react';
import { strictObjOf, num, str } from "parmenides";

import { ContractOf } from "../utils/parmenides/contract-of";

import { Grid, Card, CardContent, Typography, CardActions, Button, withStyles, WithStyles, createStyles, Theme } from "@material-ui/core";

export const userContract = strictObjOf({
    id: num,
    name: str,
    username: str,
    email: str,
    address: strictObjOf({
      street: str,
      suite: str,
      city: str,
      zipcode: str,
      geo: strictObjOf({
        lat: str,
        lng: str
      }),
    }),
    phone: str,
    website: str,
    company: strictObjOf({
      name: str,
      catchPhrase: str,
      bs: str
    })
  });

type IUser = ContractOf<typeof userContract>;

const styles = (theme: Theme) => createStyles({
    card: {
        maxWidth: 345,
        marginBottom: theme.spacing.unit * 2
    }
});

interface Props extends WithStyles<typeof styles> {
  user: IUser;
}

export const User = withStyles(styles)(({user, classes}: Props) =>
  (
    <Grid item xs={12}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {user.name}
          </Typography>
          <Typography color="textSecondary">
            @{user.username}
          </Typography>
          <Typography component="p">
            {user.email}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
)
