const {Board} = require('./Board')
const {User} = require('./User')
const {Cheese} = require('./Cheese')

Board.belongsTo(User)
User.hasMany(Board)

Board.belongsToMany(Cheese, {through: 'cheese_board_table'})
Cheese.belongsToMany(Board, {through: 'cheese_board_table'})

module.exports = { Board, User, Cheese }