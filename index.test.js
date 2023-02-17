const {sequelize} = require('./db');
const {User, Board, Cheese} = require('./models/index');

describe('Restaurant and Menu Models', () => {

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    //Testing instances (next three tests)
    test('Can create a User instance in the db', async () =>{
        let user1 = User.create({
            name: 'user1',
            email: 'user1@email.com'
        })
        expect((await user1).dataValues.name).toBe('user1');
        expect((await user1).dataValues.email).toBe('user1@email.com');
    });


    test('Can create a Board instance in the db', async () =>{
        let board1 = Board.create({
            type: 'festive',
            description: 'Christmas themed cheeseboard',
            rating: 10
        })
        let board2 = Board.create({
            type: 'worse',
            description: 'The worse cheeseboard ever',
            rating: 1
        })
        expect((await board1).dataValues.type).toBe('festive');
        expect((await board1).dataValues.description).toBe('Christmas themed cheeseboard');
        expect((await board1).dataValues.rating).toBe(10);
    });


    test('Can create a Cheese instance in the db', async () =>{
        let cheese1 = Cheese.create({
            title: 'Cheddar',
            description: 'Mature Cheddar cheese'
        })
        expect((await cheese1).dataValues.title).toBe('Cheddar');
        expect((await cheese1).dataValues.description).toBe('Mature Cheddar cheese');
    });

    //Testing the relationships/associations
    test('Testing the association between User and Board', async () => {
        const foundUser = await User.findByPk(1)
        await foundUser.addBoard(1)//Added the christmas board to the user1 User
        await foundUser.addBoard(2)//Added the worse board to the user1 User
        const UserBoard = await foundUser.getBoards()//This gets the christmas boards associated with the user with id 1
        expect((await UserBoard)[0].dataValues['type']).toBe('festive');
        expect((await UserBoard)[0].dataValues['description']).toBe('Christmas themed cheeseboard');
    });


    test('Testing the association between Board and Cheese', async () => {
        const foundBoard = await Board.findByPk(1)
        await foundBoard.addCheese(1)//Added Cheddar to the christmas board
        const BoardCheese = await foundBoard.getCheeses()//Gets the cheese that was added (cheddar)
        expect((await BoardCheese)[0].dataValues['title']).toBe('Cheddar');
        expect((await BoardCheese)[0].dataValues['description']).toBe('Mature Cheddar cheese');
    });

    //Eager loading tests
    test('Testing that a board can be loaded with its cheeses', async () => {
        const boardCheese = await Board.findAll({
            where:{// The where clause should allow us to narrow down our search and only look for the cheese associated with board (id = 1)
                id:1
            },
            include: [
                { model: Cheese}
            ]
        })
        expect((await boardCheese)[0].dataValues.cheeses.length).toBe(1);
        expect((await boardCheese)[0].dataValues.cheeses[0].dataValues.title).toBe('Cheddar');//The cheese is stored in an array because it is a many to many
    })


    test('Testing that a user can be loaded with its boards', async () => {
        const userBoard = await User.findAll({
            where:{
                id:1
            },
            include: [
                { model: Board}
            ]
        })
        expect((await userBoard)[0].dataValues.boards.length).toBe(2);//There can be many boards per user so boards will be stored in an array
        expect((await userBoard)[0].dataValues.boards[0].type).toBe('festive');
        expect((await userBoard)[0].dataValues.boards[0].description).toBe('Christmas themed cheeseboard');
        //need to account for bad board
    })


    test('Testing that a cheese can be loaded with its board', async () => {
        const BoardData = await Cheese.findAll({
            where:{
                id:1
            },
            include: [
                { model: Board}
            ]
        })
        expect((await BoardData)[0].dataValues.boards.length).toBe(1);//Pretty much the same tests as the user will have the same board as cheddar 
        expect((await BoardData)[0].dataValues.boards[0].type).toBe('festive');
        expect((await BoardData)[0].dataValues.boards[0].description).toBe('Christmas themed cheeseboard');
    })


});