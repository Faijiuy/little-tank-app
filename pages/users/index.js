import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { FormControlLabel, IconButton } from '@material-ui/core';

import { connectToDatabase } from "../../util/mongodb";
import Admin from "layouts/Admin.js";

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const customers = await db
    .collection("user")
    .find()
    .sort({})
    .limit(20)
    .toArray();

  return {
    props: {
      user: JSON.parse(JSON.stringify(customers)),
    },
  };
}

function Users({user: user}) {
    return (
        <div></div>
    )
}

Users.layout = Admin;

export default Users;