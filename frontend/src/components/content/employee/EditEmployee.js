import React from 'react'
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap'
import { connect } from "react-redux";
import { updateEmployee } from "../../../actions/employee/update_act";
import { getCompanies } from "../../../actions/company/get_all_act";

class EditEmployee extends React.Component {
  constructor (props) {
    super(props)
    let userdata = "purwanto"     
    super(props)
    this.state = {
      formdata: {},
      updated_by: userdata,
      currentEmployee: null,
      companyname: null,
      first_name : '',
      last_name: '',
      company : [],
      statusUpdated : null,
      messageUpdated : null,
      validate : {
        validateFirsname : "form-control", 
        selectedCompany : "form-control",
        validateEmail : "form-control",
        validateCompany : "form-control"
      },
      regexEmail : /^(([^<>()[].,;:s@"]+(.[^<>()[].,;:s@"]+)*)|(".+"))@(([^<>()[].,;:s@"]+.)+[^<>()[].,;:s@"]{2,})$/
    }
  }

  componentWillReceiveProps(newProps){
    let { company, employee, currentEmployee } = newProps
    let formdata = {
      _id : currentEmployee._id,
      employee_number : currentEmployee.employee_number,
      m_company_id : currentEmployee.m_company_id,
      first_name : currentEmployee.first_name,
      last_name : currentEmployee.last_name,
      email : currentEmployee.email,
    }
  
    this.setState({
      company : company.myCompany,
      statusUpdated : employee.statusUpdated,
      messageUpdated : employee.idUpdated,
      formdata : formdata,
      first_name : currentEmployee.first_name,
      last_name : currentEmployee.last_name
    })
  }

  componentDidMount(){
    this.props.getCompanies();
  }

  changeHandler = (e) => {
    let { formdata, validate, regexEmail } = this.state
    let { name, value, id } = e.target

    let companyName = null
    if(name == "m_company_id"){
      formdata[name] = value[0]
      companyName = value[1]
    }else{
      formdata[name] = value
    }

    if( name=="email" && regexEmail.test(value) && value != '' ){
      validate[id] = "form-control is-valid"
    }else if(
      ( name=="email" && !regexEmail.test(value) && value != '' ) ||
      ( name=="m_company_id" && value=="" ) ||
      ( name=="first_name" && value=="" )
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
    let { formdata, validate, regexEmail, updated_by, companyName } = this.state
    let { email, first_name, m_company_id } = formdata
    formdata["updated_by"] = updated_by

    if( m_company_id == "" ){
      alert( "Select Company!" )
    }else if( first_name == '' ){
      alert( "Type First Name!" )
    }else if( !regexEmail.test(email) && email != ''){
      alert( "Email Incorrect!" )
    }else{
      this.props.updateEmployee(formdata._id, formdata, companyName)
      this.props.closeModalHandler()
    }
  }


  render(){
    // status, action, message, optional, code
    if(this.state.statusUpdated == 200){
      this.props.modalStatus(1, 'Updated',
        'Data Employee has been updated',
        '',
        '')
    }else if (this.state.statusUpdated != 200 &&
       this.state.statusCreated != null){
      this.props.modalStatus(2, 'Failed')
    }

    return(
      <Modal isOpen={this.props.edit} className="modal-dialog modal-lg border-primary card">
        <ModalHeader className="bg-primary text-white card-header"> Edit Employee -
          {" "+this.state.first_name
            +" "+this.state.last_name+" {"+
            this.state.formdata.employee_number+"}"}
        </ModalHeader>
        <ModalBody className="card-body">
          <form class="needs-validation">
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
                <label for="validateCompany" className="col-sm-2 col-form-label text-right">* Company Name</label>
                <div className="col-sm-4">
                  <select
                    id="validateCompany"
                    name="m_company_id"
                    className={this.state.validate.validateCompany}
                    onChange={this.changeHandler}
                    value={this.state.formdata.m_company_id}
                  >
                  <option selected value="">Select Company...</option>
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
                <label for="validateFirsname" className="col-sm-2 col-form-label text-right">* First Name</label>
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
                <label for="validateEmail" className="col-sm-2 col-form-label text-right">Email</label>
                <div className="col-sm-4">
                  <input 
                    id="validateEmail"
                    type="text" 
                    class={this.state.validate.validateEmail} 
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
                    class="form-control" 
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
            onClick ={this.submitHandler}
          >Save</Button>
          <Button 
            color="warning"
            onClick={this.props.closeModalHandler}
          >Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

EditEmployee.propTypes = {
  updateEmployee: PropTypes.func.isRequired,
  getCompanies: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  employee: state.employee,
  company: state.company,
});

export default connect(
  mapStateToProps,{ updateEmployee, getCompanies }
  )(EditEmployee);