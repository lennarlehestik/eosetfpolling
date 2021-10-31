import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './poll.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { withUAL } from "ual-reactjs-renderer";
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';




function Poll(props) {
  const [tokens, setTokens] = useState()
  const [zeroperctokens, setZeroperctokens] = useState()
  const [accountname, setAccountName] = useState()
  const [percsum, setPercsum] = useState(0)

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
    logout()
    setAccountName("")
  }

  useEffect(()=>{
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
    }).then((response) =>
      response.json().then((res) => datamaker(res))
    );

    const datamaker = async (props) => {
      //DUPLICATES PERCENTAGE VALUES TO KEEP INITIAL PERCENTAGES FOR OTHER PURPOSES AND HAVE ONES FOR SUBMISSION
      await props.rows.map((value,index)=>{
        props.rows[index].votepercentage = props.rows[index].tokenpercnew * 100
        if(props.rows[index].votepercentage > 0){
          props.rows[index].display = true
        }
        else{
          props.rows[index].display = false
        }
      })


      const tokendata = props
      Promise.all(tokendata.rows.map((value,index)=>{
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
          }).then((response) =>
            response.json().then((price) => {
              console.log(price)
              if(price.rows[0].reserve0.split(" ")[1] == "EOS"){
                tokendata.rows[index].price = price.rows[0].price0_last
                tokendata.rows[index].price_quantity = Number(price.rows[0].price0_last) * Number(value.tokeninfund)
              }
              else{
                tokendata.rows[index].price = price.rows[0].price1_last
                tokendata.rows[index].price_quantity = Number(price.rows[0].price1_last) * Number(value.tokeninfund)
              }
            })
          ).then(()=>{
            const percentagesum = tokendata.rows.map(token => token.price_quantity).reduce((token1, token2) => Number(token1) + Number(token2));
            console.log(percentagesum)
            tokendata.rows.map((value,index)=>{
              tokendata.rows[index].price_percentage = tokendata.rows[index].price_quantity / percentagesum
              resolve()
            })
          })
        })
      }
      )
      ).then(()=>{
        setTokens({...tokendata})
      })
      

      

      //SET SUM
      const percentagesum = props.rows.map(token => token.votepercentage).reduce((token1, token2) => Number(token1) + Number(token2));
      setPercsum(percentagesum)
      
      //CREATES OBJECT FOR DROPDOWN OF 0-PERCENTAGE TOKENS
      const zeroperctokens = []
      props.rows.map((value,index)=>{
        if(Number(value.tokenpercnew) == 0){
          zeroperctokens.push({label:value.minamount.split(" ")[1], value:value.minamount.split(" ")[1]})
        }
      })
      setZeroperctokens(zeroperctokens)

    }
  },[])

  const changeallocation = (event, index) => {
    const tokencopy = tokens
    tokencopy.rows[index].price_percentage = event.target.value
    console.log(tokencopy)
    setTokens({...tokencopy})

    //SET NEW SUM
    const percentagesum = tokencopy.rows.map(token => token.votepercentage).reduce((token1, token2) => Number(token1) + Number(token2));
    setPercsum(percentagesum)
  }

  const selectnewtoken = (e, value) => {
    console.log(value)
    const tokenscopy = tokens
    tokens.rows.forEach((element, index) => {
      if(element.minamount.split(" ")[1] == value) {
          tokenscopy.rows[index].display = true;
      }
    });
    setTokens({...tokenscopy})
  }

  const submitvote = async () => {
    const votes = []
    tokens.rows.forEach((i)=>{
      votes.push((Number(i.price_percentage)*10000).toFixed(0))
    })
    console.log(votes)

    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "consortiumlv",
              name: "cetfvote",
              authorization: [
                {
                  actor: displayaccountname(), // use account that was logged in
                  permission: "active",
                },
              ],
              data: {
                usersvote: votes,
                pollkey: 69,
                community: "jnnl4eigkmwy",
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
      } catch (error) {
        console.log(error.message);
      }
    } else {
      showModal();
    }
  }

  return (
    <>
    
    {accountname ?
    <Button sx={{position:"absolute", top:"10px", right:"10px"}} onClick={()=> logmeout()} variant="contained" startIcon={<LogoutIcon />}>
      {accountname}
    </Button>
    :
    <Button sx={{position:"absolute", top:"10px", right:"10px"}} onClick={() => showModal()} variant="contained" startIcon={<LoginIcon />}>
      Log In
    </Button>
    }

    <Card className="card" sx={{overflow:"visible"}}>
    <Paper elevation={3} className="counter">{percsum.toFixed(1)}%</Paper>
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Vote for EOSETF token allocations
        </Typography>
        <Divider />
        <div class="wrapper">
        {
          tokens?.rows.map((value,index)=>{
            if(value.display == true){
            return <TextField 
            onChange={(event) => changeallocation(event, index)} 
            id="outlined-basic" 
            label={value.minamount.split(" ")[1]}
            defaultValue={Number.parseFloat(value.price_percentage*100).toFixed(1)} variant="outlined" 
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}/>
            }
          })
        }
        </div>
      {zeroperctokens ? 
            <Autocomplete
            disablePortal
            id="add-token"
            options={zeroperctokens}
            sx={{ width: '100%', marginTop:2 }}
            renderInput={(params) => <TextField {...params} label="Add token" />}
            onInputChange={selectnewtoken}
        />
      :
      <></>}
      <Button sx={{ width: '100%', marginTop:2 }} onClick={()=>submitvote()}variant="contained">Vote</Button>
      </CardContent>
    </Card>
    </>
  );
}

export default withUAL(Poll);
