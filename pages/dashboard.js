import React, { useEffect } from "react";
// react plugin for creating charts

import { makeStyles } from "@material-ui/core/styles";

// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";

import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { Box, Grid } from "@material-ui/core";

function Dashboard() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: "https://charts.mongodb.com/charts-little-tank-jnblp",
    });
    const chart = sdk.createChart({
      chartId: "b91605a3-b18c-4782-a755-bb0d6ae0cc27",
      width: 400,
      height: 220,
      theme: "dark",
    });

    const chart2 = sdk.createChart({
      chartId: "eea67d55-e0a7-4cc7-9eba-77cc25a48a7b",
      width: 300,
      height: 660,
      theme: "dark",
    });

    const chart3 = sdk.createChart({
      chartId: "4c2a3639-147b-4532-b6a0-321ab9eec6fb",
      width: 400,
      height: 420,
      theme: "dark",
    });

    const chart4 = sdk.createChart({
      chartId: "9188d9fb-81e8-49f2-b939-d724888136e7",
      width: 300,
      height: 660,
      theme: "dark",
    });

    chart
      .render(document.getElementById("chart"))
      .catch(() => window.alert("Chart failed to initialise"));

    chart2
      .render(document.getElementById("chart2"))
      .catch(() => window.alert("Chart failed to initialise"));

    chart3
      .render(document.getElementById("chart3"))
      .catch(() => window.alert("Chart failed to initialise"));

    chart4
      .render(document.getElementById("chart4"))
      .catch(() => window.alert("Chart failed to initialise"));

    // refresh the chart whenenver #refreshButton is clicked

    // document
    //   .getElementById('refreshButton')
    //   .addEventListener('click', () => chart.refresh());
  }, []);

  return (
    <div>
      <Box className="left" id="chart3" />
      <Box className="right" id="chart4" />
      <Box className="right" id="chart2" />
      <Box className="left" id="chart" />
    </div>
  );
}

Dashboard.layout = Admin;

export default Dashboard;
