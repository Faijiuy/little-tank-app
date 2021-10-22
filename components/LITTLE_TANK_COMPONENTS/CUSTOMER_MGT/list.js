import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { LicenseContext } from '../../../pages/customers/[customerId]';

const useStyles = makeStyles((theme) => ({
  list: {
    width: '100%',
    maxWidth: 200,
    backgroundColor: 'rgba(242, 246, 245, 1)',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));

export default function LicensePlate_List() {
  const classes = useStyles();

  const { licensePlate, setLicensePlate } = useContext(LicenseContext)

  return (
    <List className={classes.list} subheader={<li />}>
        <ListSubheader>เลขทะเบียนรถ</ListSubheader>
        {licensePlate.map((row, index) => (
            <ListItem key={index}>
            <ListItemText primary={row} />
            </ListItem>

        ))} 
    </List>
  );
}
