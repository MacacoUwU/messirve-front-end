import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Button, Image,
  Divider, message
} from 'antd';
import CantidadSelector from './CantidadSelector';
import { Link, useHistory } from 'react-router-dom';
import { isEqual, isEmpty, findIndex } from 'lodash';
import { connect } from 'unistore/react';
import { actions } from '../../store';

const Carrito = ({
  carrito, paraDespues, setCarritoItems, setParaDespuesItems,
  user,
}) => {
  const [localCarrito, setLocalCarrito] = useState(carrito || []);
  const history = useHistory();

  const deleteFromCarrito = (item) => {
    const updatedLocalCarrito = localCarrito.filter((i) => !isEqual(i, item));
    localStorage.setItem('messirve-shop-carrito', JSON.stringify(updatedLocalCarrito));
    setLocalCarrito(updatedLocalCarrito);
    setCarritoItems(updatedLocalCarrito);
    message.success("Producto Eliminado")
  };
  const moveToParaDespues = (item) => {
    const foundInParaDespues = paraDespues.find((i) => isEqual(i, item));
    if (isEmpty(foundInParaDespues)) {
      const filteredLocalCarrito = localCarrito.filter((i) => !isEqual(i, item));
      setLocalCarrito(filteredLocalCarrito);
      localStorage.setItem('messirve-shop-carrito', JSON.stringify(filteredLocalCarrito));
      setCarritoItems(filteredLocalCarrito);
      localStorage.setItem('messirve-shop-para-despues', JSON.stringify([...paraDespues, item]));
      setParaDespuesItems([...paraDespues, item]);
      message.success("Guardado Para Despues")
    } else {
      message.error("Mismo producto ya esta en Para Despues")
    }
  };
  const setVal = (itemId, value) => {
    const item = localCarrito.find((i) => i.id = itemId);
    item.cantidad = value;
    const index = findIndex(localCarrito, (i) => i.id = itemId);
    localCarrito[index] = item;
    setLocalCarrito(localCarrito);
    setCarritoItems(localCarrito);
    localStorage.setItem('messirve-shop-carrito', JSON.stringify(localCarrito));
  };

  const handleMoveToCheckOut = () => {
    if (user.accessToken) {
      history.push('/check-out')
    } else {
      message.info('Please Login to Proceed to checkout')
    }
  }

  useEffect(() => {
    setLocalCarrito(carrito);
  }, [carrito])
  return (
    <>
      <Card title="Carrito" style={{ margin: 20 }}>
        {localCarrito?.map((item) => (
          <Card 
            // style={{ marginTop: 16 }}
            type="inner"
            title={item.nombre}
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
                          <h3><b>US$69.69</b></h3>
                        </Col>
                      </Row>
                  </Col>
                </Row>
                <Row style={{ paddingTop: 10 }}>
                  <Col>
                    <CantidadSelector itemId={item.id} setVal={setVal} val={item.cantidad} />
                    <Divider type="vertical" />
                  </Col>
                  <Col>
                    <Button
                      onClick={() => deleteFromCarrito(item)}
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
                      onClick={() => moveToParaDespues(item)}
                      type="primary"
                      size="small"
                      shape="round"
                    >
                      Guardar Para Despues
                    </Button>
                    <Divider type="vertical" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        ))}
        {!isEmpty(localCarrito) && (
          <Row>
            <Col offset={21}>
              <Row>
                <Col>Sub-Total</Col>
              </Row>
              <Row>
                <Col style={{ borderTop: '1px solid grey' }}>
                  <h2><b>US$69.69</b></h2>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    style={{ backgroundColor: '#1a991c', borderColor: '#1a991c' }}
                    type="primary"
                    shape="round"
                    onClick={handleMoveToCheckOut}
                  >
                    Check-Out
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Card>
    </>
  );
};

export default connect(['carrito', 'paraDespues', 'user'], actions)(Carrito);
