import store from './store';

const actions = {
  setCategorias: (_, newCategorias) => ({ categorias: newCategorias }),
  setSubCategorias: (_, newSubCategorias) => ({ subCategorias: newSubCategorias }),
  setMarcas: (_, newMarcas) => ({ marcas: newMarcas }),
  setCarritoItems: (_, newItem) => ({ carrito: newItem}),
  setParaDespuesItems: (_, newItem) => ({ paraDespues: newItem }),
  setFilterActual: (_, filter) => ({ filterActual: filter }),
  setUser: (_, userData) => ({ user: userData }),
  setDetalleCarrito: (_, newdetalleCarrito) => ({ detalleCarrito: newdetalleCarrito }),
  setOrdenDireccion: (_, newOrdenDireccion) => ({ ordenDireccion: newOrdenDireccion }),
  setAltDetalle: (_, newAltDetalle) => ({ altDetalle: newAltDetalle }),
};

export default actions;
