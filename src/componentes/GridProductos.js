import React, {useEffect,useState} from "react";
import axios from "axios";

const GridProductos = ({ productos }) => {
  
  console.log(productos)
  function TwoColumnGrid() {
    return (
      <>
        <div>
          {productos ? (
            productos.map((producto) => (
              <div className="col-md-6">
                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">{producto.precio}</p>
                  </div>
                  <div className="card-footer"></div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-md-6">
              <br></br>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="row">
      <TwoColumnGrid />
    </div>
  );
};

export default GridProductos;
