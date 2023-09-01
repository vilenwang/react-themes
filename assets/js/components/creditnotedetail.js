import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '600px',
  },
  gridpaper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '45%',
    float: 'left',
    borderBlockEnd: '1px solid'
  },
  h5:{
    marginTop:'320px',
  }


}));

const Creditnotedetail = memo((props) => {
  const { isOpen, handleOpen, creditnotedetail, getstatusText, getDueDate } = props
  const classes = useStyles();
  console.log(creditnotedetail, 'creditnotedetail');
  const creditnote = creditnotedetail[0]
  return (
    <div>
      <Modal
        className={classes.modal}
        open={isOpen}
        onClose={handleOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        {
          creditnotedetail.length && <Fade in={isOpen}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Creadit Note Detail</h2>
              <h5 id="">Creadit Note #{creditnote.id}</h5>
              <h5 id="">Basic Information</h5>
              <Grid item xs={12}>
                <Typography className={classes.gridpaper}>Due Date</Typography>
                <Typography className={classes.gridpaper}>{getDueDate(creditnote.due_date)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.gridpaper}>Customer Group ID</Typography>
                <Typography className={classes.gridpaper}>Company Name</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.gridpaper}>Amount</Typography>
                <Typography className={classes.gridpaper}>{creditnote.currency_token + creditnote.amount}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.gridpaper}>Creadit Note Status</Typography>
                <Typography className={classes.gridpaper}>{getstatusText(creditnote.status)}</Typography>
              </Grid>
              {creditnote.paymentInfo &&
                <>
                  <Grid item xs={12}>
                    <Typography className={classes.gridpaper}>Payer Name</Typography>
                    <Typography className={classes.gridpaper}>{creditnote.paymentInfo.payerName}</Typography>
                  </Grid>
                  <h5 className={classes.h5}>Invoices</h5>
                  <Grid item xs={12}>
                    <Typography className={classes.gridpaper}>Invoice ID</Typography>
                    <Typography className={classes.gridpaper}>{creditnote.paymentInfo.lineItems[0].invoiceId}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.gridpaper}>Invoice Number</Typography>
                    <Typography className={classes.gridpaper}>{creditnote.paymentInfo.lineItems[0].invoiceNumber}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.gridpaper}>Applied Amount</Typography>
                    <Typography className={classes.gridpaper}>{creditnote.amount}</Typography>
                  </Grid>
                </>}
            </div>
          </Fade>
        }
      </Modal>
    </div>
  );
})

export default Creditnotedetail