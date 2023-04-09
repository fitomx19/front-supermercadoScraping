import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowPathIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import Chart from "chart.js/auto";

//importar navegacion


export default function ListadoProductos() {
  //cargar los productos a partir de la api
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [activoButton, setActivoButton] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaCategorias, setBusquedaCategorias] = useState([]);
  const [busquedaPorTiendaChedraui, setBusquedaPorTiendaChedraui] = useState(
    []
  );
  const [busquedaPorTiendaSoriana, setBusquedaPorTiendaSoriana] = useState([]);
  const [busquedaPorTienda, setBusquedaPorTienda] = useState([]);
  const [cadena, setCadena] = useState("");
  const [mostrarModalSupermercado, setModalSupermercado] = useState(false);
  const [mostrarComponente, setMostrarComponente] = useState(false);
  const [cargando, setCargando] = useState(false);


  useEffect(() => {
    const consultarApi = async () => {
      const resultado = await axios.get("http://localhost:4000/datos");
      const resultadoSoriana = await axios.get(
        "http://localhost:4000/supermercados/Soriana"
      );
      const resultadoChedraui = await axios.get(
        "http://localhost:4000/supermercados/Chedraui"
      );

      //esperar a que se carguen los datos

      await setBusquedaPorTiendaChedraui(resultadoChedraui.data.data);
      await setBusquedaPorTiendaSoriana(resultadoSoriana.data.data);

      //agrupar los productos por nombre
      let productosAgrupados = resultado.data.data.reduce((r, a) => {
        r[a.nombre] = [...(r[a.nombre] || []), a];
        return r;
      }, {});

      //console.log(productosAgrupados);
      //contar el numero de productos por nombre y
      let productosContados = Object.keys(productosAgrupados).map((key) => {
        return {
          _id: productosAgrupados[key][0]._id,
          nombre: key,
          busqueda: productosAgrupados[key][0].busqueda,
          precio: productosAgrupados[key][0].precio,
          tienda: productosAgrupados[key][0].tienda,
          fecha: productosAgrupados[key][0].fecha,
          url: productosAgrupados[key][0].url,
          palabrasClaveEncontradas:
            productosAgrupados[key][0].palabrasClaveEncontradas,
          gramaje: productosAgrupados[key][0].gramaje,
          precioPorGramo: productosAgrupados[key][0].precioPorGramo,
          vecesEncontrado: productosAgrupados[key].length,
        };
      });

      //mostrar solo los 10 primeros productos
      setProductosFiltrados(productosContados);
      productosContados = productosContados.slice(0, 3);
      setProductos(productosContados);
    };
    consultarApi();
  }, []);



  function mostrartodo() {
    setActivoButton(false);
    setProductos(productosFiltrados);
  }

  function cerrarTodo() {
    setActivoButton(true);
    let datos = productos.slice(0, 3);
    setProductos(datos);
  }

  const mostrarSupermercado = async (tienda) => {
    if (tienda === "Soriana") {
      setBusquedaPorTienda(busquedaPorTiendaSoriana);

      if (busquedaPorTienda.length === 0) {
      } else {
        setModalSupermercado(true);
      }
    } else {
      setBusquedaPorTienda(busquedaPorTiendaChedraui);
      console.log(busquedaPorTienda);
      if (busquedaPorTienda.length === 0) {
      } else {
        setModalSupermercado(true);
      }
    }
  };

  const handleChange = (event) => {
    setCadena(event.target.value);
  }

  
  const buscarCategorias = async (dato) => {
    console.log("funciona");
    console.log(dato);

    let json = { _id: dato };
  
    console.log(json);
    try {
    setCargando(true);
    const resultado = await axios.post(
      `http://localhost:4000/datos/busqueda/ultima-busqueda`,
      json,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log();
    setBusquedaCategorias(resultado.data.data);
    console.log(busquedaCategorias);
    setCargando(false);
    } catch (error) {
      console.log(error);
      setCargando(false);
    }

      
    
  };



  function ListadoProductos({ productos }) {
    //contar cuantos productos hay
    let numeroProductos = productos.length;

    //seleccionar solo 3 productos
    if (productos.length > 3) {
      productos = productos.slice(0, 3);
    }


    return (
      <>
        <h3>Tenemos <b>{numeroProductos}</b> entradas en nuestro registro</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => (
            <div key={producto._id} className="border rounded-lg p-4">
              <h2 className="font-bold text-lg mb-2 text-xs">
                {producto.nombre}
              </h2>
              <p className="text-gray-700 mb-2 text-xs">
                Precio: {producto.precio}
              </p>
              <p className="text-gray-700 mb-2 text-xs">
                Fecha: {producto.fecha}
              </p>
              <a
                href={producto.url}
                className="text-blue-500 hover:underline text-xs"
              >
                Ver producto
              </a>
            </div>
          ))}
        </div>
        <div className=" p-8">
          <h2 className="text-2xl font-bold mb-4">Promociones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className=" py-4 text-center">
              <h2 className=" font-bold ">
                Promociones Vinos y Licores 3 X 2
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                *Aplican restricciones
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  let ModalSupermercados = () => {
    return (
      <div className="relative">
        {/* Modal */}

        {mostrarModalSupermercado && (
          <>
            <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="opacity-50 fixed inset-0 z-0 bg-gray-600"></div>
              <div className="bg-white rounded-lg shadow-lg relative flex flex-col w-full max-w-md">
                <div className="p-6 flex-auto">
                  <h2 className="text-2xl font-bold mb-4">
                    Tienda {busquedaPorTienda[0].tienda}
                  </h2>
                  {busquedaPorTienda[0] === "Chedraui" ? (
                    <p>
                      Chedraui es una empresa mexicana, que se dedica a la
                      industria de comercio minorista, fundada en el año 1920
                      bajo el nombre de El Puerto de Beyrout.{" "}
                    </p>
                  ) : (
                    <p>
                      Soriana es una cadena mexicana de supermercados y
                      almacenes, fundada en el año 1968 por los hermanos
                      Francisco y Armando Martín Borque en Torreón, Coahuila,
                      México.{" "}
                    </p>
                  )}

                  <div className="py-4">
                    <ListadoProductos productos={busquedaPorTienda} />
                  </div>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={() => setModalSupermercado(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const GraficaPrecios = ({ precios, fechas }) => {
    const graficaRef = React.useRef(null);
  
    // Utilizar un efecto para crear la gráfica una vez que se monte el componente
    React.useEffect(() => {
      if (graficaRef && graficaRef.current) {
        const ctx = graficaRef.current.getContext("2d");
  
        // Crear la gráfica utilizando Chart.js
        const grafica = new Chart(ctx, {
          type: "line",
          data: {
            labels: fechas,
            datasets: [
              {
                label: "Precio",
                data: precios,
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              xAxes: [
                {
                  type: "time",
                  time: {
                    displayFormats: {
                      month: "MMM YYYY",
                    },
                  },
                },
              ],
            },
          },
        });
  
        return () => {
          grafica.destroy();
        };
      }
    }, [precios, fechas]);
  
    return <canvas ref={graficaRef}></canvas>;
  };
  
  return (
    <>
      <div>
        <div className="bg-white ">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Listado de productos
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                En esta sección se muestran los productos de los supermercados,
                se puede filtrar por nombre, precio y supermercado.
              </p>
            </div>

            <div className="mt-16 mx-auto ">
              <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full text-center text-sm font-light">
                        <thead className="font-medium">
                          <tr>
                            <th scope="col" className="px-8 py-4">
                              Nombre
                            </th>
                            <th scope="col" className="px-8 py-4">
                              Palabras Clave
                            </th>
                            <th scope="col" className="px-8 py-4">
                              Precio
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Gramaje
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Precio por gramo
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Supermercado
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Veces encontrado
                            </th>
                            <th scope="col" className="px-6 py-4">
                              Última fecha de extraccion
                            </th>
                            <th>Url</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productos.map((p) => (
                            <tr key={p.nombre}>
                              <td>
                                <b>
                                  {/* <input type="hidden" value={p._id} onChange={handleChange} /> */}
                                  <button
                                    onClick={() => buscarCategorias(p._id)}
                                    className="text-left"
                                  >
                                    {p.nombre}
                                  </button>
                                </b>
                              </td>
                              <td>
                                <div className="grid grid-cols-2 text-center ">
                                  {p.palabrasClaveEncontradas
                                    ? p.palabrasClaveEncontradas.map((e) => (
                                        <div className="pt-2 pr-8">
                                          <button className="bg-blue-200 text-blue-800 py-1 px-2 rounded text-xs py-4 px-4 rounded">
                                            {e}
                                          </button>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              </td>
                              <td>
                                <p className="text-center">${p.precio}</p>
                              </td>
                              <td>
                                {p.gramaje ? <p>{p.gramaje}</p> : <p></p>}
                              </td>
                              <td>
                                {p.precioPorGramo ? (
                                  <p className="text-left">
                                    ${parseFloat(p.precioPorGramo).toFixed(2)}
                                  </p>
                                ) : (
                                  <p></p>
                                )}
                              </td>
                              <td>
                                {p.tienda == "Soriana" ? (
                                  <button
                                    onClick={() => mostrarSupermercado()}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                  >
                                    {p.tienda}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => mostrarSupermercado()}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                                  >
                                    {p.tienda}
                                  </button>
                                )}
                              </td>
                              <td>{p.vecesEncontrado}</td>
                              <td>{p.fecha}</td>
                              <td>
                                <a href={p.url}>
                                  <b className="red">
                                    Ir a <ShoppingCartIcon></ShoppingCartIcon>
                                  </b>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <button></button>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center ">
        {!activoButton ? (
          <div className="flex justify-center items-center ">
            <button
              onClick={(e) => cerrarTodo()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => mostrartodo()}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Mostrar todo
          </button>
        )}
      </div>

      <ModalSupermercados />
      <br></br>
      <div>
        {cargando ? (
          <p>Cargando datos...</p>
        ) : (
          <div className="max-w-4xl mx-auto">
          <>
         

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(busquedaCategorias).map((alimento) => (
                <div key={alimento} className="bg-white rounded-lg shadow-lg">
                  <div className="p-4">
                    <h2 className="text-lg font-bold">{alimento}</h2>
                    {busquedaCategorias[alimento].slice(0, 1).map((item) => (
                      <div key={item._id} className="mt-4">
                        <h3 className="text-md font-medium">{item.nombre}</h3>
                        <h4 className={`text-sm font-medium ${item.tienda === 'Soriana' ? 'text-green-500' : 'text-orange-500'}`}>
                          {item.tienda}
                        </h4>
                        <p className="text-sm font-medium">${item.precio}</p>
                        <p className="text-sm font-small">{item.fecha}</p>
                        <div className="mt-2">
                          <small>Palabras Clave</small>
                          <br></br>
                          {item.palabrasClaveEncontradas.map((e) => (
                            <span
                              key={e}
                              className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                        <br></br>
                        
                      </div>
                    ))}

                  </div>
                  <div className="border-t-2 border-gray-200 mt-4 pt-4">
                    <h4 className="text-md text-center font-medium mb-2">Precios</h4>
                    {busquedaCategorias[alimento].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).map((item) => (
                    <div key={item._id} className="flex justify-between mb-2 px-4">
                      <h5 className="text-sm text-center font-medium">Fecha {item.fecha}</h5>
                      <h5 className="text-sm text-center font-medium">${item.precio}</h5>
                    </div>
                  ))}

                  </div>
        

                </div>
              ))}
            </div>
          </>
          </div>
        )}
      </div>
    </>
  );
}
