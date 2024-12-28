from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, func, Boolean
from sqlalchemy.orm import relationship, backref
import db

class User(db.Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    registration_date = Column(DateTime, nullable = True)
    profile_info = Column(String)
    avatar_url = Column(String(255))

    # Relación muchos a muchos con Chat a través de la tabla intermedia ChatParticipant
    chats = relationship('Chat', secondary='chat_participants', back_populates='participants')

    def __init__(self, name, username, email, password, registration_date, profile_info, avatar_url):
        self.name = name
        self.username = username
        self.email = email
        self.password = password
        self.registration_date = registration_date
        self.profile_info = profile_info
        self.avatar_url = avatar_url

    def __str__(self):
        return f'<User {self.username}>'

class Ingredient(db.Base):
    __tablename__ = 'ingredients'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    type = Column(
        Enum('dish', 'cocktail', name='ingredient_type'),
        nullable=False
    )

    def __init__(self, name, type):
        self.name = name
        self.type = type

    def __str__(self):
        return f'<Ingredient {self.name}, Type: {self.type}>'

class Cocktail(db.Base):
    __tablename__ = 'cocktails'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    preparation_steps = Column(String, nullable=False)
    flavor_profile = Column(Enum('sweet', 'sour', 'bitter', 'salty', 'umami', name='cocktail_enum'),
                               nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    creation_date = Column(DateTime, nullable = True)

    user = relationship('User', backref=backref('cocktails', lazy=True))

    def __init__(self, name, preparation_steps, flavor_profile, user_id, creation_date,
                 user):
        self.name = name
        self.preparation_steps = preparation_steps
        self.flavor_profile = flavor_profile
        self.user_id = user_id
        self.creation_date = creation_date
        self.user = user

    def __str__(self):
        return f'<Cocktail {self.name}>'

class Dish(db.Base):
    __tablename__ = 'dishes'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    preparation_steps = Column(String, nullable=False)
    flavor_profile = Column(Enum('sweet', 'sour', 'bitter', 'salty', 'umami', name='flavor_profile_enum'),
                               nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    creation_date = Column(DateTime, default=func.current_timestamp())

    user = relationship('User', backref=backref('dishes', lazy=True))

    def __init__(self, name, preparation_steps, flavor_profile, user_id, creation_date, user):
        self.name = name
        self.preparation_steps = preparation_steps
        self.flavor_profile = flavor_profile
        self.user_id = user_id
        self.creation_date = creation_date
        self.user = user

    def __str__(self):
        return f'<Dish {self.name}>'

class Favorite(db.Base):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    cocktail_id = Column(Integer, ForeignKey('cocktails.id'))
    dish_id = Column(Integer, ForeignKey('dishes.id'))
    saved_date = Column(DateTime, default=func.current_timestamp())

    user = relationship('User', backref=backref('favorites', lazy=True))
    cocktail = relationship('Cocktail', backref=backref('favorites', lazy=True))
    dish = relationship('Dish', backref=backref('favorites', lazy=True))

    def __init__(self, user_id, cocktail_id, dish_id, saved_date,
                user, cocktail, dish):
        self.user_id = user_id
        self.cocktail_id = cocktail_id
        self.dish_id = dish_id
        self.saved_date =saved_date
        self.user = user
        self.dish = dish
        self.cocktail = cocktail

    def __str__(self):
        return f'<Favorite User: {self.user_id}, Cocktail: {self.cocktail_id}, Dish: {self.dish_id}>'

class Pairing(db.Base):
    __tablename__ = 'pairings'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    cocktail_id = Column(Integer, ForeignKey('cocktails.id'))
    dish_id = Column(Integer, ForeignKey('dishes.id'))
    saved_date = Column(DateTime, default=func.current_timestamp())

    user = relationship('User', backref=backref('pairings', lazy=True))
    cocktail = relationship('Cocktail', backref=backref('pairings', lazy=True))
    dish = relationship('Dish', backref=backref('pairings', lazy=True))

    def __init__(self, user_id, cocktail_id, dish_id, saved_date,
                user, cocktail, dish):
        self.user_id = user_id
        self.cocktail_id = cocktail_id
        self.dish_id = dish_id
        self.saved_date = saved_date
        self.user = user
        self.dish = dish
        self.cocktail = cocktail

    def __str__(self):
        return f'<Pairing User: {self.user_id}, Cocktail: {self.cocktail_id}, Dish: {self.dish_id}>'

class Post(db.Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    content = Column(String, nullable=False)
    creation_date = Column(DateTime, default=func.current_timestamp())
    user = relationship('User', backref=backref('posts', lazy=True))

    def __init__(self, user_id, content, creation_date, user):
        self.user = user
        self.user_id = user_id
        self.content = content
        self.creation_date = creation_date

    def __str__(self):
        return f'<Post User: {self.user_id}, Content: {self.content[:20]}>'

class Comment(db.Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey('posts.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    content = Column(String, nullable=False)
    creation_date = Column(DateTime, default=func.current_timestamp())

    post = relationship('Post', backref=backref('comments', lazy=True))
    user = relationship('User', backref=backref('comments', lazy=True))

    def __init__(self, post_id, user_id, content, creation_date, post, user):
        self.user_id = user_id
        self.creation_date = creation_date
        self.user = user
        self.post = post
        self.content = content
        self.post_id = post_id

    def __str__(self):
        return f'<Comment User: {self.user_id}, Post: {self.post_id}, Content: {self.content[:20]}>'

class Chat(db.Base):
    __tablename__ = 'chats'

    id = Column(Integer, primary_key=True)
    name_chat = Column(String(100))

    # Relación muchos a muchos con User a través de la tabla intermedia ChatParticipant
    participants = relationship('User', secondary='chat_participants', back_populates='chats')

    def __init__(self, name_chat):
        self.name_chat = name_chat

    def __str__(self):
        return f'<Chat {self.name_chat}>'

class ChatParticipant(db.Base):
    __tablename__ = 'chat_participants'

    chat_id = Column(Integer, ForeignKey('chats.id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)

    # Relación con las tablas Chat y User
    chat = relationship('Chat', back_populates='participants')
    user = relationship('User', back_populates='chats')

    def __init__(self, chat_id, user_id):
        self.chat_id = chat_id
        self.user_id = user_id

    def __str__(self):
        return f'<ChatParticipant Chat: {self.chat_id}, User: {self.user_id}>'

class Message(db.Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey('chats.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    content = Column(String, nullable=False)
    sent_date = Column(DateTime, default=func.current_timestamp())

    chat = relationship('Chat', backref=backref('messages', lazy=True))
    user = relationship('User', backref=backref('messages', lazy=True))

    def __init__(self, chat_id, user_id, content, sent_date):
        self.chat_id = chat_id
        self.user_id = user_id
        self.content = content
        self.sent_date = sent_date

    def __str__(self):
        return f'<Message Chat: {self.chat_id}, User: {self.user_id}, Content: {self.content[:20]}>'

class Notification(db.Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    type = Column(Enum('comment', 'message', 'new_follower', 'other', name='notification_enum'), nullable=False)
    content = Column(String)
    read = Column(Boolean, default=False)
    date = Column(DateTime, default=func.current_timestamp())

    user = relationship('User', backref=backref('notifications', lazy=True))

    def __init__(self, user_id, type, content, read, date):
        self.user_id = user_id
        self.type = type
        self.content = content
        self.read = read
        self.date = date

    def __str__(self):
        return f'<Notification User: {self.user_id}, Type: {self.type}>'

class Follow(db.Base):
    __tablename__ = 'follows'

    follower_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    followed_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    date = Column(DateTime, default=func.current_timestamp())

    follower = relationship('User', foreign_keys=[follower_id], backref=backref('follows', lazy=True))
    followed = relationship('User', foreign_keys=[followed_id], backref=backref('followers', lazy=True))

    def __init__(self, follower_id, followed_id, date):
        self.date = date
        self.followed_id = followed_id
        self.follower_id = follower_id

    def __str__(self):
        return f'<Follow Follower: {self.follower_id}, Following: {self.followed_id}>'

db.Base.metadata.create_all(db.engine)


