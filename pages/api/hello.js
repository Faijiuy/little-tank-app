// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler() {

  var date = new Date(Date.UTC(2012, 12 - 1, 1)); // months start 0
  console.log(date.toUTCString());
}

