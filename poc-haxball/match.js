export default class match extends Phaser.Scene {

    constructor()
    { super('match') }

    check_mov_player_one(){
        
        if(this.cursor_one.space.isDown){
            this.player_one.alpha = 1
        }
        if (this.cursor_one.left.isDown){
            this.player_one.setVelocityX(-150);       
        }      

        else if (this.cursor_one.right.isDown){
            this.player_one.setVelocityX(150);      
        }      

        else if (this.cursor_one.up.isDown){
            this.player_one.setVelocityY(-150);      
        }      

        else if (this.cursor_one.down.isDown){
            this.player_one.setVelocityY(150);   
        }  

        else if (this.cursor_one.space.isUp && this.cursor_one.left.isUp && this.cursor_one.right.isUp && this.cursor_one.up.isUp && this.cursor_one.down.isUp){
            this.player_one.setVelocity(0)
            this.player_one.alpha = 0.8
        }

        


    }

    check_mov_player_two(){

        if(this.cursor_two.space.isDown){
            this.player_two.alpha = 1
        }
        if (this.cursor_two.left.isDown){
            this.player_two.setVelocityX(-150);       
        }      

        else if (this.cursor_two.right.isDown){
            this.player_two.setVelocityX(150);      
        }      

        else if (this.cursor_two.up.isDown){
            this.player_two.setVelocityY(-150);      
        }      

        else if (this.cursor_two.down.isDown){
            this.player_two.setVelocityY(150);   
        }  

        else if (this.cursor_two.space.isUp && this.cursor_two.left.isUp && this.cursor_two.right.isUp && this.cursor_two.up.isUp && this.cursor_two.down.isUp){
            this.player_two.setVelocity(0)
            this.player_two.alpha = 0.8
        }

    }

    check_touching_ball(){
        this.timedEvent.paused = false    
    }
            
    stop_ball(){
        for (var speed = 100; speed >= 0; speed--){
            this.ball.setVelocity(speed)
        }
        this.timedEvent=this.time.delayedCall(500, this.stop_ball, [], this);
        this.timedEvent.paused = true
    }

    preload()
    {
        
        
        this.load.image('bkg', 'assets/bkg.png');
        this.load.image('ball', 'assets/ball.png')      
        this.load.image('goal-net', 'assets/goal-net.png')
        this.load.image('side-line', 'assets/side-line.png')
        this.load.image('side-line-back', 'assets/side-line-back.png')
        this.load.image('mid-field', 'assets/mid-field.png')
        this.load.image('mid-field-circle', 'assets/mid-field-circle.png')
        this.load.image('player-one', 'assets/player-one.png')
        this.load.image('player-two', 'assets/player-two.png') 


    }


    players_collision(){
        this.physics.add.collider(this.player_one, this.player_two);

        this.physics.add.collider(this.player_one, this.side_line); 
        this.physics.add.collider(this.player_two, this.side_line);
        this.physics.add.collider(this.ball, this.side_line); 
        
        this.physics.add.collider(this.player_one,this.side_line_back)
        this.physics.add.collider(this.player_two,this.side_line_back)
        this.physics.add.collider(this.ball,this.side_line_back)

        this.physics.add.collider(this.player_one,this.net)
        this.physics.add.collider(this.player_two,this.net)
        this.physics.add.collider(this.ball,this.net)

        this.physics.add.overlap(this.player_one, this.goal_line); 
        this.physics.add.overlap(this.player_two, this.goal_line); 
        this.physics.add.overlap(this.ball, this.goal_line); 

        

    }


    create_field(){

        this.add.image(480,270,'bkg').setScale(0.5)
        
        this.side_line = this.physics.add.staticGroup()
        this.side_line.create(480,477.5,'side-line').setScale(0.5).refreshBody();
        this.side_line.create(480,62.5,'side-line').setScale(0.5).refreshBody();
        
        this.side_line_back = this.physics.add.staticGroup()

        this.side_line_back.create(108.5,130.5,'side-line-back').setScale(0.5).refreshBody();
        this.side_line_back.create(851.5,130.5,'side-line-back').setScale(0.5).refreshBody();
        
        this.side_line_back.create(108.5,409.5,'side-line-back').setScale(0.5).refreshBody();
        this.side_line_back.create(851.5,409.5,'side-line-back').setScale(0.5).refreshBody();

        this.goal_line = this.physics.add.staticGroup()
        this.goal_line.create(108.5,270,'side-line-back').setScale(0.5).refreshBody();
        this.goal_line.create(851.6,270,'side-line-back').setScale(0.5).refreshBody();

        this.net = this.physics.add.staticGroup()
        this.net.create(58.5,270,'side-line-back').setScale(0.5).refreshBody();
        this.net.create(81,340.5,'goal-net').setScale(0.5).refreshBody();
        this.net.create(81,199.5,'goal-net').setScale(0.5).refreshBody();

        this.net.create(901.5,270,'side-line-back').setScale(0.5).refreshBody();
        this.net.create(879,340.5,'goal-net').setScale(0.5).refreshBody();
        this.net.create(879,199.5,'goal-net').setScale(0.5).refreshBody();

        this.mid_field = this.physics.add.staticGroup()
        this.mid_field.create(480,270,'mid-field').setScale(0.5).refreshBody();
        this.mid_field.create(480,270,'mid-field-circle').setScale(0.5).refreshBody();

       
        
    }

    create()
    {
        this.timedEvent = this.time.delayedCall(500, this.stop_ball, [], this);
        this.timedEvent.paused = true
        this.create_field()
        
        this.player_one = this.physics.add.sprite(240, 270, 'player-one');
        this.player_one.setScale(0.5)
        this.player_one.setCollideWorldBounds(true);  
        this.player_one.alpha = 0.8
        
        
        this.player_two = this.physics.add.sprite(720, 270, 'player-two');
        this.player_two.setCollideWorldBounds(true);   
        this.player_two.setScale(0.5)   
        this.player_two.alpha = 0.8

        this.ball = this.physics.add.image(480,270, 'ball')
        this.ball.setScale(0.5)
              
        this.players_collision()

   

        this.cursor_one = this.input.keyboard.createCursorKeys();
        this.cursor_two = this.input.keyboard.addKeys(
            {             
                'left' : Phaser.Input.Keyboard.KeyCodes.A,
                'right': Phaser.Input.Keyboard.KeyCodes.D, 
                'up'   : Phaser.Input.Keyboard.KeyCodes.W, 
                'down' : Phaser.Input.Keyboard.KeyCodes.S,
                'space': Phaser.Input.Keyboard.KeyCodes.C 
            }
            )
   
            this.c_one_ball = this.physics.add.collider(this.player_one, this.ball, this.check_touching_ball, null,this);
            this.c_two_ball = this.physics.add.collider(this.player_two, this.ball, this.check_touching_ball, null,this);
           
 
        
        }

    update()
    {         
        this.check_mov_player_one()
        this.check_mov_player_two()
    
                     
    }


}

