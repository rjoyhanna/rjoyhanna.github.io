#### prog67.py
#### Rachel Hanna
#### March 10, 2017

board = [[0, 1, 1],
         [1, 0, 0],
         [2, 2, 2]]
import copy
def generateBoard(currentBoard,row,space,newSpace,team,moveDirection):
    newBoard=copy.deepcopy(currentBoard)
    newBoard[row][space] = 0
    newBoard[row+moveDirection][newSpace] = team
    return newBoard

def testBoard(spaceTeam,space,team,currentBoard,row,moveDirection,otherTeam):
    possibilities=[]
    if space == 0:
        if spaceTeam == team and currentBoard[row+moveDirection][space] == 0:
            possibilities.append('forwardMove')
        if spaceTeam == team and currentBoard[row+moveDirection][space+1] == otherTeam:
            possibilities.append('rightMove')
        else:
            possibilities.append('noMove')  
    elif space == (len(currentBoard[row])-1):
        if spaceTeam == team and currentBoard[row+moveDirection][space] == 0:
            possibilities.append('forwardMove')
        if spaceTeam == team and currentBoard[row+moveDirection][space-1] == otherTeam:
            possibilities.append('leftMove')
        else:
            possibilities.append('noMove')
    else:
        if spaceTeam == team and currentBoard[row+moveDirection][space] == 0:
            possibilities.append('forwardMove')
        if spaceTeam == team and currentBoard[row+moveDirection][space-1] == otherTeam:
            possibilities.append('leftMove')
        if spaceTeam == team and currentBoard[row+moveDirection][space+1] == otherTeam:
            possibilities.append('rightMove')
        else:
            possibilities.append('noMove')          
    return possibilities

def move_maker(currentBoard,team):
    '''team: 1=program controls white pawns; 2=program controls black pawns'''
    if team == 1:
        moveDirection = 1
        otherTeam=2
    elif team ==2:
        moveDirection = -1
        otherTeam=1
    possibleMoves = []
    for row in range(len(currentBoard)):
        for space in range(len(currentBoard[row])):
            spaceTeam=currentBoard[row][space]
            possibilities = testBoard(spaceTeam,space,team,currentBoard,row,moveDirection,otherTeam)
            for possibility in possibilities:
                if possibility == 'forwardMove':
                    newSpace=space
                    newBoard = generateBoard(currentBoard,row,space,newSpace,team,moveDirection)
                    possibleMoves.append(newBoard)
                elif possibility == 'leftMove':
                    newSpace=space-1
                    newBoard = generateBoard(currentBoard,row,space,newSpace,team,moveDirection)
                    possibleMoves.append(newBoard)
                elif possibility == 'rightMove':
                    newSpace=space+1
                    newBoard = generateBoard(currentBoard,row,space,newSpace,team,moveDirection)
                    possibleMoves.append(newBoard)
    return possibleMoves

def numberOfTeam(move,team):
    count=0
    for row in move:
        for space in row:
            if space==team:
                count+=1
    return count

def numberOfOtherTeam(move,team):
    if team ==1:
        team=2
    else:
        team=1
    count=0
    for row in move:
        for space in row:
            if space==team:
                count+=1
    return count

def whosWinning(move,team):
    teamn = numberOfTeam(move,team)
    otherTeamn = numberOfOtherTeam(move,team)
    if otherTeamn == 0:
        winning = 1000
        return winning
    else:
        number=teamn-otherTeamn
        winning=number*100
        return winning

def proximityToVictory(move,team):
    newvalue=0
    if team==1:
        victory = len(move)
    else:
        victory = 0
    for row in range(len(move)):
        for space in range(len(move[row])):
            if move[row][space] == team and row == victory:
                newvalue=1000
    return newvalue
 
def blocks(move,team):
    blocks=0
    if team == 1:
        moveDirection = 1
        otherTeam=2
    elif team ==2:
        moveDirection = -1
        otherTeam=1
    for row in range(len(move)):
        for space in range(len(move[row])):
            if space == 0:
                if move[row][space] == team and move[row+moveDirection][space] == otherTeam and move[row][space+1]==0:
                    blocks=blocks+10
            elif space== len(move[row])-1:
                if move[row][space] == team and move[row+moveDirection][space] == otherTeam and move[row][space-1]==0:
                    blocks=blocks+10
            else:
                if move[row][space] == team and move[row+moveDirection][space] == otherTeam and (move[row][space-1]==0 or otherTeam) and (move[row][space+1]==0 or otherTeam):
                    blocks=blocks+10
    return blocks

def danger(move,team):
    dangers=0
    if team == 1:
        moveDirection = 1
        otherTeam=2
    elif team ==2:
        moveDirection = -1
        otherTeam=1
    for row in range(len(move)):
        for space in range(len(move[row])):
            if space == 0:
                if move[row][space] == team and move[row+moveDirection][space+1] == otherTeam:
                    dangers=dangers-200
            elif space== len(move[row])-1:
                if move[row][space] == team and move[row+moveDirection][space-1] == otherTeam:
                    dangers=dangers-200
            else:
                if move[row][space] == team and move[row+moveDirection][space+1] == otherTeam and move[row+moveDirection][space-1]==otherTeam:
                    dangers=dangers-250
                elif move[row][space] == team and (move[row+moveDirection][space+1] == otherTeam or move[row+moveDirection][space-1]==otherTeam):
                    dangers=dangers-200
    
    return dangers

### docstrings
### test on all board sizes

def valueof(move,team):
    winning = whosWinning(move,team)
    proximity = proximityToVictory(move,team)
    block = blocks(move,team)
    dangers = danger(move,team)
    value = winning + proximity + block + dangers
    return value
    

def move_chooser(possibleMoves,team):
    bestMove=possibleMoves[0]
    highValue=0
    for move in possibleMoves:
        value = valueof(move,team)
        if value>=highValue:
            value=highValue
            bestMove=move
    return bestMove

mlist=[[[0, 1, 1], [2, 0, 0], [2, 0, 2]],
       [[0, 1, 1], [1, 2, 0], [2, 0, 2]],
       [[0, 1, 1], [1, 0, 2], [2, 2, 0]]]

## miniChessDriver.py
## version 0.1
## March 1, 2017

## Here's the crude, unpolished first version of a user
## interface for your miniChess function

## It doesn't really know much about who wins the game
## or when...although it does know that if it can't make
## a move, the human player wins.

## It does not validate the coordinates for the move
## that is entered by the user.  You can move any pawn
## on either side to any square.  So be careful.

## your definitions for move_maker and
## move_chooser go up here in this space




## below is what we supply ======================================


## print a board
## 0 prints as '-', 1 prints as 'w', 2 prints as 'b'

def printBoard(board):
    print("   ", end = "")
    for i in range(0, len(board[0])):
        print(str(i)+" ", end = "")

    print("\n")
    row = 0
    for r in board:
        print(row, " ", end = "")
        for c in r:
            if c == 1:
                print("w ", end = "")
            elif c == 2:
                print("b ", end = "")
            else:
                print("- ", end = "")
        print()
        row = row + 1
    print()
            

## create an initial board, with dimension
## passed as the argument. 1s at the top,
## 2s at the bottom, 0s everywhere else
    
def makeInitBoard(dim):
    board = []
    for i in range(0,dim):
        row = []
        for j in range(0,dim):
            row.append(0)
        board.append(row)

    for i in range(0,dim):
        board[0][i] = 1
        board[dim - 1][i] = 2
        
    return board


## this is the user interface for the miniChess game.
## just run the program and type 'miniChess()' in the
## interaction window

def miniChess():
    from random import randint

    print("Welcome to miniChess")

    ## ask for board size and create initial board
    
    dim = int(input("What size board would you like? \n(enter an integer greater than 2): "))
    bheight = dim
    bwidth = dim
    b = makeInitBoard(dim)
    
    print("\nHere's the initial board...\n")
    
    printBoard(b)

    ## ask user to select color of pawns
    ## if user selects white, then the program's color is 2 (i.e., black)
    ## if user selects black, then the program's color is 1 (i.e., white)

    while True:
        answer = input("Choose the white pawns or black pawns (enter 'w' or 'b' or 'quit'): ")
        if answer == "w":
            mycolor = 2
            break
        if answer == "b":
            mycolor = 1
            break
        if answer == "quit":
            print("Ending the game")
            return

    ## if program has white pawns, generate program's first move

    if mycolor == 1:
        print("Here's my opening move...\n")
        column = randint(0, bwidth - 1)
        b[1][column] = b[0][column]
        b[0][column] = 0
        printBoard(b)

    ## game loop

    while True:
        
        ## ask for user's move
        ## coordinates are not validated at this time
        
        print("\nEnter the coordinates of the pawn you wish to move:")
        fromrow = int(input("   row: "))
        fromcol = int(input("   col: "))
        print("Enter the coordinates of the destination square: ")
        torow = int(input("   row: "))
        tocol = int(input("   col: ")) # oops
        b[torow][tocol] = b[fromrow][fromcol]
        b[fromrow][fromcol] = 0
        print("This is your move...\n")
        printBoard(b)

        ## here is where the program uses the functions created by the student
        
        possiblemoves = move_maker(b, mycolor)  # don't change this function call
        if possiblemoves == []:
            print("I can't move\nCongratulations! You win!")
            return
        b = move_chooser(possiblemoves, mycolor) # don't change this function call


        print("Here's my response...\n")
        printBoard(b)

