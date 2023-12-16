const {createApp} = Vue;
createApp({
  data() {
    return {
      //carrusel
      productosCarrusel: [],
      currentIndex: 0,
      intervalId: null,
      //muestra pagina
      pagina:'principal',
      loading:false,
      //productos hombre
      productosHombre:[],
      productosMujer:[],
      productosComplementos:[],
      productosElectronica:[],
      productoDetalle:null,
      cart:[],
      sumaCantidadesCarrito:[0,0],
      //creo las variables de ordenacion vacias, con los inputs del html los modifico, y en el .watch si el valor de la variable cambia me ejecuta la funcion de ordenacion 'ordenarProductos()'
      ordenarHombre: '',
      ordenarMujer: '',
      ordenarComplementos: '',
      ordenarElectronica: '',
    };
  },
  methods: {
    vaciarCarrito(){
      console.log('vaciar carrito');
      this.cart=[];
      let arrayCarrito = JSON.stringify(this.cart);
      localStorage.setItem('carrito', arrayCarrito);
      this.obtenerItemsCarrito();
    },
    ordenarProductos(productos, criterio) {
      if (criterio.includes('nombre')) {
        productos.sort((a, b) => criterio == 'nombre-asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
      } else if (criterio.includes('precio')) {
        productos.sort((a, b) => criterio == 'precio-asc' ? a.price - b.price : b.price - a.price);
      }
    },
    changuePage(pagina){
      this.pagina=pagina;
    },
    obtenerProductosHombre(){
      this.switchLoading()
      fetch("https://fakestoreapi.com/products/category/men's clothing")
        .then(respuesta=>{
          if(!respuesta.ok){
            throw new Error('Ha habido algun problema al obtener los productos de hombre');
          }
          return respuesta.json();
        })
        .then(data=>{
          this.productosHombre=data;
          console.log(this.productosHombre);
        })
        .catch(error=>{
          console.error('Error al obtener productos:',error);
        })
        .finally(()=>{
          this.switchLoading()
        })
    },
    obtenerProductosMujer(){
      this.switchLoading()
      fetch("https://fakestoreapi.com/products/category/women's clothing")
        .then(respuesta=>{
          if(!respuesta.ok){
            throw new Error('Ha habido algun problema al obtener los productos de hombre');
          }
          return respuesta.json();
        })
        .then(data=>{
          this.productosMujer=data;
          console.log(this.productosMujer);
        })
        .catch(error=>{
          console.error('Error al obtener productos:',error);
        })
        .finally(()=>{
          this.switchLoading()
        })
    },
    obtenerProductosComplementos(){
      this.switchLoading()
      fetch("https://fakestoreapi.com/products/category/jewelery")
        .then(respuesta=>{
          if(!respuesta.ok){
            throw new Error('Ha habido algun problema al obtener los productos de hombre');
          }
          return respuesta.json();
        })
        .then(data=>{
          this.productosComplementos=data;
          console.log(this.productosComplementos);
        })
        .catch(error=>{
          console.error('Error al obtener productos:',error);
        })
        .finally(()=>{
          this.switchLoading()
        })
    },
    obtenerProductosElectronica(){
      this.switchLoading()
      fetch("https://fakestoreapi.com/products/category/electronics")
        .then(respuesta=>{
          if(!respuesta.ok){
            throw new Error('Ha habido algun problema al obtener los productos de hombre');
          }
          return respuesta.json();
        })
        .then(data=>{
          this.productosElectronica=data;
          console.log(this.productosElectronica);
        })
        .catch(error=>{
          console.error('Error al obtener productos:',error);
        })
        .finally(()=>{
          this.switchLoading()
        })
    },
    obtenerProductos() {
      this.switchLoading()
      fetch('https://fakestoreapi.com/products?limit=10')
        .then(respuesta => {
          if (!respuesta.ok) {
            throw new Error('Ha habido algun problema al obtener los productos');
          }
          return respuesta.json();
        })
        .then(data => {
          this.productosCarrusel = data;
          this.startInterval();
        })
        .catch(error => {
          console.error('Error al obtener productos:', error);
        })
        .finally(()=>{
          this.switchLoading()
        })
    },
    switchLoading(){
      this.loading=!this.loading
    },
    //CARROUSEL
    startInterval() {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.productosCarrusel.length;
        this.updateTransform();
      }, 4000);
    },
    carrouselClick() {
      this.currentIndex = (this.currentIndex + 1) % this.productosCarrusel.length;
      clearInterval(this.intervalId);
      this.updateTransform();
      this.startInterval();
    },
    updateTransform() {
      if(this.pagina=='principal'){
        const carrusel = document.querySelector('.carrusel-wrapper');
        carrusel.style.transform = `translateX(${-this.currentIndex * 100}%)`;
      }
      
    },
    //FIN CARROUSEL
    mostrarDetalle(id, pagina){
      this.pagina='detalle';
      this.loading=true;
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then(respuesta=>{
          if(!respuesta.ok){
            throw new Error('Ha habido algun problema al obtener el producto');
          }
          return respuesta.json();
        })
        .then(data=>{
          this.productoDetalle=data;
          this.productoDetalle.pagina=pagina;
        })
        .catch(error=>{
          console.error('Error al obtener producto:',error);
        })
        .finally(()=>{
          this.loading=false;
        })
    },
    addToCart(id) {
      let productoEncontrado = this.cart.find(item => item.id == id);
    
      if (productoEncontrado) {
        productoEncontrado.cantidad++;
      } else {
        let productoACarrito = {...this.productoDetalle, cantidad: 1};
        this.cart.push(productoACarrito);
      }
      if(this.pagina!='carrito'){
        this.pagina='carrito'
      }
      let arrayCarrito = JSON.stringify(this.cart);
      localStorage.setItem('carrito', arrayCarrito);
      this.obtenerItemsCarrito();
    },
    cargarCarrito(){
      let carrito = localStorage.getItem('carrito');
      if(carrito){
        this.cart=JSON.parse(carrito);
        console.log(this.cart);
      }
      this.obtenerItemsCarrito();
      
    },
    obtenerItemsCarrito(){
      let suma=0;
      let precio=0;
      this.cart.forEach((element) => {
        suma+=element.cantidad;
        
        precio+=element.price*element.cantidad;
      });
      this.sumaCantidadesCarrito[0]=suma;
      this.sumaCantidadesCarrito[1]=parseFloat(precio.toFixed(2));
    },
    deleteFromCarrito(id) {
      let productoEncontrado = this.cart.find(item => item.id == id);
      if (productoEncontrado) {
        productoEncontrado.cantidad--;
        if(productoEncontrado.cantidad==0){
          let indice = this.cart.indexOf(productoEncontrado);
          this.cart.splice(indice, 1);
        }
      }
      let arrayCarrito = JSON.stringify(this.cart);
      localStorage.setItem('carrito', arrayCarrito);
      this.obtenerItemsCarrito();
    },
    addFromCarrito(id) {
      let productoEncontrado = this.cart.find(item => item.id == id);
      if (productoEncontrado) {
        productoEncontrado.cantidad++;
      }
      let arrayCarrito = JSON.stringify(this.cart);
      localStorage.setItem('carrito', arrayCarrito);
      this.obtenerItemsCarrito();
    },
  }, 
  watch: {
    //hace que cuando la pagina cambia se carguen los productos requeridos si no estan cargados para que no se cargue todo de golpe al iniciar la pagina
    pagina(newValue) {
      if(newValue=='hombre' && this.productosHombre.length===0){
        this.obtenerProductosHombre()
      }else if(newValue=='mujer' && this.productosMujer.length===0){
        this.obtenerProductosMujer()
      }else if(newValue=='complementos' && this.productosComplementos.length===0){
        this.obtenerProductosComplementos()
      }else if(newValue=='electronica' && this.productosElectronica.length===0){
        this.obtenerProductosElectronica()
      }
    },
    
    ordenarHombre(newValue) {
      this.ordenarProductos(this.productosHombre, newValue);
    },
    ordenarMujer(newValue) {
      this.ordenarProductos(this.productosMujer, newValue);
    },
    ordenarComplementos(newValue) {
      this.ordenarProductos(this.productosComplementos, newValue);
    },
    ordenarElectronica(newValue) {
      this.ordenarProductos(this.productosElectronica, newValue);
    },
  },
  mounted() {
    this.cargarCarrito()
    this.obtenerProductos();
  },

}).mount('#app')
