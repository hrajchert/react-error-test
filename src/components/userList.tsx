import * as React from 'react';
import { arrOf } from "parmenides";
import { useRemoteRest } from "../hooks/useRemoteRest";
import { match } from "../utils/remote-data/remote-data";
import { CircularProgress } from "@material-ui/core";
import { userContract, User } from './user';

const usersContract = arrOf(userContract);

export const UserList = () => {
  const state = useRemoteRest('https://jsonplaceholder.typicode.com/users', usersContract);

  return match(
    () => (<span>Not asked yet</span>),
    () => (<CircularProgress />),
    err => (
      <div>
        <h4>There was an error loading the users</h4>
        <p>{err.message}</p>
      </div>
    ),
    users => (
      <div>
        {
          users.map(user => (<User key={user.id} user={user} />))
        }
      </div>
    ),
    state
  );
}

