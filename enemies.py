# enemies.py

import pygame

class Enemy:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.health = 50
        self.speed = 1

    def move(self):
        self.x += self.speed

    def draw(self, screen):
        pygame.draw.rect(screen, (255, 0, 0), (self.x, self.y, 20, 20))

    def has_reached_end(self, screen_width):
        return self.x >= screen_width

class StrongEnemy(Enemy):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.health = 150  # Increased health
        self.speed = 0.5

    def draw(self, screen):
        pygame.draw.rect(screen, (255, 100, 100), (self.x, self.y, 30, 30))

class FastEnemy(Enemy):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.health = 20  # Decreased health
        self.speed = 2

    def draw(self, screen):
        pygame.draw.rect(screen, (0, 255, 255), (self.x, self.y, 15, 15))

class StrongEnemy(Enemy):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.health = 100
        self.speed = 0.5

    def draw(self, screen):
        pygame.draw.rect(screen, (255, 100, 100), (self.x, self.y, 30, 30))

        pygame.draw.rect(screen, (255, 0, 0), (self.x, self.y, 20, 20))
