export default class match extends Phaser.Scene {

    constructor()
    { super('match') }

    check_mov_player_one(){
        
        if (this.cursor_one.left.isDown){
            this.player_one.setVelocityX(-550);       
        }      

        else if (this.cursor_one.right.isDown){
            this.player_one.setVelocityX(250);      
        }      

        else if (this.cursor_one.up.isDown){
            this.player_one.setVelocityY(-250);      
        }      

        else if (this.cursor_one.down.isDown){
            this.player_one.setVelocityY(250);   
        }  

        else if (this.cursor_one.left.isUp && this.cursor_one.right.isUp && this.cursor_one.up.isUp && this.cursor_one.down.isUp){
            this.player_one.setVelocity(0)
        }

    }

    check_mov_player_two(){
        if (this.cursor_two.left.isDown){
            this.player_two.setVelocityX(-250);       
        }      

        else if (this.cursor_two.right.isDown){
            this.player_two.setVelocityX(250);      
        }      

        else if (this.cursor_two.up.isDown){
            this.player_two.setVelocityY(-250);      
        }      

        else if (this.cursor_two.down.isDown){
            this.player_two.setVelocityY(250);   
        }  

        else if (this.cursor_two.left.isUp && this.cursor_two.right.isUp && this.cursor_two.up.isUp && this.cursor_two.down.isUp){
            this.player_two.setVelocity(0)
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
        this.load.image('limits','assets/limits.png')
        this.load.image('goal-line', 'assets/goal-line.png')
        this.load.image('mid-field', 'assets/mid-field.png')
        this.load.image('ball', 'assets/ball.png')

        this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    ); 


    }

    create()
    {
        this.timedEvent = this.time.delayedCall(500, this.stop_ball, [], this);
        this.timedEvent.paused = true
        
        this.add.image(960,540,'bkg')
        
        this.add.image(960,540,'mid-field')

        this.goal_lines = this.physics.add.staticGroup();
        this.goal_lines.create(220.5, 550, 'goal-line');
        this.goal_lines.create(1685.5, 550, 'goal-line');

        this.limits = this.physics.add.staticGroup()
        this.limits.create(960,540,'limits')

        this.ball = this.physics.add.image(600,200, 'ball')
        
        this.player_one = this.physics.add.sprite(250, 250, 'dude');
        this.player_one.setCollideWorldBounds(true);     

        this.player_two = this.physics.add.sprite(850, 250, 'dude');
        this.player_two.setCollideWorldBounds(true);        

        this.cursor_one = this.input.keyboard.createCursorKeys();
        this.cursor_two = this.input.keyboard.addKeys(
            {             
                'left' : Phaser.Input.Keyboard.KeyCodes.A,
                'right': Phaser.Input.Keyboard.KeyCodes.D, 
                'up'   : Phaser.Input.Keyboard.KeyCodes.W, 
                'down' : Phaser.Input.Keyboard.KeyCodes.S 
            }
            )
   
        
        this.c_playerone_limits = this.physics.add.collider(this.player_one, this.limits); 
        this.c_playertwo_limits = this.physics.add.collider(this.player_two, this.limits); 
        this.c_player = this.physics.add.collider(this.player_one, this.player_two);
        this.c_one_ball = this.physics.add.collider(this.player_one, this.ball, this.check_touching_ball, null, this);
        this.c_two_ball = this.physics.add.collider(this.player_two, this.ball, this.check_touching_ball,  null,this);
        }

    update()
    {         
        this.check_mov_player_one()
        this.check_mov_player_two()
    
                     
    }


}

