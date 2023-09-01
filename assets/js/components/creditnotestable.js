import React, { useEffect, useRef, useState, useCallback } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';

import { getproductCustomField, getCreditNoteDetail } from '../theme/custom/api/creditnote'
import B3Spin from './spinning'
import Creditnotedetail from './creditnotedetail'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Creditnotestable() {
  const classes = useStyles();
  const [creditnoteLists, setCreditnoteLists] = useState([])
  const [val, setVla] = useState(0)
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    totalCount: 0
  })
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [detailopen, setDetaolOpen] = useState(false)
  const [creditnotedetail, setCreditnotedetail] = useState([])
  const [tableTitle, setTableTitle] = useState(['Customer Id','Status','Currency Token','Amount','Due Date'])

  useEffect(() => {
    getcreditnoteLists({ status: val === 0 ? '' : val, ...pagination })
  }, [page, val])

  const getcreditnoteLists = async (data) => {
    try {
      setLoading(true)
      const res = await getproductCustomField(data)
      setCreditnoteLists(res.data)
      setPagination(res.pagination)
      setLoading(false)
    } catch (error) {
    } finally{
      setLoading(false)
    }
  }
  const getstatusText = (status) => {
    switch (status) {
      case 1:
        return 'Open'
      case 4:
        return 'Closed'
      default:
        return 'Applied';
    }
  }
  const getDueDate = useCallback((time) => {
    const dueDate = new Date(time * 1000)
    return dueDate.toLocaleDateString()
  },[])

  const handleChange = (e) => {
    setVla(e.target.value)
  }

  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, ...{ offset: pagination.limit * (value - 1) } })
    setPage(value);
  };

  const creditNoteDetail = async (cnId) => {
    try {
      setLoading(true)
      const res = await getCreditNoteDetail(cnId)
      setCreditnotedetail([res])
      setLoading(false)
    }
    catch (error) {
      console.log(error);
    } finally {
      setDetaolOpen(true)
      setLoading(false)
    }
  }
  const handleOpen = useCallback(() => {
    setDetaolOpen(false)
  }, [])

  return (
    <div>
      <InputLabel style={{ marginLeft: '10px' }}>Status</InputLabel>
      <FormControl variant="outlined" className={classes.formControl} style={{ width: '200px' }}>
        <Select
          value={val}
          onChange={handleChange}
        >
          <MenuItem aria-label="None" value={0}><em>None</em></MenuItem>
          <MenuItem value={1}>Open</MenuItem>
          <MenuItem value={4}>Closed</MenuItem>
          <MenuItem value={3}>Applied</MenuItem>
        </Select>
      </FormControl>
      <B3Spin isSpinning={loading} tip="loadding...">
        <Table>
          <TableHead>
            <TableRow>
            {tableTitle.map((item,index) => <TableCell key={index}>{item}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {creditnoteLists.map(creditnote => <TableRow key={creditnote.pk}>
              <TableCell onClick={() => creditNoteDetail(creditnote.pk)}>{creditnote.customer_id}</TableCell>
              <TableCell>{getstatusText(creditnote.status)}</TableCell>
              <TableCell>{creditnote.currency_token}</TableCell>
              <TableCell>{creditnote.currency_token + creditnote.amount}</TableCell>
              <TableCell>{getDueDate(creditnote.due_date)}</TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </B3Spin>

      <div className={classes.root}>
        {/* <Typography>Page: {pagination.offset}</Typography> */}
        <Pagination count={Math.ceil(pagination.totalCount / pagination.limit)} page={page} onChange={handlePageChange} />
      </div>
      <Creditnotedetail isOpen={detailopen} handleOpen={handleOpen} creditnotedetail={creditnotedetail} getstatusText={getstatusText} getDueDate={getDueDate}></Creditnotedetail>
    </div>
  )
}
