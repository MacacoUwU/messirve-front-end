import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Button, Image,
  Divider, message, Tag
} from 'antd';
import { Link } from 'react-router-dom';
import { isEqual, isEmpty } from 'lodash';
import { connect } from 'unistore/react';
import { actions } from '../../store';
import TagMedidas from '../TagMedidas';

const ParaDespues = ({ paraDespues, carrito, setParaDespuesItems, setCarritoItems }) => {
  const [localParaDespues, setLocalParaDespues] = useState(paraDespues || []);

  const deleteFromParaDespues = (item) => {
    const updatedLocalParaDespues = localParaDespues.filter((i) => !isEqual(i, item));
    localStorage.setItem('messirve-shop-para-despues', JSON.stringify(updatedLocalParaDespues));
    setLocalParaDespues(updatedLocalParaDespues);
    setParaDespuesItems(updatedLocalParaDespues);
    message.success("Producto Eliminado")
  };
  const moveToCarrito = (item) => {
    const foundInCarrito = carrito.find((i) => isEqual(i, item));
    if (isEmpty(foundInCarrito)) {
      const filteredLocalParaDespues = localParaDespues.filter((i) => !isEqual(i, item));
      setLocalParaDespues(filteredLocalParaDespues);
      localStorage.setItem('messirve-shop-para-despues', JSON.stringify(filteredLocalParaDespues));
      setParaDespuesItems(filteredLocalParaDespues);
      localStorage.setItem('messirve-shop-carrito', JSON.stringify([...carrito, item]));
      setCarritoItems([...carrito, item]);
      message.success("Movido al Carrito")
    } else {
      message.error("Mismo producto ya esta en el Carrito")
    }
  };

  useEffect(() => {
    setLocalParaDespues(paraDespues);
  }, [paraDespues])

  return (
    <>
      <Card title="Para Despues" style={{ margin: 20 }}>
        {isEmpty(localParaDespues) && <h2 style={{ textAlign: 'center' }}>Lista Vacía</h2>}
        {localParaDespues?.map((item) => (
          <Card 
            // style={{ marginTop: 16 }}
            type="inner"
            title={(
              <> 
                {item.nombre}
                <Divider type="vertical" />
                <Tag>{item.empresa.idEmpresa.nombre}</Tag>
                <Divider type="vertical" />
                <TagMedidas medidas={[item.medida]} />
              </>
            )}
            extra={<Link to={`/producto/${item.id}`}>Mas Info</Link>}
          >
            <Row>
              <Col span={4}>
              <Image
                width="100%"
                height="100%"
                src={item.imagenes_set[0]?.imagen || "error"}
                fallback="data:image/png;base64,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"
              />
              </Col>
              <Col offset={1} span={18}>
                <Row>
                  <Col span={22}>{item.descripcion}</Col>
                  <Col span={2}>
                      <Row>
                          <Col>Precio</Col>
                      </Row>
                      <Row>
                          <Col style={{ borderTop: '1px solid grey' }}>
                            <h3><b>{item.empresa?.precioBase ? `CS$${item.empresa.precioBase}` : "No Disponible"}</b></h3>
                          </Col>
                      </Row>
                  </Col>
                </Row>
                <Row style={{ paddingTop: 10 }}>
                  <Col>
                    <Button
                      onClick={() => deleteFromParaDespues(item)}
                      type="primary"
                      danger 
                      size="small" 
                      shape="round"
                    >
                      Eliminar
                    </Button>
                    <Divider type="vertical" />
                  </Col>
                  <Col>
                    <Button
                      onClick={() => moveToCarrito(item)}
                      style={{ backgroundColor: '#1a991c', borderColor: '#1a991c' }}
                      type="primary"
                      size="small"
                      shape="round"
                    >
                      Agregar Al Carrito
                    </Button>
                    <Divider type="vertical" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        ))}
      </Card>
    </>
  );
};

export default connect(['carrito', 'paraDespues'], actions)(ParaDespues);
