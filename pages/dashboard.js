import React, {useEffect} from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";


import { bugs, website, server } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";


import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";




function Dashboard() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const sdk = new ChartsEmbedSDK({
    baseUrl: 'https://charts.mongodb.com/charts-little-tank-jnblp',
  });
  const chart = sdk.createChart({
    chartId: 'b91605a3-b18c-4782-a755-bb0d6ae0cc27',
    width: 640,
    height: 400,
    theme: "dark",
  });

  const chart2 = sdk.createChart({
    chartId: 'eea67d55-e0a7-4cc7-9eba-77cc25a48a7b',
    width: 640,
    height: 400,
    theme: "dark",
  });

  const chart3 = sdk.createChart({
    chartId: '4c2a3639-147b-4532-b6a0-321ab9eec6fb',
    width: 640,
    height: 400,
    theme: "dark",
  });

  useEffect(() => {
    chart
      .render(document.getElementById('chart'))
      .catch(() => window.alert('Chart failed to initialise'));

    chart2
      .render(document.getElementById('chart2'))
      .catch(() => window.alert('Chart failed to initialise'));

    chart3
      .render(document.getElementById('chart3'))
      .catch(() => window.alert('Chart failed to initialise'));
    
    
    // refresh the chart whenenver #refreshButton is clicked
    
    // document
    //   .getElementById('refreshButton')
    //   .addEventListener('click', () => chart.refresh());

  }, [])

  return (
    <div>
      
      <GridContainer id="chart" />
      <GridContainer id="chart2" />
      <GridContainer id="chart3" />
      
      
    </div>
  );
}

Dashboard.layout = Admin;

export default Dashboard;
