from flask import Flask, render_template, redirect, url_for, request



app = Flask(__name__)




@app.route('/dashboard/')

def dashboard():
    return render_template('dashboard.html')


#Esta ruta me permite obtener la informacion de form que esta en el tamplate
@app.route('/', methods=['GET', 'POST'])
# esta vista me permite verificar y realizar algun tipo de proceso con los datos
def login():
    if request.method == "POST":
        # En esta varioable obtenemos el input con name "usuario" 
        name = request.form.get('usuario')
        # En esta variable obtenemos el input con name "password"
        passw = request.form.get('password')


        # esto me permite realizar una redireccion a una pagina x del sitio claramente lo que me permite esto es enviara un argumento tambien a la funcion dashboard
        return redirect(url_for('dashboard'))
    return render_template('login.html')




    
