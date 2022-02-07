import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

function ExplainerAccordion(props) {
    return (
      <>
        <Accordion disableGutters elevation={0}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography sx={{ width: '100%', flexShrink: 0 }} color="text.secondary">
                Vote for EOSETF token allocations 
                <sup><span style={{backgroundColor:"#7fb5eb", padding:"1px 3px 1px 3px", borderRadius:"5px", color:"white", fontSize:"10px"}}>info</span></sup>
                </Typography>
            </AccordionSummary>

            <AccordionDetails>
            <Typography style={{textAlign:"left"}}>
            <p>This is a voting module to manage EOSETF.</p>
            <p>EOSETF fund managers are able to vote to choose which tokens should be in the fund and in which proportions.</p> 
            <p>Each fund manager has 100 voting credits (100%) that he can distribute anyway he chooses. Precision is one decimal (eg. 10.5%).</p>
            <p>After 2/3 fund managers have voted, rebalancing function can be triggered.</p>
            <p>There is no limit on how many times and how often the fund can be rebalanced. Only criteria is to have 2/3 of managers voted.</p>
            <p>By clicking on Chart, a chart is displayed that shows current allocation (%) of each token and how you’ve currently voted.</p>
            <p>To have a token in the list of tokens that could be voted for, fund managers have to make a proposal to cet.f msiggers.</p>
            </Typography>
            </AccordionDetails>
        </Accordion>
      </>
    );
  }
  
  export default ExplainerAccordion;