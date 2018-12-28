import React from 'react'
import PropTypes from "prop-types"
import {
  Modal, ModalBody, ModalFooter, ModalHeader, Button
} from 'reactstrap'
import { connect } from "react-redux";
import { createEmployee } from "../../../actions/employeeAction";

class CreateEmployee extends React.Component{
  constructor (props){
    super(props)
    let userdata = "purwanto"
    this.state={
      formdata:{
        employee_number: '',
        m_company_id:'',
        first_name:'',
        last_name:'',
        email:'',
        created_by: userdata
      },
      companyName: null,
      company:[
                {_id : "124653546575", code : "CP0001", name : "XSIS"},
                {_id : "557453235657", code : "CP0002", name : "ASTRA"}
              ],
      employee:[],
      selectedCompany: '',
      andaYakin : false,
      validate : {
        validateFirsname : "form-control", 
        validateEmail : "form-control",
        validateCompany : "form-control"
      },
      regexEmail : /^(([^<>()[].,;:s@"]+(.[^<>()[].,;:s@"]+)*)|(".+"))@(([^<>()[].,;:s@"]+.)+[^<>()[].,;:s@"]{2,})$/
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({
      employee : newProps.employee.myEmployee
    })
  }

  changeHandler = (e) => {
    let { formdata, validate, regexEmail } = this.state
    let { name, value, id } = e.target
    let companyName = null
    if(name === "m_company_id"){
      formdata[name] = value[0]
      companyName = value[1]
    }else{
      formdata[name] = value
    }
    
    if( name==="email" && regexEmail.test(value) && value !== '' ){
      validate[id] = "form-control is-valid"
    }else if(
      ( name==="email" && value !== '' ) ||
      ( name==="m_company_id" && value==="" ) ||
      ( name==="first_name" && value==="" )
    ){
      validate[id] = "form-control is-invalid"
    }else{
      validate[id] = "form-control is-valid"
    }
    
    this.setState({
      formdata:formdata,
      validate: validate,
      companyName: companyName
    })
  }


  submitHandler = () => {
    let { formdata, employee,  regexEmail, companyName } = this.state
    let { email, first_name, m_company_id } = formdata
    let emailJikaAda = ''
    employee.forEach((ele)=>{
        if(ele.email === email){
          emailJikaAda = ele.email
        }
      })

    if( m_company_id === "" ){
      alert( "Select Company!" )
    }else if( first_name === '' ){
      alert( "Type First Name!" )
    }
    else if(  email === emailJikaAda ) {
      alert( "Email Sudah Ada!" )
    }
    else if( !regexEmail.test(email) && email !== ''){
      alert( "Email Incorrect!" )
    }else{
      this.props.createEmployee(formdata, companyName)
      this.props.closeHandler()
    }
  }

  render(){
    return(
      <Modal isOpen={this.props.create} className="modal-dialog modal-lg border-primary card">
        <ModalHeader className="bg-primary text-white card-header">
            Add Employee
        </ModalHeader>
        <ModalBody className="card-body">
          <form className="needs-validation">
            <div className="form-group row">
              <label className="col-sm-2 col-form-label text-right">* Emp ID Number</label>
              <div className="col-sm-4">
                <input
                  type="text" 
                  className="form-control" 
                  placeholder="" 
                  readOnly
                  name="code" 
                  value={this.state.formdata.employee_number} 
                  onChange={this.changeHandler}
                />
              </div>
              <label htmlFor="validateCompany" className="col-sm-2 col-form-label text-right">* Company Name</label>
              <div className="col-sm-4">
                <select
                  id="validateCompany"
                  name="m_company_id"
                  defaultValue=""
                  className={this.state.validate.validateCompany}
                  onChange={this.changeHandler}
                >
                <option value="">Select Company...</option>
                  {this.state.company.map((row,x) => {
                    return (
                      <option key={row._id} value={row.code}>{row.name}</option>
                  )})}
                </select>
                <div className="valid-feedback">
                  Looks good!
                </div>
                <div className="invalid-feedback">
                  Please Select Company!.
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="validateFirsname" className="col-sm-2 col-form-label text-right">* First Name</label>
              <div className="col-sm-4">
                <input 
                  type="text"
                  id="validateFirsname"
                  className={this.state.validate.validateFirsname} 
                  placeholder="First Name" 
                  name="first_name" 
                  value={this.state.formdata.first_name} 
                  onChange={this.changeHandler} 
                  required 
                />
                <div className="valid-feedback">
                  Looks good!
                </div>
                <div className="invalid-feedback">
                  Please Type First Name!.
                </div>
              </div>
              <label htmlFor="validateEmail" className="col-sm-2 col-form-label text-right">Email</label>
              <div className="col-sm-4">
                <input 
                  id="validateEmail"
                  type="text" 
                  className={this.state.validate.validateEmail} 
                  placeholder="email" 
                  name="email" 
                  value={this.state.formdata.email} 
                  onChange={this.changeHandler} 
                  required
                />
                <div className="valid-feedback">
                  Looks good!
                </div>
                <div className="invalid-feedback">
                  Email Is Incorrect!.
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label text-right">Last Name</label>
              <div className="col-sm-4">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Last Name" 
                  name="last_name" 
                  value={this.state.formdata.last_name} 
                  onChange={this.changeHandler} 
                  required
                />
                <div className="valid-feedback">
                  Looks good!
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            type="submit"
            onClick ={this.submitHandler}
          >Save</Button>
          <Button 
            color="warning"
            onClick={this.props.closeHandler}
          >Cancel</Button>
        </ModalFooter>
      </Modal>
    
    )
  }
}

CreateEmployee.propTypes = {
  createEmployee: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  employee: state.employee,
});

export default connect(
  mapStateToProps,{ createEmployee }
  )(CreateEmployee);