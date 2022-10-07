import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./poll.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import { withUAL } from "ual-reactjs-renderer";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Chart from "./Chart";
import Swal from "sweetalert2";
import Accordion from "./Accordion";

function Poll(props) {
  const [tokens, setTokens] = useState();
  const [zeroperctokens, setZeroperctokens] = useState();
  const [accountname, setAccountName] = useState();
  const [percsum, setPercsum] = useState(100);
  const [poll, setPoll] = useState();
  const [managers, setManagers] = useState();
  const [charttotal, setCharttotal] = useState();

  const {
    ual: { showModal, hideModal, activeUser, login, logout },
  } = props;
  if (activeUser) {
    const accountName = activeUser.getAccountName();
    accountName.then(function (result) {
      setAccountName(result);
    });
  }
  const displayaccountname = () => {
    if (accountname) {
      return accountname;
    }
  };

  const logmeout = () => {
    logout();
    setAccountName("");
  };

  const votesuccess = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "success",
      title: "Vote successful!",
    });
  };

  const rebalancesuccess = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "success",
      title: "Rebalance was succesful!",
    });
  };

  const errorswal = (e) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "error",
      title: e,
    });
  };

  useEffect(() => {
    //FETCHES MAIN TABLE
    fetch("https://api.main.alohaeos.com:443/v1/chain/get_table_rows", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        json: true,
        code: "consortiumtt",
        table: "rebalon",
        scope: "consortiumtt",
        limit: 100,
      }),
    }).then((response) => response.json().then((res) => datamaker(res)));

    fetch("https://api.main.alohaeos.com:443/v1/chain/get_table_rows", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        json: true,
        code: "consortiumtt",
        table: "portfolios",
        scope: "cetfcetfcetf",
        lower_bound: "420",
        upper_bound: "420",
        limit: 1,
      }),
    }).then((response) => response.json().then((res) => setPoll(res)));

    fetch("https://api.main.alohaeos.com:443/v1/chain/get_table_rows", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        json: true,
        code: "consortiumtt",
        table: "mngtab",
        scope: "consortiumtt",
        lower_bound: "jnnl4eigkmwy",
        upper_bound: "jnnl4eigkmwy",
        limit: 1,
      }),
    }).then((response) => response.json().then((res) => setManagers(res)));

    const datamaker = async (props) => {
      //DUPLICATES PERCENTAGE VALUES TO KEEP INITIAL PERCENTAGES FOR OTHER PURPOSES AND HAVE ONES FOR SUBMISSION
      await props.rows.map((value, index) => {
        props.rows[index].votepercentage = props.rows[index].tokenpercnew * 100;
        if (props.rows[index].votepercentage > 0) {
          props.rows[index].display = true;
        } else {
          props.rows[index].display = false;
        }
      });

      const tokendata = props;
      Promise.all(
        tokendata.rows.map((value, index) => {
          return new Promise((resolve) => {
            fetch("https://api.main.alohaeos.com:443/v1/chain/get_table_rows", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                json: true,
                code: "swap.defi",
                table: "pairs",
                scope: "swap.defi",
                lower_bound: value.strpairid,
                upper_bound: value.strpairid,
                limit: 1,
              }),
            })
              .then((response) =>
                response.json().then((price) => {
                  if (price?.rows[0]?.reserve0?.split(" ")[1] !== "EOS") {
                    tokendata.rows[index].price = price?.rows[0]?.price0_last;
                    tokendata.rows[index].price_quantity =
                      Number(price?.rows[0]?.price0_last) *
                      Number(value.tokeninfund);
                    if (typeof price?.rows[0]?.price0_last == "undefined") {
                      tokendata.rows[index].price = 0;
                      tokendata.rows[index].price_quantity = 0;
                    }
                  } else {
                    tokendata.rows[index].price = price.rows[0].price1_last;
                    tokendata.rows[index].price_quantity =
                      Number(price?.rows[0]?.price1_last) *
                      Number(value.tokeninfund);
                    if (typeof price?.rows[0]?.price0_last == "undefined") {
                      tokendata.rows[index].price = 0;
                      tokendata.rows[index].price_quantity = 0;
                    }
                  }
                })
              )
              .then(() => {
                const percentagesum = tokendata.rows
                  .map((token) => token.price_quantity)
                  .reduce((token1, token2) => Number(token1) + Number(token2));
                console.log("percentagesum: " + percentagesum);
                tokendata.rows.map((value, index) => {
                  tokendata.rows[index].price_percentage =
                    (tokendata.rows[index].price_quantity / percentagesum) *
                    100;
                  tokendata.rows[index].initial_price_percentage =
                    (tokendata.rows[index].price_quantity / percentagesum) *
                    100;
                  console.log(
                    (tokendata.rows[index].price_quantity / percentagesum) * 100
                  );
                  tokendata.rows[index].tokensymbol = tokendata.rows[
                    index
                  ].minamount.split(" ")[1];
                });
                //VALUES FOR CHART
                fetch(
                  "https://api.main.alohaeos.com:443/v1/chain/get_table_rows",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      json: true,
                      code: "consortiumtt",
                      table: "portfolios",
                      scope: "cetfcetfcetf",
                      limit: 1,
                    }),
                  }
                ).then((response) =>
                  response.json().then((res) => {
                    let charttotal = 0;
                    const tokendata_chartbase = tokendata;
                    res.rows[0].answers.forEach((value, index) => {
                      console.log(tokendata);
                      const objIndex = tokendata.rows.findIndex(
                        (obj) => obj.tokensymbol == value.split(",")[1]
                      );
                      console.log("OBJECT INDEX" + objIndex);
                      tokendata.rows[objIndex].chartvalue =
                        res.rows[0].totalvote[index];
                      charttotal += res.rows[0].totalvote[index];
                      tokendata_chartbase.rows[objIndex].chart_base =
                        res.rows[0].totalvote[index];
                    });
                    setCharttotal(charttotal);
                    setTokens({ ...tokendata_chartbase });
                  })
                );
              })
              .then(() => {
                resolve();
              });
          });
        })
      ).then(() => {
        setTokens({ ...tokendata });
      });

      //CREATES OBJECT FOR DROPDOWN OF 0-PERCENTAGE TOKENS
      const zeroperctokens = [];
      props.rows.map((value, index) => {
        if (Number(value.tokenpercnew) == 0) {
          zeroperctokens.push({
            label: value.minamount.split(" ")[1],
            value: value.minamount.split(" ")[1],
          });
        }
      });
      setZeroperctokens(zeroperctokens);
    };
  }, []);

  const rebalance = async () => {
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "consortiumtt",
              name: "rebalance",
              authorization: [
                {
                  actor: displayaccountname(), // use account that was logged in
                  permission: "active",
                },
              ],
              data: {
                user: displayaccountname(),
                pollkey: 420,
                community: "cetfcetfcetf",
              },
            },
          ],
        };
        // The activeUser.signTransaction will propose the passed in transaction to the logged in Authenticator
        await activeUser.signTransaction(transaction, {
          broadcast: true,
          expireSeconds: 300,
        });
        rebalancesuccess();
      } catch (error) {
        errorswal(error);
      }
    } else {
      showModal();
    }
  };

  const changeallocation = (event, index) => {
    const tokencopy = tokens;
    console.log(tokencopy);

    tokencopy.rows[index].price_percentage = Number(event.target.value);
    const totalchart =
      tokencopy.rows.reduce((prev, cur) => prev + cur.price_percentage, 0) +
      tokencopy.rows.reduce((prev, cur) => prev + cur.chart_base, 0);
    tokencopy.rows[index].chart_value =
      ((Number(event.target.value) * 10 +
        Number(tokencopy.rows[index].chart_base)) *
        10) /
      totalchart;
    console.log(tokencopy);
    setTokens({ ...tokencopy });

    let sum = 0;
    tokencopy.rows.forEach((value, ind) => {
      if (index !== ind) {
        sum += 2 * value.chartvalue;
      } else {
        sum += value.chartvalue + 10 * Number(event.target.value);
      }
    });
    console.log("SUM: " + sum);
    tokencopy.rows[index].chart_display =
      (tokencopy.rows[index].chartvalue + Number(event.target.value)) / sum;
    setTokens({ ...tokencopy });

    //SET NEW SUM
    const percentagesum = tokencopy.rows
      .map((token) => token.price_percentage)
      .reduce((token1, token2) => Number(token1) + Number(token2));
    setPercsum(percentagesum);
  };

  const selectnewtoken = (e, value) => {
    const tokenscopy = tokens;
    tokens.rows.forEach((element, index) => {
      if (element.minamount.split(" ")[1] == value) {
        tokenscopy.rows[index].display = true;
      }
    });
    setTokens({ ...tokenscopy });
  };

  const submitvote = async () => {
    //TAKE POLL ARRAY AND FOR EACH ONE, FIND VALUE IN TOKENS AND THEN PUSH TO VOTES ARRAY
    const votes = [];
    console.log(tokens);
    poll.rows[0].answers.forEach((i) => {
      const value = tokens.rows.find((x) => x.tokensymbol == i.split(",")[1])
        .price_percentage;
      votes.push((Number(value) * 10).toFixed(0));
    });

    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "consortiumtt",
              name: "cetfvote",
              authorization: [
                {
                  actor: displayaccountname(), // use account that was logged in
                  permission: "active",
                },
              ],
              data: {
                usersvote: votes,
                pollkey: 420,
                community: "cetfcetfcetf",
                voter: displayaccountname(),
              },
            },
          ],
        };
        // The activeUser.signTransaction will propose the passed in transaction to the logged in Authenticator
        await activeUser.signTransaction(transaction, {
          broadcast: true,
          expireSeconds: 300,
        });
        votesuccess();
      } catch (error) {
        errorswal(error);
      }
    } else {
      showModal();
    }
  };

  return (
    <>
      {accountname ? (
        <Button
          sx={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={() => logmeout()}
          variant="contained"
          startIcon={<LogoutIcon />}
        >
          {accountname}
        </Button>
      ) : (
        <Button
          sx={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={() => showModal()}
          variant="contained"
          startIcon={<LoginIcon />}
        >
          Log In
        </Button>
      )}

      <Card className="card" sx={{ overflow: "visible" }}>
        <div class="floatingmenu">
          <Paper elevation={3} className="counter">
            Voted:{" "}
            <a
              style={{
                color:
                  Number(poll?.rows[0].nrofvoters) /
                    Number(managers?.rows[0].nrofmanagers) >
                  0.66666
                    ? "green"
                    : "red",
              }}
            >
              {poll?.rows[0].nrofvoters + "/" + managers?.rows[0].nrofmanagers}
            </a>
          </Paper>
          <Paper elevation={3} className="counter">
            Allocated:{" "}
            <a
              style={{
                color:
                  percsum.toFixed(1) > 100
                    ? "red"
                    : percsum.toFixed(1) == 100
                    ? "green"
                    : "black",
              }}
            >
              {percsum.toFixed(1)}%
            </a>
          </Paper>
          <Paper elevation={3} className="counter2">
            To allocate:{" "}
            <a
              style={{
                color:
                  (100 - percsum).toFixed(1) < 0
                    ? "red"
                    : (100 - percsum).toFixed(1) == 0
                    ? "green"
                    : "black",
              }}
            >
              {(100 - percsum).toFixed(1)}%
            </a>
          </Paper>
          <Chart tokens={tokens} />
        </div>
        <CardContent>
          <Accordion />
          <Divider />
          <div class="wrapper">
            {tokens?.rows.map((value, index) => {
              if (value.display == true) {
                return (
                  <TextField
                    onChange={(event) => changeallocation(event, index)}
                    id="outlined-basic"
                    inputProps={{ maxLength: 4 }}
                    label={value.minamount.split(" ")[1]}
                    defaultValue={Number.parseFloat(
                      value.price_percentage
                    ).toFixed(1)}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                );
              }
            })}
          </div>
          {zeroperctokens ? (
            <Autocomplete
              disablePortal
              id="add-token"
              options={zeroperctokens}
              sx={{ width: "100%", marginTop: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Add token" />
              )}
              onInputChange={selectnewtoken}
            />
          ) : (
            <></>
          )}
          <Button
            sx={{ width: "100%", marginTop: 2 }}
            onClick={() => submitvote()}
            variant="contained"
          >
            Vote
          </Button>
          <Button
            sx={{ width: "100%", marginTop: 2 }}
            onClick={() => rebalance()}
            variant="contained"
          >
            Rebalance
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default withUAL(Poll);
