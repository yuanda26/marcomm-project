import React from 'react'
import { Modal, Input, ModalBody, ModalFooter, ModalHeader, Button, Label, FormGroup, Alert } from 'reactstrap'
import axios from 'axios'
import apiconfig from '../../../configs/api.config.json'
import {updateProduct} from '../../../actions/productAction'
import {connect} from 'react-redux'
import PropTypes from "prop-types";

class EditProduct extends React.Component {
    constructor (props) {
        super(props)
        let userdata = JSON.parse(localStorage.getItem(apiconfig.LS.USERDATA));
        super(props);
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
            updated_by:userdata.username,
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            formdata : newProps.product_test
        });
    }
 
    changeHandler(e) {
        let tmp = this.state.formdata;
        tmp[e.target.name] = e.target.value;
        this.setState({
            formdata:tmp
        })   
    }

    submitHandler() {
        this.state.formdata.update_by = this.state.updated_by
        const func = (arrReq, input)=>{
            if(arrReq.filter(content => content.toUpperCase() === input.toUpperCase()).length !== 0){
                return false
            }
            else{
                return true;
            }
        }
        if(func(this.props.dataValidation, this.state.formdata.name) === false){
            this.setState({
                alertData: {
                  status: true,
                  message: "Product Already Created"
                }
            });  
        }
        else if(func(this.props.dataValidation, this.state.formdata.name) === true) {
            let data = this.state.formdata
            this.props.updateProduct(data);
            this.props.closeModalHandler();
            this.props.modalStatus(1, ("Data updated! " + this.state.formdata.code + " has been updated!"));
        }
        
    }
    
    render(){
      // alert(JSON.stringify(this.state.formdata))
        //console.log("ini isi formdata", this.state.formdata)
        return(
            <Modal isOpen={this.props.edit} className={this.props.className}>
                <ModalHeader> Edit Product</ModalHeader>
                <ModalBody >
                    <FormGroup>
                        <Label for="">Code</Label>
                        <Input type="text" name="code" value={this.state.formdata.code} placeholder="Auto Denerate" readOnly />
                    </FormGroup>
                    <FormGroup>
                        <Label for="">Name Product</Label>
                        <Input type="text" name="name"  placeholder="" value={this.state.formdata.name}  onChange={this.changeHandler} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="">Description</Label>
                        <Input type="text" name="description"  placeholder="" value={this.state.formdata.description}  onChange={this.changeHandler} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    {this.state.alertData.status == true ? (
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

EditProduct.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default connect(null, {updateProduct})(EditProduct);