from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum, Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship

import db

class User(db.Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(255), nullable=False)  # Encrypted
    profile_info = Column(String(255), nullable=True)

    def serialize(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "profile_info": self.profile_info,
        }
    def __str__(self):
        return f'<User {self.username}>'


class Cocktail(db.Base):
    __tablename__ = 'cocktails'

    cocktail_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    preparation_steps = Column(String, nullable=True)
    flavor_profile = Column(Enum('sweet', 'sour', 'bitter', 'salty', 'umami', name='cocktail_enum'),
                               nullable=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=True)

    def serialize(self):
        return {
            "cocktail_id": self.cocktail_id,
            "name": self.name,
            "preparation_steps": self.preparation_steps,
            "flavor_profile": self.flavor_profile,
            "user_id": self.user_id,
        }

    def __str__(self):
        return f'<Cocktail {self.name}: \n {self.preparation_steps} \n Perfil de sabor: {self.flavor_profile}>'



class Dish(db.Base):
    __tablename__ = 'dishes'

    dish_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    ingredients = Column(String(100), nullable=True)
    preparation_steps = Column(String, nullable=True)
    flavor_profile = Column(Enum('sweet', 'sour', 'bitter', 'salty', 'umami', name='flavor_profile_enum'),
                               nullable=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=True)

    def serialize(self):
        return {
            "dish_id": self.dish_id,
            "name": self.name,
            "ingredients" : self.ingredients,
            "preparation_steps": self.preparation_steps,
            "flavor_profile": self.flavor_profile,
            "user_id": self.user_id,
        }

    def __str__(self):
        return (f'<Plato {self.name} \n Ingredientes: {self.ingredients} \n pasos a seguir: {self.preparation_steps}'
                f' \n Perfil de sabor: {self.flavor_profile}>')


class Favorite(db.Base):
    __tablename__ = 'favorites'

    favorite_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=True)
    cocktail_id = Column(Integer, ForeignKey('cocktails.cocktail_id'), nullable=True)
    dish_id = Column(Integer, ForeignKey('dishes.dish_id'), nullable=True)

    cocktail = relationship("Cocktail", backref="favorites")
    dish = relationship("Dish", backref="favorites")
    user = relationship('User', backref='favorites', lazy=True)

    def serialize(self):
        return {
            "favorite_id": self.favorite_id,
            "user_id": self.user_id,
            "cocktail_id": self.cocktail_id,
            "dish_id": self.dish_id,
        }

    def __str__(self):
        if self.cocktail:
            return f'<Favorito: {self.user_id}, Cocktail: {self.cocktail.name}>'
        elif self.dish:
            return f'<Favorito: {self.user_id}, Plato: {self.dish.name}>'
        else:
            return '<Favorito sin especificar>'


class Pairing(db.Base):
    __tablename__ = 'pairings'

    pairing_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=True)
    cocktail_id = Column(Integer, ForeignKey('cocktails.cocktail_id'), nullable=True)
    dish_id = Column(Integer, ForeignKey('dishes.dish_id'), nullable=True)

    user = relationship('User', backref='pairings', lazy=True)
    cocktail = relationship('Cocktail', backref='pairings', lazy=True)
    dish = relationship('Dish', backref='pairings', lazy=True)

    def serialize(self):
        return {
            "pairing_id": self.pairing_id,
            "user_id": self.user_id,
            "cocktail_id": self.cocktail_id,
            "dish_id": self.dish_id,
        }

    def __str__(self):
        return f'<Maridaje:\n  Cocktail: {self.cocktail.name}, Plato: {self.dish.name}>'


class Post(db.Base):
    __tablename__ = 'posts'

    post_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=True)
    content = Column(String, nullable=False)

    user = relationship('User', backref='posts', lazy=True)

    def serialize(self):
        return {
            "post_id": self.post_id,
            "user_id": self.user_id,
            "content": self.content,
        }

    def __str__(self):
        return f'<Post creado por: {self.user.name if self.user else "Desconocido"}, Contenido: {self.content[:20]}>'


'''



class Comment(Base):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    content = db.Column(db.Text, nullable=False)
    creation_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    post = db.relationship('Post', backref=db.backref('comments', lazy=True))
    user = db.relationship('User', backref=db.backref('comments', lazy=True))

    def __repr__(self):
        return f'<Comment User: {self.user_id}, Post: {self.post_id}, Content: {self.content[:20]}>'

    def serialize(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "user_id": self.user_id,
            "content": self.content,
            "creation_date": self.creation_date
        }


class Chat(Base):
    __tablename__ = 'chats'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    is_group = db.Column(db.Boolean, default=False)
    creation_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<Chat {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_group": self.is_group,
            "creation_date": self.creation_date
        }


class ChatParticipant(Base):
    __tablename__ = 'chat_participants'

    chat_id = db.Column(db.Integer, db.ForeignKey('chats.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    chat = db.relationship('Chat', backref=db.backref('chat_participants', lazy=True))
    user = db.relationship('User', backref=db.backref('chat_participants', lazy=True))

    def __repr__(self):
        return f'<ChatParticipant Chat: {self.chat_id}, User: {self.user_id}>'

    def serialize(self):
        return {
            "chat_id": self.chat_id,
            "user_id": self.user_id
        }


class Message(Base):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chats.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    content = db.Column(db.Text, nullable=False)
    sent_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    chat = db.relationship('Chat', backref=db.backref('messages', lazy=True))
    user = db.relationship('User', backref=db.backref('messages', lazy=True))

    def __repr__(self):
        return f'<Message Chat: {self.chat_id}, User: {self.user_id}, Content: {self.content[:20]}>'

    def serialize(self):
        return {
            "id": self.id,
            "chat_id": self.chat_id,
            "user_id": self.user_id,
            "content": self.content,
            "sent_date": self.sent_date
        }


class Notification(Base):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    type = db.Column(db.Enum('comment', 'message', 'new_follower', 'other', name='notification_enum'), nullable=False)
    content = db.Column(db.Text)
    read = db.Column(db.Boolean, default=False)
    date = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('notifications', lazy=True))

    def __repr__(self):
        return f'<Notification User: {self.user_id}, Type: {self.type}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type": self.type,
            "content": self.content,
            "read": self.read,
            "date": self.date
        }


class Follow(Base):
    __tablename__ = 'follows'

    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    date = db.Column(db.DateTime, default=db.func.current_timestamp())

    follower = db.relationship('User', foreign_keys=[follower_id], backref=db.backref('follows', lazy=True))
    followed = db.relationship('User', foreign_keys=[followed_id], backref=db.backref('followers', lazy=True))

    def __repr__(self):
        return f'<Follow Follower: {self.follower_id}, Following: {self.followed_id}>'

    def serialize(self):
        return {
            "follower_id": self.follower_id,
            "followed_id": self.followed_id,
            "date": self.date
        }

'''
db.Base.metadata.create_all(db.engine)








