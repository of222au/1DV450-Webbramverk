# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


User.delete_all
uA = User.create(email: 'admin@test.com', password: 'admin', password_confirmation: 'admin', is_admin: true)
u1 = User.create(email: 'user1@test.com', password: '1234', password_confirmation: '1234')
u2 = User.create(email: 'user2@test.com', password: '1234', password_confirmation: '1234')

UserApplication.delete_all
ua1 = UserApplication.create(user: u1, title: 'Test', description: 'Min testapplikation')
ua2 = UserApplication.create(user: u1, title: 'Test2', description: 'Min andra testapplikation')
ua3 = UserApplication.create(user: u2, title: 'Test3', description: 'Min tredje testapplikation')


Creator.delete_all
c1 = Creator.create(username: 'user1', email: 'user1@test.com', password: '1234', password_confirmation: '1234')
c2 = Creator.create(username: 'user2', email: 'user2@test.com', password: '1234', password_confirmation: '1234')

Tag.delete_all
tag1 = Tag.create(name: 'Konsert')
tag2 = Tag.create(name: 'Teater')
tag3 = Tag.create(name: 'Show')

Event.delete_all
e1 = Event.create(name: 'Konsert med Adele', creator: c1)
e2 = Event.create(name: 'Konsert med Coldplay', creator: c1)
e3 = Event.create(name: 'En fantastisk teater', creator: c2)
e4 = Event.create(name: 'Konsert med Adele 2', creator: c1)
e5 = Event.create(name: 'Konsert med Coldplay 2', creator: c1)
e6 = Event.create(name: 'En fantastisk teater 2', creator: c2)
e7 = Event.create(name: 'Konsert med Adele 3', creator: c1)
e8 = Event.create(name: 'Konsert med Coldplay 3', creator: c1)
e9 = Event.create(name: 'En fantastisk teater 3', creator: c2)
e10 = Event.create(name: 'En fantastisk teater 4', creator: c2)
e11 = Event.create(name: 'Konsert med Coldplay 4', creator: c2)
e1.tags << tag1
e2.tags << tag1
e3.tags << tag2
e4.tags << tag1
e5.tags << tag1
e6.tags << tag2
e7.tags << tag1
e8.tags << tag1
e9.tags << tag2
e10.tags << tag2
e11.tags << tag1

Location.delete_all
loc1 = Location.create(name: 'Nånstans', latitude: 58.5, longitude: 14.5, event: e1)
loc2 = Location.create(name: 'Nånstans2', latitude: 58, longitude: 14, event: e2)
loc3 = Location.create(name: 'Nånstans3', latitude: 57.4, longitude: 13.8, event: e3)
loc4 = Location.create(name: 'Nånstans4', latitude: 58.6, longitude: 14.4, event: e4)
loc5 = Location.create(name: 'Nånstans5', latitude: 56.4, longitude: 14.1, event: e5)
loc6 = Location.create(name: 'Nånstans6', latitude: 52.4, longitude: 13.7, event: e6)
loc7 = Location.create(name: 'Annanstans7', latitude: 58.6, longitude: 14.4, event: e7)
loc8 = Location.create(name: 'Annanstans8', latitude: 56.4, longitude: 14.1, event: e8)
loc9 = Location.create(name: 'Annanstans9', latitude: 52.4, longitude: 13.7, event: e9)
loc10 = Location.create(name: 'Annanstans10', latitude: 58.6, longitude: 14.4, event: e10)
loc11 = Location.create(name: 'Annanstans11', latitude: 56.4, longitude: 14.1, event: e11)