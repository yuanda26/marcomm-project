import React from "react";
import {
  Modal, 
  ModalBody, 
  ModalFooter, 
  ModalHeader, 
  Button, 
  Input, 
  Label, 
  FormGroup 
} from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProduct } from "../../../actions/productAction";

class CreateProduct extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      code: "",
      name: "",
      description: "",
      created_by: this.props.user.m_employee_id,
      update_by: "",
      alertData: {
        status: "",
        message: ""
      },
      selectedOption:"",
      selectedOption2:"",
      validate : {
        validateNameProduct : "form-control", 
        validateDescription : "form-control",
      },
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    const { id, name, value } = e.target
    const { validate } = this.state
    if(
      ( name === "name" && value === '' ) ||
      ( name === "description" && value === "" )
    ){
      validate[id] = "form-control is-invalid"
    }else{
      validate[id] = "form-control is-valid"
    }
    this.setState({
      [name] : value,
      alertData: {
        status: false,
        message: ""
      },
      validate : validate
    });
  }

  componentWillReceiveProps(newProps){
    if (newProps.statusCreated) {
      if(newProps.statusCreated === 200){
        newProps.modalStatus(1, `Succes, New Product with code ${newProps.productCode} has been add`)
      }
    }
  }

  cancelHandler = () => {
    let validate = {
      validateNameProduct : "form-control", 
      validateDescription : "form-control",
    }
    this.setState({
      validate: validate, 
      code: "",
      name: "",
      description: "",
      created_by: this.props.user.m_employee_id,
      update_by: "",
    })
    this.props.closeHandler()
  }

  submitHandler(){
    if(this.state.name === "" && this.state.description === " "){
      this.setState({
        alertData: {
          status: true,
          message: "all forms must be filled!"
        }
      });
    }
    else if(this.state.name === ""){
      this.setState({
        alertData: {
          status: true,
          message: "name forms must be filled!"
        }
      });
    }
    else if(this.state.description === ""){
      this.setState({
        alertData: {
          status: true,
          message: "description forms must be filled!"
        }
      });
    }
    else {
      const func = (arrReq, input)=>{
          if(arrReq.filter(content => content.toUpperCase() === input.toUpperCase()).length !== 0){
              return false
          }
          else{
              return true;
          }
      }

      let formdata={
        code: this.state.code,
        name: this.state.name,
        description: this.state.description,
        created_by:this.state.created_by,
        update_by:this.state.update_by
      }

      if(func(this.props.dataValidation, this.state.name) === false){
        this.setState({
          alertData: {
            status: true,
            message: "product already created"
          }
        });
      }
      if(func(this.props.dataValidation, this.state.name) === true) {
        this.props.createProduct(formdata);
        let eraseAlertData = {
            status: false,
            message: ""
          }
        let eraseValidate = {
          validateNameProduct: "form-control",
          validateDescription: "form-control"
          }
        this.setState({
          name : "",
          description : "",
          alertData: eraseAlertData,
          validate: eraseValidate
        })
        this.props.closeHandler();
      }
    }
  }

  render() {    
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader> Add Product</ModalHeader>
        <ModalBody>
          <FormGroup>
              <Label for="">Code</Label>
              <Input type="text" name="code"  placeholder="Auto Generate" readOnly />
            </FormGroup>
          <FormGroup className="needs-validation">
            <Label htmlFor="validateNameProduct">Name Product</Label>
            <Input 
              type="text" 
              name="name"
              id="validateNameProduct"
              placeholder="Type Name"
              className={this.state.validate.validateNameProduct} 
              value={this.state.name}  
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
              value={this.state.description}  
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
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitHandler}
          >
            Save
          </Button>
          <Button variant="contained" onClick={this.cancelHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateProduct.propTypes = {
    product: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    product: state.product,
    user: state.auth.user, 
    statusCreated: state.product.statusCreated,
    productCode: state.product.code
  });
  
  export default connect(
    mapStateToProps,
    { createProduct }
  )(CreateProduct);