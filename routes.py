from flask import Flask, request, jsonify, Blueprint
import db
from models import User, Cocktail, Dish, Favorite, Pairing, Post
from werkzeug.security import generate_password_hash
import logging
import cloudinary.uploader
import cloudinary
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import JWTManager
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from sqlalchemy.orm import joinedload

logging.basicConfig(level=logging.DEBUG)

api = Blueprint('api', __name__)

# Configurar JWT
app = Flask(__name__)

@api.route('/test')
def test():
    return {"message": "Hello from Flask"}


# Endpoint de login
@api.route("/login", methods=["POST"])
def login():
    data = request.json
    if not data:
        return jsonify({"error": "No se proporcionaron datos"}), 400

    email = data.get("email")
    password = data.get("password")

    # Buscar al usuario solo por email
    user = db.session.query(User).filter(User.email == email).first()

    # Validar que el usuario existe y que la contraseña es correcta
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    # Generar token JWT usando el identificador correcto
    access_token = create_access_token(identity=user.user_id)
    return jsonify({"token": access_token, "user": user.serialize()}), 200



# Endpoint protegido con JWT
@api.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200


# Endpoints sobre usuarios
@api.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])

@api.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.serialize())

@api.route("/new-user", methods=["POST"])
def create_user():
    data = request.json
    
    # Verificar que los datos existan
    if not data:
        return jsonify({"error": "No se proporcionaron datos de entrada."}), 400

    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    if not email or not username or not password:
        return jsonify({"error": "Faltan campos requeridos (email, username, password)."}), 400

    # Verificar si el usuario o email ya están registrados
    existing_user = db.session.query(User).filter((User.email == email) | (User.username == username)).first()
    if existing_user:
        return jsonify({"error": "El usuario o email ya están registrados"}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(  
        username=username,
        email=email,
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 201


@api.route("/user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    if not data:
        return jsonify({"error": "No se proporcionaron datos de entrada."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    user.name = data.get("name", user.name)
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)

    new_password = data.get("password")
    if new_password is not None: 
        user.password = generate_password_hash(new_password)

    try:
        db.session.commit()
        return jsonify({"msg": "Usuario actualizado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route("/user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "Usuario eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# endpoints cocktails
@api.route("/cocktails", methods=["GET"])
def get_cocktails():
    cocktails = db.session.query(Cocktail).all()
    return jsonify([cocktail.serialize() for cocktail in cocktails])

@api.route("/cocktail/<int:Cocktail_id>", methods=["GET"])
def get_cocktail(Cocktail_id):
    cocktail = Cocktail.query.get_or_404(Cocktail_id)
    return jsonify(cocktail.serialize())


@api.route("/cocktail", methods=["POST"])
def create_cocktail():
    data = request.json
    file = request.files.get("url_image") 

    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400

    cocktail_name = data.get("name")
    preparation_steps = data.get("preparation_steps")
    flavor_profile = data.get("flavor_profile")
    user_id = data.get("user_id")
    url_image = data.get("url_image")


    if not cocktail_name:
        return jsonify({"Error": "El nombre del cóctel es obligatorio."}), 400
    if not preparation_steps:
        return jsonify({"Error": "Los pasos de preparación son obligatorios."}), 400
    if not flavor_profile:
        return jsonify({"Error": "El perfil de sabor es obligatorio."}), 400
    if not user_id:
        return jsonify({"Error": "El ID de usuario es obligatorio."}), 400
    if not url_image:
        return jsonify({"Error": "La URL de la imagen es obligatoria."}), 400


    # Si hay un archivo de imagen, subirla a Cloudinary
    if file:
        try:
            upload_result = cloudinary.uploader.upload(file)
            url_image = upload_result["secure_url"]
            print("URL de la imagen:", url_image)
        except Exception as e:
            return jsonify({"Error": f"Error al cargar la imagen: {str(e)}"}), 500

    # Crear el nuevo cóctel
    new_cocktail = Cocktail(
        name=cocktail_name,
        preparation_steps=preparation_steps,
        flavor_profile=flavor_profile,
        user_id=user_id,
        url_image=url_image  # Si no hay imagen, se guardará como None
    )
    print("Nuevo cóctel antes de agregar:", new_cocktail)
    try:
        db.session.add(new_cocktail)
        db.session.commit()
        return jsonify(new_cocktail.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": f"Error al guardar el cóctel: {str(e)}"}), 500



@api.route("/cocktail/<int:Cocktail_id>", methods=["PUT"])
def update_cocktail(Cocktail_id):
    data = request.json
    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400

    cocktail = db.session.query(Cocktail).get(Cocktail_id)
    if not cocktail:
        return jsonify({"Error": "Cóctel no encontrado."}), 404

    cocktail.name = data.get("name", cocktail.name)
    cocktail.preparation_steps = data.get("preparation_steps", cocktail.preparation_steps)
    cocktail.flavor_profile = data.get("flavor_profile", cocktail.flavor_profile)

    try:
        db.session.commit()
        return jsonify({"Success": "Cóctel actualizado correctamente."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500


    data = request.json
    file = request.files.get("image") 

    cocktail = Cocktail.query.get(Cocktail_id)
    if not cocktail:
        return jsonify({"Error": "Cóctel no encontrado."}), 404

    cocktail.name = data.get("name", cocktail.name)
    cocktail.preparation_steps = data.get("preparation_steps", cocktail.preparation_steps)
    cocktail.flavor_profile = data.get("flavor_profile", cocktail.flavor_profile)

    try:
        # Subir nueva imagen a Cloudinary si se proporciona
        if file:
            upload_result = cloudinary.uploader.upload(file)
            cocktail.url_image = upload_result["secure_url"]

        db.session.commit()
        return jsonify({"Success": "Cóctel actualizado correctamente."}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar el cóctel:", e)
        return jsonify({"Error": str(e)}), 500

    data = request.json
    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400
    cocktail = Cocktail.query.get(Cocktail_id)
    if not cocktail:
        return jsonify({"Error": "Cóctel no encontrado."}), 404
    cocktail.name = data.get("name", cocktail.name)
    cocktail.preparation_steps = data.get("preparation_steps", cocktail.preparation_steps)
    cocktail.flavor_profile = data.get("flavor_profile", cocktail.flavor_profile)
    try:
        db.session.commit()
        return jsonify({"Success": "Cóctel actualizado correctamente."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500


@api.route("/cocktail/<int:Cocktail_id>", methods=["DELETE"])
def delete_cocktail(Cocktail_id):
    cocktail = Cocktail.query.get(Cocktail_id)
    if not cocktail:
        return jsonify({"Error": "Cóctel no encontrado."}), 404
    try:
        db.session.delete(cocktail)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

    return jsonify({"msg": "Cóctel eliminado correctamente."})

# endpoints platos
@api.route("/dishes", methods=["GET"])
def get_dishes():
    dishes = Dish.query.all()
    return jsonify([dish.serialize() for dish in dishes])

@api.route("/dish/<int:Dish_id>", methods=["GET"])
def get_dish(Dish_id):
    dish = Dish.query.get_or_404(Dish_id)
    return jsonify(dish.serialize())

@api.route("/dish", methods=["POST"])
def post_dish():
    data = request.json
    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400
    dish = data.get
    if not dish:
        return jsonify({"Error": "El plato es necesario."}), 400
    new_dish = Dish(
        name=data.get("name"),
        preparation_steps=data.get("preparation_steps"),
        flavor_profile=data.get("flavor_profile"),
        url_image = data.get("url_image")

    )
    db.session.add(new_dish)
    db.session.commit()
    return jsonify(new_dish.serialize())

@api.route("/dish/<int:Dish_id>", methods=["PUT"])
def update_dish(Dish_id):
    
    data = request.json
    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400
   
    dish = Dish.query.get(Dish_id)
    if not dish:
        return jsonify({"Error": "Plato no encontrado."}), 404
    dish.name = data.get("name", dish.name)
    dish.preparation_steps = data.get("preparation_steps", dish.preparation_steps)
    dish.flavor_profile = data.get("flavor_profile", dish.flavor_profile)
    try:
        db.session.commit()
        return jsonify({"Success": "Plato actualizado correctamente."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

@api.route("/dish/<int:Dish_id>", methods=["DELETE"])
def delete_dish(Dish_id):
    dish = Dish.query.get(Dish_id)
    if not dish:
        return jsonify({"Error": "Plato no encontrado."}), 404
    try:
        db.session.delete(dish)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

    return jsonify({"msg": "Plato eliminado correctamente."})


@api.route("/favorites", methods=["GET"])
def get_favourites():
    favorites = db.session.query(Favorite).all()
    return jsonify([favorite.serialize() for favorite in favorites])


@api.route("/get-favorite/<int:favorite_id>", methods=["GET"])
def get_favorite(favorite_id):
   
    favorite = Favorite.query.get_or_404(favorite_id)
    return jsonify(favorite.serialize())

@api.route("/favorite", methods=["POST"])
def create_favorite():
    data = request.json
    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400
    user_id = data.get('user_id')
    cocktail_id = data.get('cocktail_id')
    dish_id = data.get('dish_id')
    if not user_id or (not cocktail_id and not dish_id):
        return jsonify({"Error": "Se requieren el ID de usuario y ya sea el ID de cóctel o de plato."}), 400
    if cocktail_id and dish_id:
        return jsonify({"Error": "Solo puedes marcar como favorito un plato o un cóctel, no ambos."}), 400

    new_favorite = Favorite(
        user_id=user_id,
        cocktail_id=cocktail_id,
        dish_id=dish_id
    )
    try:
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify(new_favorite.serialize()), 201
    except Exception as e:
        db.session.rollback()
        logging.exception("Ocurrió un error durante la creación del favorito.")
        return jsonify({"Error": str(e)}), 500

@api.route("/favorite/<int:fav_id>", methods=["PUT"])
def update_favorite(fav_id):
    data = request.json
    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400
    cocktail_id = data.get('cocktail_id')
    dish_id = data.get('dish_id')

    if not cocktail_id and not dish_id:
        return jsonify({"Error": "Se requiere el ID de cóctel o el ID de plato."}), 400


    favorite = Favorite.query.get(fav_id)
    if not favorite:
        return jsonify({"Error": "Favorito no encontrado."}), 404

   
    if cocktail_id is not None:
        favorite.cocktail_id = cocktail_id
    if dish_id is not None:
        favorite.dish_id = dish_id

    try:
        db.session.commit()
        return jsonify(favorite.serialize()), 200
    except Exception as e:
        db.session.rollback()
        logging.error("Error al guardar en la base de datos: %s", str(e))
        return jsonify({"Error": str(e)}), 500

@api.route("/favorite/<int:favorite_id>", methods=["DELETE"])
def delete_favorite(favorite_id):
    favorite = Favorite.query.get(favorite_id)
    if not favorite:
        return jsonify({"Error": "Favorito no encontrado."}), 404

    try:
        db.session.delete(favorite)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

    return jsonify({"msg": "Favorito eliminado"}), 200

@api.route("/pairings", methods=["GET"])
def get_pairings():
    pairings = Pairing.query.all()
    return jsonify([pairing.serialize() for pairing in pairings])

@api.route("/pairing/<int:pairing_id>", methods=["GET"])
def get_pairing(pairing_id):
    pairing = Pairing.query.get_or_404(pairing_id)
    return jsonify(pairing.serialize())

@api.route("/pairing", methods=["POST"])
def create_pairing():
    data = request.get_json()

    user_id = data.get('user_id')
    cocktail_id = data.get('cocktail_id')
    dish_id = data.get('dish_id')

    if not all([user_id, cocktail_id, dish_id]):
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    new_pairing = Pairing(user_id=user_id, cocktail_id=cocktail_id, dish_id=dish_id)

    db.session.add(new_pairing)
    db.session.commit()

    return jsonify(new_pairing.serialize()), 201

@api.route('/pairing/<int:pairing_id>', methods=['PUT'])
def update_pairing(pairing_id):
    data = request.get_json()
    pairing = Pairing.query.get_or_404(pairing_id)

    if 'user_id' in data:
        pairing.user_id = data['user_id']
    if 'cocktail_id' in data:
        pairing.cocktail_id = data['cocktail_id']
    if 'dish_id' in data:
        pairing.dish_id = data['dish_id']

    db.session.commit()

    return jsonify(pairing.serialize()), 200

@api.route('/pairing/<int:pairing_id>', methods=['DELETE'])
def delete_pairing(pairing_id):
    pairing = Pairing.query.get_or_404(pairing_id)

    db.session.delete(pairing)
    db.session.commit()

    return jsonify({"mensaje": "Emparejamiento eliminado correctamente"}), 200

@api.route("/post", methods=["GET"])
def get_posts():
    try:
        # Usamos joinedload para cargar el usuario asociado al post
        posts = db.session.query(Post).options(joinedload(Post.user)).all()
        return jsonify([post.serialize() for post in posts])
    except Exception as e:
        return jsonify({"Error": f"Error al obtener los posts: {str(e)}"}), 500




@api.route("/post/<int:post_id>", methods=["GET"])
def get_post(post_id):
    # Usamos db.session.query y get() en lugar de get_or_404 (puedes implementarlo si lo deseas)
    post = db.session.query(Post).get(post_id)
    if not post:
        return jsonify({"Error": "Post no encontrado."}), 404
    return jsonify(post.serialize()), 200




@api.route("/post", methods=["POST"])
def create_post():
    data = request.json
    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400
    
    content = data.get("content")
    user_id = data.get("user_id")
    
    if not content or not user_id:
        return jsonify({"Error": "Faltan campos requeridos (content, user_id)."}), 400
    
    new_post = Post(
        content=content,
        user_id=user_id
    )
    
    try:
        db.session.add(new_post)
        db.session.commit()
        return jsonify(new_post.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500


@api.route("/post/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    data = request.json
    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400
    
    # Usamos db.session.query para obtener el post
    post = db.session.query(Post).get(post_id)
    if not post:
        return jsonify({"Error": "Post no encontrado."}), 404
    
    # Actualizamos solo el contenido, ya que no existe 'title'
    post.content = data.get("content", post.content)
    
    try:
        db.session.commit()
        return jsonify({"Success": "Post actualizado correctamente."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500

    data = request.json
    if not data:
        return jsonify({"Error": "No se proporcionaron datos de entrada."}), 400
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"Error": "Post no encontrado."}), 404
    
    post.title = data.get("title", post.title)
    post.content = data.get("content", post.content)
    
    try:
        db.session.commit()
        return jsonify({"Success": "Post actualizado correctamente."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500


@api.route("/post/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    post = db.session.query(Post).get(post_id)
    if not post:
        return jsonify({"Error": "Post no encontrado."}), 404
    
    try:
        db.session.delete(post)
        db.session.commit()
        return jsonify({"msg": "Post eliminado correctamente."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Error": str(e)}), 500


if __name__ == '__main__':
    api.run(debug=True)