import React from 'react'
import { 
  Modal, 
  Input, 
  ModalBody, 
  ModalFooter, 
  ModalHeader, 
  Button, 
  Label, FormGroup, 
  Alert 
} from 'reactstrap'
import { updateProduct } from '../../../actions/productAction'
import { connect } from 'react-redux'

class EditProduct extends React.Component {
  constructor (props) {
  super(props)
  this.state = {
    formdata: {
      code : '',
      name: '',
      description: '',
      created_by:''
    },
    alertData: {
      status: false,
      message: ""
    },
    validate : {
      validateNameProduct : "form-control", 
      validateDescription : "form-control",
    },
    updated_by:this.props.user.m_employee_id
    }
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps(newProps) {
    let alertData =  {
      status: false,
      message: ""
    }
    this.setState({
      formdata : newProps.product_test,
      alertData: alertData
    });
    if (newProps.statusUpdated) {
      if(newProps.statusUpdated === 200){
        newProps.modalStatus(1, `Data updated! ${this.state.formdata.code} has been updated!`)
      }
    }
  }

  changeHandler(e) {
    const { id, name, value } = e.target
    const { validate, formdata } = this.state
    formdata[name] = value
    if(
      ( name === "name" && value === '' ) ||
      ( name === "description" && value === "" )
    ){
      validate[id] = "form-control is-invalid"
    }else{
      validate[id] = "form-control is-valid"
    }
    this.setState({
      formdata: formdata,
      validate : validate
    });
  }

  submitHandler() {
    const func = (arrReq, input)=>{
      if(
        arrReq.filter(content => content.toUpperCase() === input.toUpperCase()).length !== 0
        ){
        return false
      } else{
        return true;
      }
    }
    if(
      func(this.props.dataValidation, this.state.formdata.name) === false
      ){
      this.setState({
        alertData: {
          status: true,
          message: "Product Already Created"
        }
      });  
    }
    else if(
      func(this.props.dataValidation, this.state.formdata.name) === true
      ) {
      let data = this.state.formdata
      data.updated_by = this.state.updated_by
      this.props.updateProduct(data);
      let eraseAlertData =  {
            status: false,
            message: ""
          }
      this.setState({alertData: eraseAlertData})
      this.props.closeModalHandler();
    }
  }

  render(){
    return(
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader> Edit Product</ModalHeader>
        <ModalBody >
          <FormGroup>
              <Label htmlFor="">Code</Label>
              <Input 
              type="text" 
              name="code"
              value={this.state.formdata.code}
              placeholder="Auto Generate" readOnly />
            </FormGroup>
          <FormGroup className="needs-validation">
            <Label htmlFor="validateNameProduct">Name Product</Label>
            <Input 
              type="text" 
              name="name"
              id="validateNameProduct"
              placeholder="Type Name"
              className={this.state.validate.validateNameProduct} 
              value={this.state.formdata.name}  
              onChange={this.changeHandler}
            />
            <div className="valid-feedback">
              Looks good!
            </div>
            <div className="invalid-feedback">
              Please Type Name!.
            </div>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="validateDescription">Description</Label>
            <Input 
              type="text" 
              name="description"  
              placeholder="Type Description" 
              id="validateDescription"
              className={this.state.validate.validateDescription}
              value={this.state.formdata.description}  
              onChange={this.changeHandler} 
            />
            <div className="valid-feedback">
              Looks good!
            </div>
            <div className="invalid-feedback">
              Please Type Description!.
            </div>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status === true ? (
          <Alert color="danger">{this.state.alertData.message} </Alert>
          ) : (
          ""
          )}
          <Button color="primary" onClick ={this.submitHandler}>Update</Button>
          <Button color="warning" onClick={this.props.closeModalHandler}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  statusUpdated: state.product.statusUpdated
});
export default connect(mapStateToProps, {updateProduct})(EditProduct);