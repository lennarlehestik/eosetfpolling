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
            <Typography>
                Add a paragraph or two that explain the concepts.
            </Typography>
            </AccordionDetails>
        </Accordion>
      </>
    );
  }
  
  export default ExplainerAccordion;