import React, { Component } from 'react';
import Cookies from 'js-cookie';
//import {SERVER_URL} from '../constants.js';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import {DataGrid} from '@mui/x-data-grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//add student
class AddStudent extends Component {
      constructor(props) {
      super(props);
      this.state = {open: false, name:"", email:"", message:"" };
    };
    
    handleClickOpen = () => {
      this.setState( {open:true} );
    };


    handleClose = () => {
      this.setState( {open:false, name:"", email:"", message:""} );
    };


    handleChange = (event) => {
      this.setState({[event.target.name]: event.target.value});
    }

//Runs the code to post student into databse.
//Have checks for empty email or assumes duplicate email if unable to post
    handleAdd = () => {
      if (this.state.email) {
        const token = Cookies.get("XSRF-TOKEN");
        let rc = 0;
        fetch(`http://localhost:8080/student`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": token,
          },
          body: JSON.stringify({
            student_name: this.state.name,
            student_email: this.state.email,
          }),
        })
          .then((response) => {
            rc = response.status;
            return response.json();
          })
          .then((response) => {
            if (response.id) {
              this.setState({
                id: response.id,
                message: "Student assigned id=" + response.id,
              });
            } else {
              this.setState({
                message: "Add failed. Email already exists. rc=" + rc,
              });
            }
          })
          .catch((err) => {
            this.setState({ message: "Add failed. " + err });
          });
      } else {
        this.setState({ message: "Please add a email for student entry"});
      }
    } 
    

    render()  { 
      const columns = [
        { field: 'student_id', headerName: 'Student ID', width: 125 },
        { field: 'student_name', headerName: 'Student Name', width: 400 },
        { field: 'student_email', headerName: 'Student Email', width: 300 },
        { field: 'status_code', headerName: 'Status Code', width: 150 },
        { field: 'status', headerName: 'Status',  width: 150 },
        ];
      return (
        <div>
          <AppBar position="static" color="default">
            <Toolbar>
               <Typography variant="h6" color="inherit">
                  { "Add Student" }
                </Typography>
            </Toolbar>
          </AppBar>
          <div style={{ height: 400, width: '100%' }}>
              <DataGrid rows={this.state.courses} columns={columns} />
            </div>
          <Button id = "AddStudent1" variant="contained" color="error" style={{margin: 10}}
                  onClick={this.handleClickOpen}>
            Add Student
          </Button>
          <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle>Add Student</DialogTitle>
            <DialogContent  style={{paddingTop: 20}} >
              <h3 id="message"> {this.state.message} </h3>
              <TextField autoFocus fullWidth label="Name" name="name" 
                       onChange={this.handleChange}  />
              <br/><br/>
              <TextField fullWidth label="Email" name="email" onChange={this.handleChange}/>	
            </DialogContent>
            <DialogActions>
              <Button id ="Close" variant="outlined" Button color="secondary" onClick={this.handleClose}>Close</Button>
              <Button id="Add" variant="outlined" Button color="primary" onClick={this.handleAdd}>Add</Button>
            </DialogActions>
          </Dialog>      
        </div>
      ); 
    }
}
export default AddStudent;