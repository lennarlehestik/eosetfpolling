import { useEffect, useState } from 'react';
import './poll.css';
import { withUAL } from "ual-reactjs-renderer";
import Paper from '@mui/material/Paper';
import Drawer from '@mui/material/Drawer';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




function Chart(props) {
    const [state, setState] = useState({
        top: false,
      });
    
      const chartdata = props?.tokens?.rows

      const toggleDrawer = (anchor, open) => (event) => {
        setState({ ...state, [anchor]: open });
        console.log(props.tokens.rows)
      };

      const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];
  return (
    <div>
        <>
          <Paper sx={{position:"absolute"}} className="chartbutton" elevation={3} onClick={toggleDrawer('top', true)}>Chart</Paper>
          <Drawer
            anchor={'top'}
            open={state['top']}
            onClose={toggleDrawer('top', false)}
          >
              <div style={{width:"90vw", height:"80vh", display:"flex", justifyContent:"center", alignItems:"center", padding:"20px;"}}>
              <ResponsiveContainer width="95%" height="95%">
                    <BarChart
                        width={500}
                        height={300}
                        data={chartdata}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tokensymbol" />
                        <YAxis />
                        <Tooltip formatter={(value) => value.toFixed(1)}/>
                        <Legend />
                        <Bar name="Vote" dataKey="price_percentage" fill="#1976D2" />
                        <Bar name="Last reallocation" dataKey="votepercentage" fill="#1976AA" />
                    </BarChart>
                </ResponsiveContainer>
                </div>
          </Drawer>
        </>
    </div>
  );
}

export default withUAL(Chart);
