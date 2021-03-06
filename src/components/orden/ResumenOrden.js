import { Col, Row, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'unistore/react';
import TagMedidas from '../TagMedidas';
import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';
import ConfirmarOrden from './ConfirmarOrden';

const ResumenOrden = ({
  ordenDireccion, user, carrito, detalleCarrito,
  altDetalle,
}) => {
  const params = useParams();
  const [resumen, setResumen] = useState(isEmpty(altDetalle) ? carrito : []);
  const [direc, setDirec] = useState(isEmpty(altDetalle) ? ordenDireccion : altDetalle.direccion)
  const [detalle, setDetalle] = useState(isEmpty(altDetalle) ? detalleCarrito : altDetalle);
  const [getProductos, setGetProductos] = useState(false);
  // const [subTotal, setSubTotal] = useState(0);

 /* const calculateSubTotal = () => {
    let sum = 0;
    for (let i=0; i<carrito.length; i+=1) {
      sum +=carrito[i].empresa.precioBase*carrito[i].cantidad
      setSubTotal(sum);
    }
  }; */

  useEffect(() => {
    // calculateSubTotal();
    if (!isEmpty(altDetalle)) {
      fetch(`http://localhost:8000/api/productoorden?idOrden=${altDetalle.id}`)
        .then((res) => res.json())
        .then((data) => {
          setResumen(data)
          setGetProductos(true)
        });
    } else if (params.idOrden) {
      fetch(`http://localhost:8000/api/orden/${params.idOrden}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.detail) {
            fetch(`http://localhost:8000/api/productoorden?idOrden=${params.idOrden}`)
            .then((res) => res.json())
            .then((data1) => {
              if (data1.estado !== 'Carrito') {
                // setter de la segunda request
                setResumen(data1)
                setGetProductos(true)
                // setter the la primera request
                setDetalle(data)
                setDirec(data.direccion)
              }
            });
          }
        });
    }
  }, [])

  useEffect(() => {
    if (!isEmpty(resumen) && getProductos === true) {
      let changedResumen = [];
      Promise.all(
        resumen.map((item) => {
          fetch(`http://localhost:8000/api/empresaproducto?idEmpresa=${item.idEmpresa}&idProducto=${item.idProducto}`)
            .then((res) => res.json())
            .then((data) => {
              fetch(`http://localhost:8000/api/empresa/${item.idEmpresa}`)
                .then((res) => res.json())
                .then((data2) => {
                  fetch(`http://localhost:8000/api/productos/${item.idProducto}`)
                    .then((res) => res.json())
                    .then((data3) => {
                      // const filteredResumen = resumen.filter((it) => it.id !== item.id);
                      const [empresa] = data;
                      changedResumen = [...changedResumen, {...item, nombre: data3.nombre, descripcion: data3.descripcion, empresa: {...empresa, idEmpresa: data2} }]
                      setResumen(changedResumen);
                    })
                })
            })
        })
      )
      setGetProductos(false);
    }
  }, [getProductos])
  return (
    <>
    <Card>
        <Row>
          <Col span={24}>
            <Card
              title="Direccion de Envío"
              // extra={<Button onClick={() => history.push('/orden/direccion')}>Modificar Direccion</Button>}
              bodyStyle={{ display: 'none' }}
            />
          </Col>
        </Row>
        <Row>
        <Col span={24}>
          <Card>
              <Row>
                  Nombre - {`${direc?.first_name} ${direc?.last_name}`}
              </Row>
              <Row>
                  Direccion - {direc?.direccion?.direccion || direc.direccion}
              </Row>
              <Row>
                  Ciudad - {direc?.direccion?.ciudad || direc.ciudad}
              </Row>
              {direc?.direccion?.region && (
                <Row>
                  Region - {direc?.direccion?.region || direc.region}
                </Row>
              )}
              <Row>
                  Postal - {direc?.direccion?.postal || direc.postal}
              </Row>
              <Row>
                  Telefono - {direc?.telefono}
              </Row>
          </Card>
        </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card title="Producto/Precio" bodyStyle={{ display: 'none' }} />
          </Col>
        </Row>
        {resumen?.map((item) => (
          <Row>
            <Col span={24} >
            <Card id={`${item.nombre}-${item.id}`}>
              <Col>
                <Row>
                    <h3 style={{ marginRight: 5 }}>{item.nombre}</h3>
                    -
                    <p style={{ marginTop: 3, marginLeft: 5 }}>{item.descripcion}</p>
                </Row>
                <Row>
                    <TagMedidas medidas={[item.medida]} />
                </Row>
                <Row style={{ marginTop: 5 }}>
                  <h4><b>{item.empresa?.precioBase && `C$${item.empresa.precioBase*item.cantidad}`}</b></h4>
                </Row>
                <Row>
                    Individual - {item.empresa?.precioBase && `C$${item.empresa.precioBase}`}
                </Row>
                <Row>
                    Cantidad - {item.cantidad}
                </Row>
                <Row>
                    Vendido por - {item.empresa?.idEmpresa.nombre}
                </Row>
              </Col>
              </Card>
              </Col>
            </Row>
        ))}
        <Row>
          <Col span={24}>
            <Card>
              <Row style={{ textAlign:'center' }}>
                <Col>Sub-Total
                  <h2 style={{ borderTop: '1px solid grey' }}><b>CS${detalle.subtotal || detalle.subTotal || 0.00}</b></h2>
                </Col>
              +
                <Col>IVA
                  <h2 style={{ borderTop: '1px solid grey' }}><b>CS${detalle.impuesto || 0.00}</b></h2>
                </Col>
              =
                <Col>Total
                  <h2 style={{ borderTop: '1px solid grey' }}><b>CS${detalle.total || 0.00}</b></h2>
                </Col>
              </Row>
              {!params.idOrden && ordenDireccion && (
                <div style={{ float: 'right' }}>
                  <ConfirmarOrden orden={detalle} productos={resumen} direccion={direc} />
                </div>
              )}
            </Card> 
          </Col>
        </Row>
    </Card>
    </>
  );
};

export default connect(['ordenDireccion', 'detalleCarrito'])(ResumenOrden);
