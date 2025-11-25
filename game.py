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

# Initialize towers list
towers = []

# Game loop
running = True
clock = pygame.time.Clock()
frame_count = 0

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            # Get the mouse position
            mouse_x, mouse_y = event.pos
            # Create a new tower at the mouse position
            new_tower = Tower(mouse_x, mouse_y)
            towers.append(new_tower)

    # Spawn enemies every 3 seconds
    if frame_count % (60 * 3) == 0:
        stage.spawn_enemies()

    # Clear the screen
    screen.fill((0, 0, 0))  # Black background

    # Update stage
    stage.update()

    # Draw stage
    stage.draw(screen)

    # Draw towers
    for tower in towers:
        tower.draw(screen)

    # Update display
    pygame.display.flip()

    clock.tick(60)
    frame_count += 1

# Quit Pygame
pygame.quit()
