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

# Define waves for the stage
waves = [
    [{'type': 'basic', 'count': 5}],  # Wave 1: 5 basic enemies
    [{'type': 'basic', 'count': 10}], # Wave 2: 10 basic enemies
]

# Initialize stage
stage = Stage(waves)

# Initialize a tower
tower = Tower(100, 100)

# Game loop
running = True
clock = pygame.time.Clock()
frame_count = 0

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Spawn enemies every 3 seconds
    if frame_count % (60 * 3) == 0:
        stage.spawn_enemies()

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

    clock.tick(60)
    frame_count += 1

# Quit Pygame
pygame.quit()
