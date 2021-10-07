import React, { useCallback, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import { LicenseContext } from '../../pages/customers/[customerId]';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 500,
    overflow: 'auto',

  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button_text_rows: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
}));

export default function LicensePlate_modal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
//   const [licensePlate, setLicensePlate] = useState([""]);

  const { licensePlate, setLicensePlate } = useContext(LicenseContext)



  const handleChangeText = (index, e) => {
    let newRow = [...licensePlate];

    newRow[index] = e.target.value
    setLicensePlate(newRow)
  }

  const handleAddRow = () => {
      setLicensePlate((prevRows) => {
          return ([...prevRows, ""])
      })
  }

  const handleDeleteRow = (index) => {
    let newArray = [...licensePlate]
    
    newArray.splice(index, 1)

    setLicensePlate(newArray)   
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">ป้ายทะเบียนรถ</h2>
      <p id="simple-modal-description">
        กรอกเลขทะเบียนรถด้านล่าง กดปุ่ม "เพิ่ม" เพื่อเพิ่มช่อง
      </p>

      <form className={classes.root} noValidate autoComplete="off">
      {licensePlate.map((row, index) => {
        return (
        <div key={index}>
          <TextField required name="price" label="เลขทะเบียนรถ" value={row} onChange={(e) => handleChangeText(index, e)} />
          
          <Button variant="contained" color="secondary" onClick={() => handleDeleteRow(index)} className={classes.button_text_rows}>
            ลบ
          </Button>

        </div>
        )

      })}
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddRow()}
            className={classes.button}
          >
            เพิ่ม
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            className={classes.button}
          >
            สำเร็จ
          </Button>
        </div>
    </form>

    </div>
  );

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        {licensePlate[0] !== undefined ? "แก้ไขเลขทะเบียนรถ" : "แก้ไข/เพิ่มเลขทะเบียนรถ"} 
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
