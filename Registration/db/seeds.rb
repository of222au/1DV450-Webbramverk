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


