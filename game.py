import pygame
from towers import Tower, LongRangeTower
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
    [{'type': 'strong', 'count': 3}]   # Wave 3: 3 strong enemies
]

# Initialize stage
stage = Stage(waves)

# Initialize towers list
towers = []

# Selected tower type
selected_tower_type = Tower  # Default tower type

# Initialize score
score = 0

# Initialize font
pygame.font.init()
font = pygame.font.SysFont('Arial', 20)

# Game loop
running = True
game_over = False
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
            new_tower = selected_tower_type(mouse_x, mouse_y)
            towers.append(new_tower)
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_1:
                selected_tower_type = Tower
            elif event.key == pygame.K_2:
                selected_tower_type = LongRangeTower

    # Spawn enemies every 3 seconds
    if frame_count % (60 * 3) == 0:
        stage.spawn_enemies()

    # Clear the screen
    screen.fill((0, 0, 0))  # Black background

    # Update stage
    stage.update()

    # Tower targeting and attacking
    for tower in towers:
        tower.target(stage.enemies)
        if tower.target_enemy:
            if tower.attack():
                stage.enemies.remove(tower.target_enemy)
                score += 10  # Increase score when enemy is defeated

    # Check for game over
    for enemy in stage.enemies[:]:
        if enemy.has_reached_end(screen_width):
            game_over = True
            running = False
            break

    # Draw stage
    stage.draw(screen)

    # Draw towers
    for tower in towers:
        tower.draw(screen)

    # Render score and wave number
    score_text = font.render(f'Score: {score}', True, (255, 255, 255))
    wave_text = font.render(f'Wave: {stage.current_wave + 1}', True, (255, 255, 255))
    screen.blit(score_text, (10, 10))
    screen.blit(wave_text, (10, 30))

    # Update display
    pygame.display.flip()

    clock.tick(60)
    frame_count += 1

# Game Over screen
if game_over:
    game_over_text = font.render("Game Over", True, (255, 0, 0))
    screen.blit(game_over_text, (screen_width // 2 - 50, screen_height // 2))
    pygame.display.flip()
    pygame.time.wait(2000)  # Wait for 2 seconds

# Quit Pygame
pygame.quit()
