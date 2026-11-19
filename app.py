from flask import Flask, render_template, redirect, url_for, request
from lib.usuarios import ValidataionLogin


app = Flask(__name__)




@app.route('/dashboard/admin')
def dashboard():
    return render_template('dashboard.html')


@app.route('/dashboard/productividad')
def  productividad():
    return render_template('productividad.html')


#Esta ruta me permite obtener la informacion de form que esta en el tamplate
@app.route('/', methods=['GET', 'POST'])
# esta vista me permite verificar y realizar algun tipo de proceso con los datos
def login():
    if request.method == "POST":
        # En esta varioable obtenemos el input con name "usuario" 
        name = request.form.get('usuario')
        # En esta variable obtenemos el input con name "password"
        passw = request.form.get('password')

        # Este punto de validacaion peramite realizar un control de acceso para el login 
        validator = ValidataionLogin(credentcials=[name, passw])
        try:
            if validator[0][0] == 1 and validator[0][1] == True:   

                # esto me permite realizar una redireccion a una pagina x del sitio claramente lo que me permite esto es enviara un argumento tambien a la funcion dashboard
                return redirect(url_for('dashboard'))
        
            elif validator[0][0] == 2 and validator[0][1] == True:

                return redirect(url_for('productividad'))
        except IndexError:
            return render_template('login.html')
    else:
        return render_template('login.html')




    
