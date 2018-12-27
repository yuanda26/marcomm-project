import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Input, Label, FormGroup } from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import apiconfig from "../../../configs/api.config.json";
import { connect } from "react-redux";
import { createProduct } from "../../../actions/productAction";

class CreateProduct extends React.Component {
  constructor(props) {
    super(props);
    let userdata = JSON.parse(localStorage.getItem(apiconfig.LS.USERDATA));
    
    this.state = {
      code: "",
      name: "",
      description: "",
      created_by: userdata.username,
      update_by:  userdata.username,
      alertData: {
        status: false,
        message: ""
      },
      labelWidth: 0,
      selectedOption:"",
      selectedOption2:"",
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    this.setState({
      [e.target.name] : e.target.value,
      alertData: {
        status: false,
        message: ""
      }
    });
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
          if(arrReq.filter(content => content.toUpperCase() == input.toUpperCase()).length !== 0){
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

      if(func(this.props.dataValidation, this.state.name) == false){
        this.setState({
          alertData: {
            status: true,
            message: "product already created"
          }
        });
      }
      if(func(this.props.dataValidation, this.state.name) == true) {
        this.props.createProduct(formdata);
        this.props.modalStatus(1, "Created!", this.state.name);

        this.setState({
          code : "",
          name : "",
          description : ""
        })
        this.props.closeHandler();
      }
    }
  }

  render() {

    const { classes } = this.props;
    
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader> Add Product</ModalHeader>
        <ModalBody>
          <FormGroup>
              <Label for="">Code</Label>
              <Input type="text" name="code"  placeholder="Auto Generate" readOnly />
            </FormGroup>
          <FormGroup>
            <Label for="">Name Product</Label>
            <Input type="text" name="name"  placeholder="Type Name" value={this.state.name}  onChange={this.changeHandler} />
          </FormGroup>
          <FormGroup>
            <Label for="">Description</Label>
            <Input type="text" name="description"  placeholder="Type Description" value={this.state.description}  onChange={this.changeHandler} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status == true ? (
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
          <Button variant="contained" onClick={this.props.closeHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateProduct.propTypes = {
    classes: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    product: state.product
  });
  
  export default connect(
    mapStateToProps,
    { createProduct }
  )(CreateProduct);