import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:3002/dev";
//console.log(url);

class App extends Component {

  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      tipoModal: ''

    }
  }

  getRequest = () => {
    axios.get(url).then(response => {
      //console.log(response.data);
      this.setState({
        data: response.data.users
      });
    }).catch(error=>{
      console.log(error.message);
    })
  }

  postRequest = async () => {
    await axios.post(url+'/save', this.state.form).then(response=>{
      this.modalInsertar();
      this.getRequest();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  putRequest =  ()=>{
    axios.put(url+'/update/'+this.state.form.id, this.state.form).then(response=>{
      this.modalInsertar();
      this.getRequest();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  deleteRequest = () => {
    axios.delete(url+'/delete/'+this.state.form.id).then(response=>{
      this.setState({
        modalEliminar: false  
      })
      this.getRequest();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  modalInsertar = () =>{
   this.setState({
     modalInsertar: !this.state.modalInsertar
   })
  }

  userSelect =(user)=>{
    console.log(user);
    this.setState({
      tipoModal: 'actualizar',
      form: { 
        id: user._id,       
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
      }
    })
  }

  handleChange = async e =>{
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    })
  }

  componentDidMount(){
    this.getRequest();
  }

  render(){
    let resp = this.state.data;
    const { form } = this.state; 
    
  return (
    <div className="App">
      <button className="btn btn-success" onClick={ ()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Aregar</button>
      <div className="col-md-7">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Telefono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                           
                        {Object.values(resp).map(user =>{
                          console.log(resp)
                          return (
                            <tr>
                              <td>{user.nombre}</td>
                              <td>{user.apellido}</td>
                              <td>{user.email}</td>
                              <td>{user.telefono}</td>
                              
                              
                              <td>
                                <button onClick={()=>{this.userSelect(user); this.modalInsertar()}} className="btn btn-info">Editar</button>
                                <button onClick={()=>{this.userSelect(user); this.setState({modalEliminar: true})}} className="btn btn-danger">Eliminar</button>
                              </td>
                            </tr>
                          )
                          })}                         

                    </tbody>
                </table>

                <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">Nombre</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre: ''}/>
                    <br />
                    <label htmlFor="nombre">Apellido</label>
                    <input className="form-control" type="text" name="apellido" id="apellido" onChange={this.handleChange} value={form?form.apellido: ''}/>
                    <br />
                    <label htmlFor="nombre">Email</label>
                    <input className="form-control" type="text" name="email" id="email" onChange={this.handleChange} value={form?form.email: ''}/>
                    <br />
                    <label htmlFor="capital_bursatil">Telefono</label>
                    <input className="form-control" type="text" name="telefono" id="telefono" onChange={this.handleChange} value={form?form.telefono:''}/>
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.tipoModal=='insertar'?
                    <button className="btn btn-success" onClick={()=>this.postRequest()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.putRequest()}>
                    Actualizar
                  </button>
                  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>
          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Está a punto de eliminar el usuario: 
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.deleteRequest()}>Si</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>          

            </div>
    </div>
  );
}
}
export default App;
