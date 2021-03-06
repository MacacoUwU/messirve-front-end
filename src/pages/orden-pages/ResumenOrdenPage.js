import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { connect } from 'unistore/react';
import { message } from 'antd';
import ResumenOrden from '../../components/orden/ResumenOrden';

const ResumenOrdenPage = ({user, carrito, ordenDireccion, altDetalle}) => {
  const params = useParams();
  const history = useHistory();
  if (isEmpty(ordenDireccion) && isEmpty(altDetalle) && !params.idOrden) {
    message.info('Necesita comprobar direccion de envío')
    history.push('/orden/direccion');
  }
  if (isEmpty(carrito) && isEmpty(altDetalle) && !params.idOrden) {
    message.info('Carrito Vacío')
    history.push('/carrito')
  }
  if (params.idOrden && (user.id !== parseInt(params.idUser,10))) {
    message.info('No se encontro la orden que esta buscando')
    history.push("/")
  }
  return (
    <div style={{ minHeight: 700 }}>
      <ResumenOrden user={user} carrito={carrito} altDetalle={altDetalle} />
    </div>
  );
};

export default connect(['user', 'carrito', 'ordenDireccion', 'altDetalle'])(ResumenOrdenPage);
