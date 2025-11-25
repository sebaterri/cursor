import pygame
from towers import Tower
from enemies import Enemy
from stages import Stage

# Initialize Pygame
pygame.init()

# Set screen dimensions
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Tower Defense")

# Initialize stage
stage = Stage()

# Add an enemy to the stage
enemy = Enemy(50, 50)
stage.add_enemy(enemy)

# Initialize a tower
tower = Tower(100, 100)

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Clear the screen
    screen.fill((0, 0, 0))  # Black background

    # Update stage
    stage.update()

    # Draw stage
    stage.draw(screen)

    # Draw tower
    tower.draw(screen)

    # Update display
    pygame.display.flip()

# Quit Pygame
pygame.quit()
